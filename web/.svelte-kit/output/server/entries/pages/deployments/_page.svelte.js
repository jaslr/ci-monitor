import { w as spread_props, z as head, F as ensure_array_like, x as attr_class, G as attr, y as stringify } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { X } from "../../../chunks/x.js";
import { C as Cloud } from "../../../chunks/cloud.js";
import { L as Loader, C as Circle_check_big, a as Circle_x } from "../../../chunks/loader.js";
import { G as Git_branch } from "../../../chunks/git-branch.js";
import { E as External_link } from "../../../chunks/external-link.js";
import { C as Clock } from "../../../chunks/clock.js";
import { j as escape_html } from "../../../chunks/context.js";
function Funnel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "funnel" },
      /**
       * @component @name Funnel
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMjBhMSAxIDAgMCAwIC41NTMuODk1bDIgMUExIDEgMCAwIDAgMTQgMjF2LTdhMiAyIDAgMCAxIC41MTctMS4zNDFMMjEuNzQgNC42N0ExIDEgMCAwIDAgMjEgM0gzYTEgMSAwIDAgMC0uNzQyIDEuNjdsNy4yMjUgNy45ODlBMiAyIDAgMCAxIDEwIDE0eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/funnel
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
    let { data } = $$props;
    let selectedProject = data.projectFilter;
    let recentSelections = [];
    let filteredDeployments = selectedProject ? data.deployments.filter((d) => d.projectName === selectedProject) : data.deployments;
    function getProjectDisplayName(projectName) {
      const project = data.projects.find((p) => p.id === projectName);
      return project?.name || projectName;
    }
    function selectProject(projectName) {
      selectedProject = projectName;
    }
    function formatRelativeTime(isoString) {
      if (!isoString) return "Unknown";
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
    function formatFullTime(isoString) {
      if (!isoString) return "";
      return new Date(isoString).toLocaleString();
    }
    function getStatusColor(status) {
      switch (status) {
        case "success":
          return "text-green-400";
        case "failure":
          return "text-red-400";
        case "in_progress":
          return "text-cyan-400";
        default:
          return "text-gray-400";
      }
    }
    function getStatusLabel(status) {
      switch (status) {
        case "success":
          return "Success";
        case "failure":
          return "Failed";
        case "in_progress":
          return "Deploying";
        case "queued":
          return "Queued";
        default:
          return "Unknown";
      }
    }
    head("1tckhxz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Deployments | Orchon</title>`);
      });
    });
    $$renderer2.push(`<div class="flex-1 flex flex-col h-full overflow-hidden"><div class="shrink-0 px-4 py-4 border-b border-gray-800 bg-gray-900/50"><div class="flex flex-col gap-3"><div class="flex items-center justify-between"><h1 class="text-lg font-semibold text-white">Deployment Log</h1> <span class="text-sm text-gray-500">${escape_html(filteredDeployments.length)} deployment${escape_html(filteredDeployments.length !== 1 ? "s" : "")}</span></div> <div class="flex flex-wrap items-center gap-2">`);
    Funnel($$renderer2, { class: "w-4 h-4 text-gray-500 shrink-0" });
    $$renderer2.push(`<!----> `);
    $$renderer2.select(
      {
        class: "bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500",
        value: selectedProject || "",
        onchange: (e) => selectProject(e.currentTarget.value || null)
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`All Projects`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(data.projects);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let project = each_array[$$index];
          $$renderer3.option({ value: project.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(project.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` `);
    if (selectedProject) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">${escape_html(getProjectDisplayName(selectedProject))} `);
      X($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (recentSelections.length > 0 && !selectedProject) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-wrap items-center gap-2"><span class="text-xs text-gray-500">Recent:</span> <!--[-->`);
      const each_array_1 = ensure_array_like(recentSelections);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let projectName = each_array_1[$$index_1];
        $$renderer2.push(`<button class="px-2 py-0.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors">${escape_html(getProjectDisplayName(projectName))}</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex-1 overflow-y-auto">`);
    if (filteredDeployments.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-8 text-center text-gray-500">`);
      Cloud($$renderer2, { class: "w-12 h-12 mx-auto mb-3 opacity-50" });
      $$renderer2.push(`<!----> <p class="text-lg">No deployments found</p> `);
      if (selectedProject) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm mt-1">Try selecting a different project or clear the filter</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="divide-y divide-gray-800"><!--[-->`);
      const each_array_2 = ensure_array_like(filteredDeployments);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let deployment = each_array_2[$$index_2];
        const deployTime = deployment.deployCompletedAt || deployment.completedAt || deployment.startedAt;
        const deployStatus = deployment.status;
        $$renderer2.push(`<div class="px-4 py-4 hover:bg-gray-800/30 transition-colors"><div class="flex items-start gap-4"><div class="shrink-0 mt-0.5">`);
        if (deployStatus === "in_progress") {
          $$renderer2.push("<!--[-->");
          Loader($$renderer2, { class: "w-5 h-5 text-cyan-400 animate-spin" });
        } else {
          $$renderer2.push("<!--[!-->");
          if (deployStatus === "success") {
            $$renderer2.push("<!--[-->");
            Circle_check_big($$renderer2, { class: "w-5 h-5 text-green-400" });
          } else {
            $$renderer2.push("<!--[!-->");
            if (deployStatus === "failure") {
              $$renderer2.push("<!--[-->");
              Circle_x($$renderer2, { class: "w-5 h-5 text-red-400" });
            } else {
              $$renderer2.push("<!--[!-->");
              Cloud($$renderer2, { class: "w-5 h-5 text-gray-500" });
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><button class="font-medium text-white hover:text-blue-400 transition-colors">${escape_html(deployment.projectDisplayName || deployment.projectName)}</button> <span${attr_class(`text-xs px-1.5 py-0.5 rounded ${stringify(getStatusColor(deployStatus))} bg-gray-800`)}>${escape_html(getStatusLabel(deployStatus))}</span> <span class="text-xs text-gray-600 capitalize">${escape_html(deployment.provider)}</span></div> <div class="flex items-center gap-4 mt-1.5 text-sm text-gray-500">`);
        if (deployment.branch) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="flex items-center gap-1">`);
          Git_branch($$renderer2, { class: "w-3.5 h-3.5" });
          $$renderer2.push(`<!----> ${escape_html(deployment.branch)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (deployment.commitSha) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<a${attr("href", `https://github.com/jaslr/${stringify(deployment.projectName)}/commit/${stringify(deployment.commitSha)}`)} target="_blank" rel="noopener noreferrer" class="font-mono text-xs hover:text-blue-400 transition-colors">${escape_html(deployment.commitSha.slice(0, 7))}</a>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (deployment.runUrl) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<a${attr("href", deployment.runUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 hover:text-blue-400 transition-colors">View logs `);
          External_link($$renderer2, { class: "w-3 h-3" });
          $$renderer2.push(`<!----></a>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="shrink-0 text-right"><div class="flex items-center gap-1.5 text-sm text-gray-400">`);
        Clock($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> ${escape_html(formatRelativeTime(deployTime))}</div> <div class="text-xs text-gray-600 mt-0.5">${escape_html(formatFullTime(deployTime))}</div></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
