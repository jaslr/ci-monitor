import { w as spread_props, z as head, x as attr_class, G as attr, F as ensure_array_like, y as stringify } from "../../../chunks/index2.js";
import { a as getProvidersByCategory, b as getAllProjects, I as INFRASTRUCTURE } from "../../../chunks/infrastructure.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { A as Arrow_down_a_z, C as Chevron_down, D as Database, T as Triangle_alert } from "../../../chunks/triangle-alert.js";
import { C as Cloud } from "../../../chunks/cloud.js";
import { G as Git_branch } from "../../../chunks/git-branch.js";
import { S as Server } from "../../../chunks/server.js";
import { j as escape_html } from "../../../chunks/context.js";
function List($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M3 5h.01" }],
      ["path", { "d": "M3 12h.01" }],
      ["path", { "d": "M3 19h.01" }],
      ["path", { "d": "M8 5h13" }],
      ["path", { "d": "M8 12h13" }],
      ["path", { "d": "M8 19h13" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "list" },
      /**
       * @component @name List
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA1aC4wMSIgLz4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMTloLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDVoMTMiIC8+CiAgPHBhdGggZD0iTTggMTJoMTMiIC8+CiAgPHBhdGggZD0iTTggMTloMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list
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
    getProvidersByCategory();
    const projects = getAllProjects();
    let ownerFilters = { jaslr: true, vp: true };
    const categoryOrder = [
      "hosting",
      "database",
      "auth",
      "storage",
      "monitoring",
      "ci",
      "dns",
      "email",
      "analytics",
      "cdn",
      "secrets"
    ];
    let projectsWithServices = (() => {
      const result = [];
      for (const project of projects) {
        const infraConfig = INFRASTRUCTURE[project.id];
        if (!infraConfig) continue;
        const sortedServices = [...infraConfig.services].sort((a, b) => {
          const aIndex = categoryOrder.indexOf(a.category);
          const bIndex = categoryOrder.indexOf(b.category);
          return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        });
        result.push({
          id: project.id,
          displayName: infraConfig.displayName,
          identity: infraConfig.identity,
          services: sortedServices.map((s) => ({
            category: s.category,
            provider: s.provider,
            serviceName: s.serviceName
          }))
        });
      }
      return result;
    })();
    function filterByOwner(projectList) {
      return projectList.filter((project) => {
        const isJaslr = project.identity === "jaslr";
        const isVP = project.identity === "jvp-ux";
        const isJunipa = project.id.toLowerCase().includes("junipa") || project.displayName.toLowerCase().includes("junipa");
        if (isJunipa) return true;
        if (isJaslr && ownerFilters.jaslr && !isJunipa) return true;
        if (isVP && ownerFilters.vp && !isJunipa) return true;
        return false;
      });
    }
    let displayProjects = (() => {
      const filtered = filterByOwner(projectsWithServices);
      const sorted = [...filtered];
      {
        sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
      }
      return sorted;
    })();
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
      netlify: "text-teal-400",
      pocketbase: "text-gray-300"
    };
    const providerFallbackIcons = {
      cloudflare: Cloud,
      flyio: Cloud,
      supabase: Database,
      github: Git_branch,
      sentry: Triangle_alert,
      firebase: Database,
      gcp: Cloud,
      aws: Cloud,
      pocketbase: Database,
      vercel: Cloud,
      netlify: Cloud
    };
    head("1ny0ztv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Ecosystem | Orchon</title>`);
      });
    });
    $$renderer2.push(`<div class="flex-1 flex flex-col overflow-hidden"><div class="shrink-0 border-b border-gray-800 bg-gray-900 px-4 sm:px-6 py-3"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div class="flex gap-1"><button${attr_class(`px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-t ${stringify(
      "text-white bg-gray-800 border-b-2 border-blue-500"
    )}`)}>Projects</button> <button${attr_class(`px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-t ${stringify("text-gray-400 hover:text-gray-200")}`)}>Flow Diagram</button></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-3 sm:gap-4"><button class="p-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer rounded hover:bg-gray-800"${attr("title", "Show service names")}>`);
      {
        $$renderer2.push("<!--[-->");
        List($$renderer2, { class: "w-4 h-4" });
      }
      $$renderer2.push(`<!--]--></button> <div class="relative sort-dropdown"><button class="flex items-center gap-1 p-1.5 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"${attr("title", "Sorted A-Z")}>`);
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
      $$renderer2.push(`<!--]--></div> <div class="flex gap-1 sm:gap-2"><button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors rounded ${stringify(
        "text-gray-200 bg-gray-800"
      )}`)} title="Show jaslr projects">jaslr</button> <button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors rounded ${stringify(
        "text-gray-200 bg-gray-800"
      )}`)} title="Show Vast Puddle projects">VP</button> <button${attr_class(`px-2 py-1 text-xs cursor-pointer transition-colors rounded ${stringify(
        "text-gray-200 bg-gray-800"
      )}`)} title="Show Junipa projects only">Junipa</button></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex-1 overflow-y-auto p-4 sm:p-6">`);
      if (displayProjects.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center text-gray-500 py-8"><p>No projects match the current filters.</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-2"><!--[-->`);
        const each_array = ensure_array_like(displayProjects);
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let project = each_array[$$index_1];
          $$renderer2.push(`<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"><a${attr("href", `/projects?project=${stringify(project.id)}`)} class="font-medium text-gray-200 hover:text-white sm:min-w-[160px] truncate shrink-0">${escape_html(project.displayName)}</a> <div class="flex flex-wrap gap-1.5 sm:gap-2 flex-1"><!--[-->`);
          const each_array_1 = ensure_array_like(project.services);
          for (let i = 0, $$length2 = each_array_1.length; i < $$length2; i++) {
            let service = each_array_1[i];
            const logoUrl = `/api/logos/infra/${service.provider}.svg`;
            const FallbackIcon = providerFallbackIcons[service.provider] || Server;
            const fallbackColor = providerColors[service.provider] || "text-gray-400";
            $$renderer2.push(`<div${attr_class(`inline-flex items-center gap-1.5 px-2 py-1 bg-gray-700 rounded text-xs ${stringify("px-1.5")}`)}${attr("title", service.serviceName)}><img${attr("src", logoUrl)}${attr("alt", service.provider)} class="w-4 h-4 object-contain" onerror="this.__e=event"/> <span${attr_class(`hidden ${stringify(fallbackColor)}`, "svelte-1ny0ztv")}><!---->`);
            FallbackIcon($$renderer2, { class: "w-4 h-4" });
            $$renderer2.push(`<!----></span> `);
            {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--></div>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
