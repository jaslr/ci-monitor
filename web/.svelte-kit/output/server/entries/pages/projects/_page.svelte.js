import { w as spread_props, x as attr_class, G as attr, J as attr_style, y as stringify, F as ensure_array_like, K as clsx, z as head } from "../../../chunks/index2.js";
import { g as getProjectInfrastructure } from "../../../chunks/infrastructure.js";
import "../../../chunks/client.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { P as Plus } from "../../../chunks/plus.js";
import { S as Server } from "../../../chunks/server.js";
import { T as Triangle_alert, D as Database, A as Arrow_down_a_z, C as Chevron_down } from "../../../chunks/triangle-alert.js";
import { G as Git_branch } from "../../../chunks/git-branch.js";
import { C as Cloud } from "../../../chunks/cloud.js";
import { E as External_link } from "../../../chunks/external-link.js";
import { j as escape_html } from "../../../chunks/context.js";
import { L as Layers } from "../../../chunks/layers.js";
function Chart_column($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M3 3v16a2 2 0 0 0 2 2h16" }],
      ["path", { "d": "M18 17V9" }],
      ["path", { "d": "M13 17V5" }],
      ["path", { "d": "M8 17v-3" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "chart-column" },
      /**
       * @component @name ChartColumn
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAzdjE2YTIgMiAwIDAgMCAyIDJoMTYiIC8+CiAgPHBhdGggZD0iTTE4IDE3VjkiIC8+CiAgPHBhdGggZD0iTTEzIDE3VjUiIC8+CiAgPHBhdGggZD0iTTggMTd2LTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chart-column
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Globe($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      [
        "path",
        { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }
      ],
      ["path", { "d": "M2 12h20" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "globe" },
      /**
       * @component @name Globe
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMmExNC41IDE0LjUgMCAwIDAgMCAyMCAxNC41IDE0LjUgMCAwIDAgMC0yMCIgLz4KICA8cGF0aCBkPSJNMiAxMmgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/globe
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Hard_drive($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["line", { "x1": "22", "x2": "2", "y1": "12", "y2": "12" }],
      [
        "path",
        {
          "d": "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
        }
      ],
      ["line", { "x1": "6", "x2": "6.01", "y1": "16", "y2": "16" }],
      [
        "line",
        { "x1": "10", "x2": "10.01", "y1": "16", "y2": "16" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "hard-drive" },
      /**
       * @component @name HardDrive
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMjIiIHgyPSIyIiB5MT0iMTIiIHkyPSIxMiIgLz4KICA8cGF0aCBkPSJNNS40NSA1LjExIDIgMTJ2NmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTZsLTMuNDUtNi44OUEyIDIgMCAwIDAgMTYuNzYgNEg3LjI0YTIgMiAwIDAgMC0xLjc5IDEuMTF6IiAvPgogIDxsaW5lIHgxPSI2IiB4Mj0iNi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+CiAgPGxpbmUgeDE9IjEwIiB4Mj0iMTAuMDEiIHkxPSIxNiIgeTI9IjE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/hard-drive
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Key($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"
        }
      ],
      ["path", { "d": "m21 2-9.6 9.6" }],
      ["circle", { "cx": "7.5", "cy": "15.5", "r": "5.5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "key" },
      /**
       * @component @name Key
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUuNSA3LjUgMi4zIDIuM2ExIDEgMCAwIDAgMS40IDBsMi4xLTIuMWExIDEgMCAwIDAgMC0xLjRMMTkgNCIgLz4KICA8cGF0aCBkPSJtMjEgMi05LjYgOS42IiAvPgogIDxjaXJjbGUgY3g9IjcuNSIgY3k9IjE1LjUiIHI9IjUuNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/key
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Mail($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }],
      [
        "rect",
        { "x": "2", "y": "4", "width": "20", "height": "16", "rx": "2" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "mail" },
      /**
       * @component @name Mail
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjIgNy04Ljk5MSA1LjcyN2EyIDIgMCAwIDEtMi4wMDkgMEwyIDciIC8+CiAgPHJlY3QgeD0iMiIgeT0iNCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiByeD0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/mail
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Minus($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["path", { "d": "M5 12h14" }]];
    Icon($$renderer2, spread_props([
      { name: "minus" },
      /**
       * @component @name Minus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/minus
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Shield($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "shield" },
      /**
       * @component @name Shield
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/shield
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function InfraFlowDiagram($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      services,
      projectName,
      isDeploying = false,
      deploymentTimestamps
    } = $$props;
    let scale = 1;
    let nodes = buildNodes(services, projectName);
    let edges = buildEdges(nodes);
    let viewBox = () => {
      if (nodes.length === 0) return { x: 0, y: 0, width: 120, height: 90 };
      const padding = 18;
      const sidePadding = 12;
      const minX = Math.min(...nodes.map((n) => n.x ?? 0));
      const maxX = Math.max(...nodes.map((n) => n.x ?? 0));
      const minY = Math.min(...nodes.map((n) => n.y ?? 0));
      const maxY = Math.max(...nodes.map((n) => n.y ?? 0));
      const contentWidth = maxX - minX + sidePadding * 2;
      const contentHeight = maxY - minY + padding * 2;
      let viewBoxWidth = contentWidth;
      let viewBoxHeight = contentHeight;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      return {
        x: centerX - viewBoxWidth / 2,
        y: centerY - viewBoxHeight / 2,
        width: viewBoxWidth,
        height: viewBoxHeight
      };
    };
    const nodeIcons = {
      dns: Globe,
      cdn: Cloud,
      site: Globe,
      hosting: Cloud,
      api: Server,
      database: Database,
      auth: Shield,
      storage: Hard_drive,
      ci: Git_branch,
      monitoring: Triangle_alert,
      localdev: Server
    };
    const nodeColors = {
      dns: "#06b6d4",
      cdn: "#f97316",
      site: "#10b981",
      hosting: "#f97316",
      api: "#8b5cf6",
      database: "#22c55e",
      auth: "#eab308",
      storage: "#ec4899",
      ci: "#64748b",
      monitoring: "#ef4444",
      localdev: "#9ca3af"
    };
    const providerNames = {
      cloudflare: "Cloudflare",
      flyio: "Fly.io",
      supabase: "Supabase",
      github: "GitHub",
      sentry: "Sentry",
      aws: "AWS",
      vercel: "Vercel",
      netlify: "Netlify",
      google: "Google"
    };
    function formatTimestamp(isoString) {
      if (!isoString) return "";
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    }
    function getNodeTimestamp(nodeId) {
      if (!deploymentTimestamps) return void 0;
      switch (nodeId) {
        case "localdev":
          return deploymentTimestamps.pushStarted;
        case "ci":
          return deploymentTimestamps.ciStarted || deploymentTimestamps.ciCompleted;
        case "site":
          return deploymentTimestamps.deployCompleted || deploymentTimestamps.deployStarted;
        default:
          return void 0;
      }
    }
    function getLogoUrl(provider) {
      if (!provider) return null;
      const providersWithLogos = [
        "cloudflare",
        "flyio",
        "supabase",
        "github",
        "sentry",
        "vercel",
        "netlify",
        "auth0",
        "clerk",
        "planetscale",
        "plausible",
        "posthog",
        "resend"
      ];
      if (providersWithLogos.includes(provider)) {
        return `/api/logos/infra/${provider}.svg`;
      }
      return null;
    }
    function buildNodes(services2, name, siteDomain) {
      const nodes2 = [];
      const hasDb = services2.some((s) => s.category === "database");
      const hasAuth = services2.some((s) => s.category === "auth");
      const hasStorage = services2.some((s) => s.category === "storage");
      const hasCi = services2.some((s) => s.category === "ci");
      const hasMonitoring = services2.some((s) => s.category === "monitoring");
      const backendCount = [hasDb, hasAuth, hasStorage].filter(Boolean).length;
      const backendStartY = backendCount === 1 ? 70 : backendCount === 2 ? 50 : 30;
      const backendSpacing = 40;
      nodes2.push({
        id: "localdev",
        type: "localdev",
        label: "Local Dev",
        status: "unknown",
        x: -10,
        y: 15
      });
      if (hasCi) {
        const ciService = services2.find((s) => s.category === "ci");
        nodes2.push({
          id: "ci",
          type: "ci",
          label: "Deploy",
          provider: ciService.provider,
          status: ciService.status,
          dashboardUrl: ciService.dashboardUrl,
          x: 70,
          y: 15
        });
      }
      const hostingService = services2.find((s) => s.category === "hosting");
      const hostingProvider = hostingService?.provider;
      const hostingLabel = hostingProvider ? providerNames[hostingProvider] || hostingProvider : name;
      nodes2.push({
        id: "site",
        type: "site",
        label: hostingLabel,
        provider: hostingProvider,
        status: hostingService?.status || "unknown",
        dashboardUrl: hostingService?.dashboardUrl,
        x: 70,
        y: 70
      });
      let backendY = backendStartY;
      if (hasDb) {
        const dbService = services2.find((s) => s.category === "database");
        const dbProvider = providerNames[dbService.provider] || dbService.provider;
        nodes2.push({
          id: "database",
          type: "database",
          label: "DB",
          label2: dbProvider,
          provider: dbService.provider,
          status: dbService.status,
          dashboardUrl: dbService.dashboardUrl,
          x: 150,
          y: backendY
        });
        backendY += backendSpacing;
      }
      if (hasAuth) {
        const authService = services2.find((s) => s.category === "auth");
        const authProvider = providerNames[authService.provider] || authService.provider;
        nodes2.push({
          id: "auth",
          type: "auth",
          label: "Auth",
          label2: authProvider,
          provider: authService.provider,
          status: authService.status,
          dashboardUrl: authService.dashboardUrl,
          x: 150,
          y: backendY
        });
        backendY += backendSpacing;
      }
      if (hasStorage) {
        const storageService = services2.find((s) => s.category === "storage");
        const storageProvider = providerNames[storageService.provider] || storageService.provider;
        const storageName = storageService.provider === "cloudflare" ? "R2" : storageProvider;
        nodes2.push({
          id: "storage",
          type: "storage",
          label: "Storage",
          label2: storageName,
          provider: storageService.provider,
          status: storageService.status,
          dashboardUrl: storageService.dashboardUrl,
          x: 150,
          y: backendY
        });
      }
      if (hasMonitoring) {
        const monitoringService = services2.find((s) => s.category === "monitoring");
        const monitoringProvider = providerNames[monitoringService.provider] || monitoringService.provider;
        nodes2.push({
          id: "monitoring",
          type: "monitoring",
          label: "Errors",
          label2: monitoringProvider,
          provider: monitoringService.provider,
          status: monitoringService.status,
          dashboardUrl: monitoringService.dashboardUrl,
          x: 70,
          y: 125
        });
      }
      return nodes2;
    }
    function buildEdges(nodes2) {
      const edges2 = [];
      const nodeIds = new Set(nodes2.map((n) => n.id));
      if (nodeIds.has("localdev") && nodeIds.has("ci")) {
        edges2.push({
          id: "localdev-ci",
          source: "localdev",
          target: "ci",
          status: "idle",
          isDeployPipeline: true
        });
      }
      if (nodeIds.has("ci")) {
        edges2.push({
          id: "ci-site",
          source: "ci",
          target: "site",
          status: "idle",
          isDeployPipeline: true
        });
      }
      if (nodeIds.has("database")) {
        edges2.push({
          id: "site-database",
          source: "site",
          target: "database",
          status: "active"
        });
      }
      if (nodeIds.has("auth")) {
        edges2.push({
          id: "site-auth",
          source: "site",
          target: "auth",
          status: "active"
        });
      }
      if (nodeIds.has("storage")) {
        edges2.push({
          id: "site-storage",
          source: "site",
          target: "storage",
          status: "active"
        });
      }
      if (nodeIds.has("monitoring")) {
        edges2.push({
          id: "site-monitoring",
          source: "site",
          target: "monitoring",
          status: "idle"
        });
      }
      return edges2;
    }
    function getNodePosition(nodeId) {
      const node = nodes.find((n) => n.id === nodeId);
      return node ? { x: node.x || 0, y: node.y || 0 } : { x: 0, y: 0 };
    }
    function getEdgePath(source, target) {
      const nodeRadius = 12;
      const arrowGap = 2;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return {
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y,
        midX: source.x,
        midY: source.y,
        angle: 0
      };
      const nx = dx / dist;
      const ny = dy / dist;
      const x1 = source.x + nx * nodeRadius;
      const y1 = source.y + ny * nodeRadius;
      const x2 = target.x - nx * (nodeRadius + arrowGap);
      const y2 = target.y - ny * (nodeRadius + arrowGap);
      return {
        x1,
        y1,
        x2,
        y2,
        midX: (x1 + x2) / 2,
        midY: (y1 + y2) / 2,
        angle: Math.atan2(dy, dx) * 180 / Math.PI
      };
    }
    $$renderer2.push(`<div class="relative w-full h-full flex flex-col"><div class="absolute top-0 right-0 flex items-center gap-1 z-20"><button${attr_class(`flex items-center justify-center w-8 h-8 hover:bg-gray-700/50 text-xs transition-colors ${stringify("text-gray-200")}`)}${attr("title", "Hide logos")}><span${attr_class(`w-6 h-3 relative ${stringify("bg-green-600")} transition-colors`)}><span${attr_class(`absolute top-0.5 ${stringify("right-0.5")} w-2 h-2 bg-white transition-all`)}></span></span></button> <button class="flex items-center justify-center w-8 h-8 hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 transition-colors" title="Zoom out">`);
    Minus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button> <button class="flex items-center justify-center min-w-[40px] h-8 hover:bg-gray-700/50 text-xs text-gray-400 hover:text-gray-200 transition-colors font-mono" title="Reset zoom">${escape_html(Math.round(scale * 100))}%</button> <button class="flex items-center justify-center w-8 h-8 hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 transition-colors" title="Zoom in">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button></div> <div class="flex-1 w-full flex items-center justify-center overflow-hidden"><svg${attr("viewBox", `${stringify(viewBox().x)} ${stringify(viewBox().y)} ${stringify(viewBox().width)} ${stringify(viewBox().height)}`)} class="w-full h-full transition-transform" preserveAspectRatio="xMidYMid meet"${attr_style(`transform: scale(${stringify(scale)}); transform-origin: center;`)}><defs><marker id="arrow-active" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><polygon points="0 0, 6 2.5, 0 5" fill="#22c55e"></polygon></marker><marker id="arrow-idle" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><polygon points="0 0, 6 2.5, 0 5" fill="#4b5563"></polygon></marker><marker id="arrow-deploy" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><polygon points="0 0, 6 2.5, 0 5" fill="#06b6d4"></polygon></marker><style>
					@keyframes deployDash {
						to { stroke-dashoffset: -12; }
					}
					.deploy-animated {
						stroke-dasharray: 4 4;
						animation: deployDash 0.5s linear infinite;
					}
				</style></defs><!--[-->`);
    const each_array = ensure_array_like(edges);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let edge = each_array[$$index];
      const source = getNodePosition(edge.source);
      const target = getNodePosition(edge.target);
      const path = getEdgePath(source, target);
      const isDataFlow = edge.status === "active";
      const isDeployEdge = edge.isDeployPipeline;
      const shouldAnimateDeploy = isDeploying && isDeployEdge;
      $$renderer2.push(`<g><line${attr("x1", path.x1)}${attr("y1", path.y1)}${attr("x2", path.x2)}${attr("y2", path.y2)}${attr("stroke", shouldAnimateDeploy ? "#06b6d4" : isDataFlow ? "#22c55e" : "#4b5563")} stroke-width="0.75"${attr("marker-end", shouldAnimateDeploy ? "url(#arrow-deploy)" : isDataFlow ? "url(#arrow-active)" : "url(#arrow-idle)")}${attr_class(clsx(shouldAnimateDeploy ? "deploy-animated" : ""))}></line>`);
      if (edge.label) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<text${attr("x", path.midX)}${attr("y", path.midY + 1)} text-anchor="middle" class="text-[4px] fill-gray-400 font-medium">${escape_html(edge.label)}</text>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></g>`);
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    const each_array_1 = ensure_array_like(nodes);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let node = each_array_1[$$index_1];
      const IconComponent = nodeIcons[node.type] || Server;
      const color = nodeColors[node.type] || "#6b7280";
      const nodeX = node.x ?? 0;
      const nodeY = node.y ?? 0;
      const isClickable = !!node.dashboardUrl;
      const logoUrl = getLogoUrl(node.provider);
      $$renderer2.push(`<g${attr("transform", `translate(${stringify(nodeX)}, ${stringify(nodeY)})`)}${attr_class(clsx(isClickable ? "cursor-pointer" : ""))}${attr("role", isClickable ? "button" : void 0)}${attr("tabindex", isClickable ? 0 : void 0)}><circle cx="0" cy="0" r="12" fill="#1f2937"${attr("stroke", color)} stroke-width="1"${attr_class(`transition-all ${stringify(isClickable ? "hover:stroke-[1.5] hover:fill-gray-800" : "")}`)}></circle>`);
      if (logoUrl) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<image x="-8" y="-8" width="16" height="16"${attr("href", logoUrl)} preserveAspectRatio="xMidYMid meet"></image>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<foreignObject x="-7" y="-7" width="14" height="14"><div class="flex items-center justify-center w-full h-full"${attr_style(`color: ${stringify(color)}`)}><!---->`);
        IconComponent($$renderer2, { class: "w-2.5 h-2.5" });
        $$renderer2.push(`<!----></div></foreignObject>`);
      }
      $$renderer2.push(`<!--]--><text x="0" y="18" text-anchor="middle" class="text-[4px] fill-gray-400 font-medium">${escape_html(node.label.length > 10 ? node.label.slice(0, 9) + ".." : node.label)}</text>`);
      if (node.label2) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<text x="0" y="24" text-anchor="middle" class="text-[3.5px] fill-gray-500">${escape_html(node.label2.length > 12 ? node.label2.slice(0, 11) + ".." : node.label2)}</text>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      if (isDeploying) {
        $$renderer2.push("<!--[-->");
        const timestamp = getNodeTimestamp(node.id);
        if (timestamp) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<text x="0"${attr("y", node.label2 ? 31 : 25)} text-anchor="middle" class="text-[3px] fill-cyan-400 font-mono">${escape_html(formatTimestamp(timestamp))}</text>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      if (isClickable) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<foreignObject x="6" y="-12" width="6" height="6"><div class="flex items-center justify-center w-full h-full text-gray-400">`);
        External_link($$renderer2, { class: "w-1.5 h-1.5" });
        $$renderer2.push(`<!----></div></foreignObject>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      if (node.status === "down" || node.status === "degraded") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<foreignObject x="-12" y="-12" width="6" height="6"><div class="flex items-center justify-center w-full h-full text-red-500">`);
        Triangle_alert($$renderer2, { class: "w-2 h-2" });
        $$renderer2.push(`<!----></div></foreignObject>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></g>`);
    }
    $$renderer2.push(`<!--]--></svg></div></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let statuses = data.statuses;
    data.lastUpdated;
    let deploymentTimestamps = {};
    data.apiSecret || "";
    let ownerFilters = { jaslr: true, vp: true };
    function filterByOwner(statuses2) {
      return statuses2.filter((status) => {
        const isJaslr = status.owner === "jaslr";
        const isVP = status.owner === "jvp-ux" || status.owner === "unknown";
        const isJunipa = status.repo.toLowerCase().includes("junipa");
        if (isJunipa) return true;
        if (isJaslr && ownerFilters.jaslr) return true;
        if (isVP && ownerFilters.vp && !isJunipa) return true;
        return false;
      });
    }
    let selectedRepo = null;
    function getInfra(repoName) {
      return getProjectInfrastructure(repoName);
    }
    const deployStatusColors = {
      success: "bg-green-500",
      failure: "bg-red-500",
      deploying: "bg-transparent",
      unknown: "bg-gray-500"
    };
    function formatRelativeTime(isoString) {
      if (!isoString) return "never";
      const date = new Date(isoString);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      const diffHours = Math.floor(diffMs / 36e5);
      const diffDays = Math.floor(diffMs / 864e5);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    }
    const categoryIcons = {
      hosting: Cloud,
      database: Database,
      auth: Shield,
      storage: Hard_drive,
      dns: Globe,
      domain: Globe,
      email: Mail,
      ci: Git_branch,
      monitoring: Triangle_alert,
      analytics: Chart_column,
      cdn: Server,
      secrets: Shield
    };
    const providerColors = {
      cloudflare: "text-orange-400",
      supabase: "text-green-400",
      sentry: "text-purple-400",
      github: "text-gray-300",
      aws: "text-yellow-400",
      vercel: "text-white",
      flyio: "text-violet-400",
      google: "text-blue-400",
      gcp: "text-blue-400",
      netlify: "text-teal-400"
    };
    function sortedStatuses(statuses2, sort) {
      const sorted = [...statuses2];
      {
        sorted.sort((a, b) => a.repo.localeCompare(b.repo));
      }
      return sorted;
    }
    function groupServicesByCategory(services) {
      const grouped = /* @__PURE__ */ new Map();
      for (const service of services) {
        const existing = grouped.get(service.category) || [];
        existing.push(service);
        grouped.set(service.category, existing);
      }
      return grouped;
    }
    let filteredStatuses = filterByOwner(statuses);
    let displayStatuses = sortedStatuses(filteredStatuses);
    displayStatuses.find((s) => s.repo === selectedRepo);
    head("rqn88j", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Deployments | Orchon</title>`);
      });
    });
    $$renderer2.push(`<div class="flex-1 flex flex-col lg:flex-row min-h-0 h-full"><aside class="hidden lg:flex lg:flex-col w-[18rem] shrink-0 border-r border-gray-800 bg-gray-900"><div class="shrink-0 px-4 py-2 border-b border-gray-800 flex justify-between items-center"><div class="relative sort-dropdown"><button class="flex items-center gap-1 p-1.5 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"${attr("title", "Sorted A-Z")}>`);
    {
      $$renderer2.push("<!--[-->");
      Arrow_down_a_z($$renderer2, { class: "w-4 h-4" });
    }
    $$renderer2.push(`<!--]--> `);
    Chevron_down($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-2"><button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors ${stringify("text-gray-200")}`)} title="Show jaslr projects">jaslr</button> <button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors ${stringify("text-gray-200")}`)} title="Show Vast Puddle projects">VP</button> <button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors ${stringify("text-gray-200")}`)} title="Show Junipa projects only">Junipa</button></div></div> `);
    if (statuses.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-4 text-center text-gray-500"><p>No repos configured.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="flex-1 overflow-y-auto py-1"><!--[-->`);
      const each_array = ensure_array_like(displayStatuses);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let status = each_array[$$index];
        const repoInfra = getInfra(status.repo);
        const isSelected = selectedRepo === status.repo;
        $$renderer2.push(`<button${attr_class(`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors ${stringify(isSelected ? "bg-gray-800 border-l-2 border-blue-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
        if (status.deployStatus === "deploying") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="w-2.5 h-2.5 shrink-0 relative" title="Deploying..."><svg class="w-2.5 h-2.5 animate-spin" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round"></circle></svg></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div${attr_class(`w-2.5 h-2.5 rounded-full ${stringify(deployStatusColors[status.deployStatus])} shrink-0`, "svelte-rqn88j")}${attr("title", `Deployment: ${stringify(status.deployStatus)}`)}></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="flex-1 min-w-0">`);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div${attr_class(`font-medium text-sm truncate ${stringify(isSelected ? "text-white" : "text-gray-300")}`)}>${escape_html(status.repo)}</div> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="text-xs text-gray-500 truncate">${escape_html(status.owner)}</div>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (status.deployStatus === "failure") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="text-xs text-red-400 truncate">${escape_html(status.conclusion === "cancelled" ? "Cancelled" : status.conclusion === "timed_out" ? "Timed out" : "Build failed")}</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> <a${attr("href", status.repoUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors shrink-0"${attr("title", `GitHub: ${stringify(status.version || "no version")} - ${stringify(formatRelativeTime(status.lastPush))}`)}>`);
        Git_branch($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> `);
        if (status.version) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-xs">${escape_html(status.version)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></a> `);
        if (status.deployStatus === "failure") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<a${attr("href", status.deployUrl || status.html_url)} target="_blank" rel="noopener noreferrer" class="p-1 -m-1 text-red-400 hover:text-red-300 transition-colors shrink-0" title="View failed deployment">`);
          Triangle_alert($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----></a>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (status.serviceHealth?.database && status.serviceHealth.database !== "healthy") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="shrink-0"${attr("title", `Database: ${stringify(status.serviceHealth.database)}`)}>`);
          Database($$renderer2, {
            class: `w-3.5 h-3.5 ${stringify(status.serviceHealth.database === "down" ? "text-red-400" : "text-yellow-400")}`
          });
          $$renderer2.push(`<!----></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (status.serviceHealth?.auth && status.serviceHealth.auth !== "healthy") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="shrink-0"${attr("title", `Auth: ${stringify(status.serviceHealth.auth)}`)}>`);
          Key($$renderer2, {
            class: `w-3.5 h-3.5 ${stringify(status.serviceHealth.auth === "down" ? "text-red-400" : "text-yellow-400")}`
          });
          $$renderer2.push(`<!----></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (repoInfra) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex items-center gap-1 text-xs text-gray-500 shrink-0">`);
          Layers($$renderer2, { class: "w-3 h-3" });
          $$renderer2.push(`<!----> <span>${escape_html(repoInfra.services.length)}</span></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></aside> <div class="lg:hidden flex-1 flex flex-col overflow-hidden bg-gray-900"><div class="shrink-0 px-4 py-2 border-b border-gray-800 flex justify-between items-center"><div class="relative sort-dropdown"><button class="flex items-center gap-1 p-1.5 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors">`);
    {
      $$renderer2.push("<!--[-->");
      Arrow_down_a_z($$renderer2, { class: "w-4 h-4" });
    }
    $$renderer2.push(`<!--]--> `);
    Chevron_down($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-2"><button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors ${stringify("text-gray-200")}`)}>jaslr</button> <button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors ${stringify("text-gray-200")}`)}>VP</button> <button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors ${stringify("text-gray-200")}`)}>Junipa</button></div></div> `);
    if (displayStatuses.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-4 text-center text-gray-500"><p>No repos configured.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="flex-1 overflow-y-auto divide-y divide-gray-800"><!--[-->`);
      const each_array_1 = ensure_array_like(displayStatuses);
      for (let $$index_3 = 0, $$length = each_array_1.length; $$index_3 < $$length; $$index_3++) {
        let status = each_array_1[$$index_3];
        const repoInfra = getInfra(status.repo);
        const isExpanded = selectedRepo === status.repo;
        $$renderer2.push(`<div><button${attr_class(`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors ${stringify(isExpanded ? "bg-gray-800" : "hover:bg-gray-800/50")}`)}>`);
        if (status.deployStatus === "deploying") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="w-2.5 h-2.5 shrink-0 relative" title="Deploying..."><svg class="w-2.5 h-2.5 animate-spin" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round"></circle></svg></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div${attr_class(`w-2.5 h-2.5 rounded-full ${stringify(deployStatusColors[status.deployStatus])} shrink-0`, "svelte-rqn88j")}></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="flex-1 min-w-0">`);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div${attr_class(`font-medium text-sm truncate ${stringify(isExpanded ? "text-white" : "text-gray-300")}`)}>${escape_html(status.repo)}</div> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="text-xs text-gray-500 truncate">${escape_html(status.owner)}</div>`);
        }
        $$renderer2.push(`<!--]--></div> <a${attr("href", status.repoUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors shrink-0">`);
        Git_branch($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----></a> `);
        if (repoInfra) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex items-center gap-2 text-xs text-gray-500 shrink-0">`);
          Layers($$renderer2, { class: "w-3 h-3" });
          $$renderer2.push(`<!----> <span>${escape_html(repoInfra.services.length)}</span></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <svg${attr_class(`w-4 h-4 text-gray-500 transition-transform ${stringify(isExpanded ? "rotate-180" : "")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button> `);
        if (isExpanded && repoInfra) {
          $$renderer2.push("<!--[-->");
          const grouped = groupServicesByCategory(repoInfra.services);
          $$renderer2.push(`<div class="bg-gray-850 svelte-rqn88j"><div class="bg-gray-900 py-2 px-2 h-72">`);
          InfraFlowDiagram($$renderer2, {
            services: repoInfra.services,
            projectName: repoInfra.displayName,
            isDeploying: status.deployStatus === "deploying",
            deploymentTimestamps: deploymentTimestamps[status.repo]
          });
          $$renderer2.push(`<!----></div> <div class="grid grid-cols-2 gap-3 text-xs px-4 pb-4 pt-3"><!--[-->`);
          const each_array_2 = ensure_array_like([...grouped.entries()]);
          for (let $$index_2 = 0, $$length2 = each_array_2.length; $$index_2 < $$length2; $$index_2++) {
            let [category, services] = each_array_2[$$index_2];
            const IconComponent = categoryIcons[category] || Server;
            $$renderer2.push(`<div class="bg-gray-800 p-2"><div class="flex items-center gap-1 text-gray-500 uppercase tracking-wider mb-1"><!---->`);
            IconComponent($$renderer2, { class: "w-3 h-3" });
            $$renderer2.push(`<!----> <span>${escape_html(category)}</span></div> <!--[-->`);
            const each_array_3 = ensure_array_like(services);
            for (let $$index_1 = 0, $$length3 = each_array_3.length; $$index_1 < $$length3; $$index_1++) {
              let service = each_array_3[$$index_1];
              if (service.dashboardUrl) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<a${attr("href", service.dashboardUrl)} target="_blank" rel="noopener noreferrer"${attr_class(`flex items-center gap-1 py-0.5 ${stringify(providerColors[service.provider] || "text-gray-300")} hover:underline`, "svelte-rqn88j")}><span class="truncate">${escape_html(service.serviceName)}</span> `);
                External_link($$renderer2, { class: "w-2.5 h-2.5 opacity-50 shrink-0" });
                $$renderer2.push(`<!----></a>`);
              } else {
                $$renderer2.push("<!--[!-->");
                $$renderer2.push(`<div${attr_class(`py-0.5 ${stringify(providerColors[service.provider] || "text-gray-300")} truncate`, "svelte-rqn88j")}>${escape_html(service.serviceName)}</div>`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]--></div>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="hidden lg:flex flex-1 flex-col overflow-y-auto bg-gray-850 min-w-0 svelte-rqn88j">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="h-full flex items-center justify-center text-gray-500"><p>Select a repository to view infrastructure</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
