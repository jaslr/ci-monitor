#!/usr/bin/env node
/**
 * Fetch SVG logos from Simple Icons CDN
 * Run with: node scripts/fetch-logos.mjs
 */

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const SIMPLE_ICONS_CDN = 'https://cdn.simpleicons.org';

// Infrastructure providers - mapping our names to Simple Icons slugs
const infraLogos = {
  'cloudflare': 'cloudflare',
  'flyio': 'flydotio',
  'vercel': 'vercel',
  'netlify': 'netlify',
  'supabase': 'supabase',
  'planetscale': 'planetscale',
  'github': 'github',
  'auth0': 'auth0',
  'clerk': 'clerk',
  'sentry': 'sentry',
  'resend': 'resend',
  'plausible': 'plausibleanalytics',
  'posthog': 'posthog',
};

// Tech stack items - mapping our names to Simple Icons slugs
const techLogos = {
  'sveltekit': 'svelte',
  'svelte': 'svelte',
  'nextjs': 'nextdotjs',
  'react': 'react',
  'angular': 'angular',
  'nuxt': 'nuxt',
  'vue': 'vuedotjs',
  'astro': 'astro',
  'nodejs': 'nodedotjs',
  'express': 'express',
  'tailwind': 'tailwindcss',
  'skeleton': 'skeleton',
  'daisyui': 'daisyui',
  'bootstrap': 'bootstrap',
  'bulma': 'bulma',
  'angular-material': 'angular',
  'styled-components': 'styledcomponents',
  'sass': 'sass',
  'cypress': 'cypress',
  'vitest': 'vitest',
  'jest': 'jest',
  'mocha': 'mocha',
  'vite': 'vite',
  'webpack': 'webpack',
  'esbuild': 'esbuild',
  'rollup': 'rollupdotjs',
  'turbopack': 'turborepo',
  'npm': 'npm',
  'pnpm': 'pnpm',
  'yarn': 'yarn',
  'bun': 'bun',
  'lucide': 'lucide',
  'fontawesome': 'fontawesome',
  'typescript': 'typescript',
  'javascript': 'javascript',
  'python': 'python',
  'go': 'go',
  'rust': 'rust',
};

async function fetchLogo(slug, outputPath) {
  try {
    const url = `${SIMPLE_ICONS_CDN}/${slug}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.log(`  [SKIP] ${slug} - HTTP ${response.status}`);
      return false;
    }

    const svg = await response.text();

    if (!svg.includes('<svg')) {
      console.log(`  [SKIP] ${slug} - Not an SVG`);
      return false;
    }

    await writeFile(outputPath, svg);
    console.log(`  [OK] ${slug}`);
    return true;
  } catch (err) {
    console.log(`  [ERROR] ${slug} - ${err.message}`);
    return false;
  }
}

async function main() {
  const baseDir = join(process.cwd(), 'logos-temp');
  const infraDir = join(baseDir, 'infra');
  const techDir = join(baseDir, 'techstack');

  await mkdir(infraDir, { recursive: true });
  await mkdir(techDir, { recursive: true });

  console.log('Fetching infrastructure logos...');
  let infraCount = 0;
  for (const [name, slug] of Object.entries(infraLogos)) {
    const outputPath = join(infraDir, `${name}.svg`);
    if (await fetchLogo(slug, outputPath)) {
      infraCount++;
    }
  }
  console.log(`\nInfrastructure: ${infraCount}/${Object.keys(infraLogos).length} logos fetched\n`);

  console.log('Fetching tech stack logos...');
  let techCount = 0;
  for (const [name, slug] of Object.entries(techLogos)) {
    const outputPath = join(techDir, `${name}.svg`);
    if (await fetchLogo(slug, outputPath)) {
      techCount++;
    }
  }
  console.log(`\nTech Stack: ${techCount}/${Object.keys(techLogos).length} logos fetched\n`);

  console.log(`Total: ${infraCount + techCount} logos saved to ${baseDir}`);
}

main().catch(console.error);
