import { w as spread_props, F as ensure_array_like, G as attr, x as attr_class, y as stringify } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { C as Check } from "../../../../chunks/check.js";
import { X } from "../../../../chunks/x.js";
import { S as Server } from "../../../../chunks/server.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { L as Layers } from "../../../../chunks/layers.js";
import { j as escape_html } from "../../../../chunks/context.js";
function Code($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m16 18 6-6-6-6" }],
      ["path", { "d": "m8 6-6 6 6 6" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "code" },
      /**
       * @component @name Code
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTggNi02LTYtNiIgLz4KICA8cGF0aCBkPSJtOCA2LTYgNiA2IDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/code
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
function Upload($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M12 3v12" }],
      ["path", { "d": "m17 8-5-5-5 5" }],
      ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "upload" },
      /**
       * @component @name Upload
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM3YxMiIgLz4KICA8cGF0aCBkPSJtMTcgOC01LTUtNSA1IiAvPgogIDxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/upload
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const infrastructureProviders = [
      {
        name: "cloudflare",
        displayName: "Cloudflare",
        services: ["Pages", "R2 Storage", "DNS", "CDN", "Workers"]
      },
      {
        name: "flyio",
        displayName: "Fly.io",
        services: ["Hosting", "Postgres"]
      },
      {
        name: "vercel",
        displayName: "Vercel",
        services: ["Hosting", "Postgres", "Blob Storage"]
      },
      {
        name: "netlify",
        displayName: "Netlify",
        services: ["Hosting", "Functions"]
      },
      {
        name: "supabase",
        displayName: "Supabase",
        services: ["Database", "Auth", "Storage", "Realtime", "Edge Functions"]
      },
      {
        name: "planetscale",
        displayName: "PlanetScale",
        services: ["Database"]
      },
      { name: "neon", displayName: "Neon", services: ["Postgres"] },
      {
        name: "aws",
        displayName: "AWS",
        services: ["S3", "Route53", "Lambda", "CloudFront"]
      },
      {
        name: "github",
        displayName: "GitHub",
        services: ["Actions", "Pages"]
      },
      {
        name: "auth0",
        displayName: "Auth0",
        services: ["Authentication"]
      },
      {
        name: "clerk",
        displayName: "Clerk",
        services: ["Authentication"]
      },
      {
        name: "sentry",
        displayName: "Sentry",
        services: ["Error Tracking"]
      },
      {
        name: "logrocket",
        displayName: "LogRocket",
        services: ["Session Replay"]
      },
      { name: "resend", displayName: "Resend", services: ["Email"] },
      {
        name: "sendgrid",
        displayName: "SendGrid",
        services: ["Email"]
      },
      {
        name: "postmark",
        displayName: "Postmark",
        services: ["Email"]
      },
      {
        name: "plausible",
        displayName: "Plausible",
        services: ["Analytics"]
      },
      {
        name: "posthog",
        displayName: "PostHog",
        services: ["Analytics"]
      },
      {
        name: "doppler",
        displayName: "Doppler",
        services: ["Secrets Management"]
      }
    ];
    const techStackCategories = [
      {
        category: "Frameworks",
        items: [
          { name: "sveltekit", display: "SvelteKit" },
          { name: "svelte", display: "Svelte" },
          { name: "nextjs", display: "Next.js" },
          { name: "react", display: "React" },
          { name: "angular", display: "Angular" },
          { name: "nuxt", display: "Nuxt" },
          { name: "vue", display: "Vue" },
          { name: "astro", display: "Astro" },
          { name: "nodejs", display: "Node.js" },
          { name: "express", display: "Express" }
        ]
      },
      {
        category: "CSS & Styling",
        items: [
          { name: "tailwind", display: "Tailwind CSS" },
          { name: "skeleton", display: "Skeleton UI" },
          { name: "daisyui", display: "DaisyUI" },
          { name: "bootstrap", display: "Bootstrap" },
          { name: "bulma", display: "Bulma" },
          { name: "angular-material", display: "Angular Material" },
          { name: "styled-components", display: "Styled Components" },
          { name: "sass", display: "Sass/SCSS" }
        ]
      },
      {
        category: "Testing",
        items: [
          { name: "playwright", display: "Playwright" },
          { name: "cypress", display: "Cypress" },
          { name: "vitest", display: "Vitest" },
          { name: "jest", display: "Jest" },
          { name: "mocha", display: "Mocha" }
        ]
      },
      {
        category: "Build Tools",
        items: [
          { name: "vite", display: "Vite" },
          { name: "webpack", display: "Webpack" },
          { name: "esbuild", display: "esbuild" },
          { name: "rollup", display: "Rollup" },
          { name: "turbopack", display: "Turbopack" }
        ]
      },
      {
        category: "Package Managers",
        items: [
          { name: "npm", display: "npm" },
          { name: "pnpm", display: "pnpm" },
          { name: "yarn", display: "Yarn" },
          { name: "bun", display: "Bun" }
        ]
      },
      {
        category: "Icons",
        items: [
          { name: "lucide", display: "Lucide" },
          { name: "heroicons", display: "Heroicons" },
          { name: "fontawesome", display: "Font Awesome" },
          { name: "tabler", display: "Tabler Icons" }
        ]
      },
      {
        category: "Languages",
        items: [
          { name: "typescript", display: "TypeScript" },
          { name: "javascript", display: "JavaScript" },
          { name: "python", display: "Python" },
          { name: "go", display: "Go" },
          { name: "rust", display: "Rust" }
        ]
      }
    ];
    function getLogo(type, name) {
      return data.logos?.find((l) => l.type === type && l.name === name) ?? null;
    }
    $$renderer2.push(`<div class="p-6 space-y-8"><div><h2 class="text-xl font-semibold text-white">Media Library</h2> <p class="text-gray-400 text-sm mt-1">Upload and manage logos for services and tech stack</p> <p class="text-gray-500 text-xs mt-1">Loaded: ${escape_html(data.logos?.length ?? 0)} logos from storage</p></div> `);
    if (form?.success) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-3">`);
      Check($$renderer2, { class: "w-5 h-5 text-green-400" });
      $$renderer2.push(`<!----> <span class="text-green-300">${escape_html(form.message)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">`);
      X($$renderer2, { class: "w-5 h-5 text-red-400" });
      $$renderer2.push(`<!----> <span class="text-red-300">${escape_html(form.error)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <section class="bg-gray-800 rounded-lg p-6"><h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
    Server($$renderer2, { class: "w-5 h-5 text-blue-400" });
    $$renderer2.push(`<!----> Infrastructure</h3> <div class="space-y-3"><!--[-->`);
    const each_array = ensure_array_like(infrastructureProviders);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let provider = each_array[$$index];
      const logo = getLogo("infra", provider.name);
      $$renderer2.push(`<div class="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"><div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">`);
      if (logo) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", logo.url)}${attr("alt", provider.displayName)} class="max-w-full max-h-full object-contain"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="w-6 h-6 bg-gray-600 rounded"></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="flex-1 min-w-0"><div class="font-medium text-white">${escape_html(provider.displayName)}</div> <div class="text-xs text-gray-400 truncate">${escape_html(provider.services.join(" · "))}</div></div> `);
      if (logo) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<form method="POST" action="?/deleteLogo"><input type="hidden" name="logoId"${attr("value", logo.id)}/> <button type="submit" class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-red-900/50 text-red-300 hover:bg-red-800/50 transition-colors">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Remove</button></form>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button type="button" class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors">`);
        Upload($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Add</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="bg-gray-800 rounded-lg p-6"><h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
    Code($$renderer2, { class: "w-5 h-5 text-purple-400" });
    $$renderer2.push(`<!----> Tech Stack</h3> <div class="space-y-6"><!--[-->`);
    const each_array_1 = ensure_array_like(techStackCategories);
    for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
      let category = each_array_1[$$index_2];
      $$renderer2.push(`<div><h4 class="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">${escape_html(category.category)}</h4> <div class="space-y-2"><!--[-->`);
      const each_array_2 = ensure_array_like(category.items);
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let item = each_array_2[$$index_1];
        const logo = getLogo("techstack", item.name);
        $$renderer2.push(`<div class="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"><div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">`);
        if (logo) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", logo.url)}${attr("alt", item.display)} class="max-w-full max-h-full object-contain"/>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="w-6 h-6 bg-gray-600 rounded"></div>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="flex-1 min-w-0"><div class="font-medium text-white">${escape_html(item.display)}</div></div> `);
        if (logo) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<form method="POST" action="?/deleteLogo"><input type="hidden" name="logoId"${attr("value", logo.id)}/> <button type="submit" class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-red-900/50 text-red-300 hover:bg-red-800/50 transition-colors">`);
          Trash_2($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----> Remove</button></form>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<button type="button" class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors">`);
          Upload($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----> Add</button>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></section> `);
    if (data.logos && data.logos.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="bg-gray-800 rounded-lg p-6"><h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
      Layers($$renderer2, { class: "w-5 h-5 text-purple-400" });
      $$renderer2.push(`<!----> All Uploaded Logos (${escape_html(data.logos.length)})</h3> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"><!--[-->`);
      const each_array_3 = ensure_array_like(data.logos);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let logo = each_array_3[$$index_3];
        $$renderer2.push(`<div class="bg-gray-700 rounded-lg p-4 flex flex-col items-center gap-2 group relative"><div class="w-12 h-12 flex items-center justify-center"><img${attr("src", logo.url)}${attr("alt", logo.name)} class="max-w-full max-h-full object-contain"/></div> <span class="text-xs text-gray-300 truncate max-w-full">${escape_html(logo.name)}</span> <span${attr_class(`text-xs px-2 py-0.5 rounded ${stringify(logo.type === "infra" ? "bg-blue-900 text-blue-300" : "bg-purple-900 text-purple-300")}`)}>${escape_html(logo.type === "infra" ? "Infra" : "Stack")}</span> <form method="POST" action="?/deleteLogo" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><input type="hidden" name="logoId"${attr("value", logo.id)}/> <button type="submit" class="p-1 bg-red-600 hover:bg-red-700 rounded text-white" title="Delete logo">`);
        Trash_2($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----></button></form></div>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
