/**
 * DNS Lookup Service
 *
 * Server-side DNS queries to discover:
 * - Nameservers (reveals DNS provider)
 * - A/AAAA/CNAME records (reveals hosting)
 * - MX records (reveals email provider)
 * - TXT records (reveals verification records, SPF, DKIM)
 */

import type { DnsInfo, DnsRecord } from '$lib/types/infrastructure';
import { detectDnsProvider, detectHostingFromDns, detectEmailFromMx } from './discovery';

// DNS-over-HTTPS endpoints (works from edge/serverless)
const DOH_ENDPOINTS = {
  cloudflare: 'https://cloudflare-dns.com/dns-query',
  google: 'https://dns.google/resolve',
};

interface DohResponse {
  Status: number;
  Answer?: Array<{
    name: string;
    type: number;
    TTL: number;
    data: string;
  }>;
  Authority?: Array<{
    name: string;
    type: number;
    TTL: number;
    data: string;
  }>;
}

// DNS record type numbers
const DNS_TYPES = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  MX: 15,
  TXT: 16,
  AAAA: 28,
};

const TYPE_NAMES: Record<number, DnsRecord['type']> = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  6: 'SOA',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
};

/**
 * Query DNS using DNS-over-HTTPS (works from edge functions)
 */
async function dohQuery(domain: string, type: keyof typeof DNS_TYPES): Promise<DohResponse> {
  const url = `${DOH_ENDPOINTS.cloudflare}?name=${encodeURIComponent(domain)}&type=${type}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/dns-json',
    },
  });

  if (!response.ok) {
    throw new Error(`DNS query failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Parse DNS response into our record format
 */
function parseRecords(response: DohResponse, expectedType?: number): DnsRecord[] {
  const records: DnsRecord[] = [];
  const answers = response.Answer || [];

  for (const answer of answers) {
    const typeName = TYPE_NAMES[answer.type];
    if (!typeName) continue;
    if (expectedType && answer.type !== expectedType) continue;

    records.push({
      type: typeName,
      name: answer.name.replace(/\.$/, ''), // Remove trailing dot
      value: answer.data.replace(/\.$/, ''),
      ttl: answer.TTL,
    });
  }

  return records;
}

/**
 * Get all DNS information for a domain
 */
export async function lookupDomain(domain: string, projectId: string): Promise<DnsInfo> {
  const records: DnsRecord[] = [];
  const errors: string[] = [];

  // Query different record types in parallel
  const queries = [
    { type: 'A' as const, typeNum: DNS_TYPES.A },
    { type: 'AAAA' as const, typeNum: DNS_TYPES.AAAA },
    { type: 'CNAME' as const, typeNum: DNS_TYPES.CNAME },
    { type: 'MX' as const, typeNum: DNS_TYPES.MX },
    { type: 'NS' as const, typeNum: DNS_TYPES.NS },
    { type: 'TXT' as const, typeNum: DNS_TYPES.TXT },
  ];

  const results = await Promise.allSettled(
    queries.map(async ({ type, typeNum }) => {
      try {
        const response = await dohQuery(domain, type);
        return parseRecords(response, typeNum);
      } catch (e) {
        errors.push(`${type}: ${e instanceof Error ? e.message : 'Unknown error'}`);
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      records.push(...result.value);
    }
  }

  // Extract nameservers
  const nameservers = records
    .filter(r => r.type === 'NS')
    .map(r => r.value);

  // Detect providers
  const dnsProvider = detectDnsProvider(nameservers);
  const mxRecords = records.filter(r => r.type === 'MX');
  const emailProvider = detectEmailFromMx(mxRecords);
  const hostingProvider = detectHostingFromDns(records);

  return {
    projectId,
    domain,
    dnsProvider,
    nameservers,
    records,
    sslStatus: 'unknown', // Would need separate SSL check
    lastChecked: new Date().toISOString(),
  };
}

/**
 * Extract domain from various URL formats
 */
export function extractDomain(input: string): string {
  // Remove protocol
  let domain = input.replace(/^https?:\/\//, '');

  // Remove path
  domain = domain.split('/')[0];

  // Remove port
  domain = domain.split(':')[0];

  // Remove www prefix for consistency
  domain = domain.replace(/^www\./, '');

  return domain.toLowerCase();
}

/**
 * Check if SSL certificate is valid (basic check via HTTPS request)
 */
export async function checkSslStatus(domain: string): Promise<'valid' | 'invalid' | 'unknown'> {
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      redirect: 'manual',
    });

    // If we got a response, SSL is working
    return 'valid';
  } catch (e) {
    // Connection failed - could be SSL issue or site down
    return 'unknown';
  }
}

/**
 * Discover production domain from config files
 */
export function findProductionDomain(config: {
  wrangler?: Record<string, unknown>;
  fly?: Record<string, unknown>;
  vercel?: Record<string, unknown>;
  envVars?: string;
}): string | undefined {
  // Check wrangler.toml routes
  if (config.wrangler?.route) {
    const route = String(config.wrangler.route);
    const match = route.match(/([a-z0-9-]+\.[a-z]+)/i);
    if (match) return match[1];
  }

  // Check fly.toml
  if (config.fly?.app) {
    return `${config.fly.app}.fly.dev`;
  }

  // Check env vars for domain hints
  if (config.envVars) {
    const domainMatch = config.envVars.match(/(?:PUBLIC_)?(?:SITE_)?(?:APP_)?URL\s*=\s*["']?https?:\/\/([^"'\s]+)/i);
    if (domainMatch) {
      return extractDomain(domainMatch[1]);
    }
  }

  return undefined;
}
