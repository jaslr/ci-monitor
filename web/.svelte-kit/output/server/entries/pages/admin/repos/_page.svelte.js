import { w as spread_props, G as attr, y as stringify, F as ensure_array_like, x as attr_class } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { E as External_link } from "../../../../chunks/external-link.js";
import { C as Check } from "../../../../chunks/check.js";
import { X } from "../../../../chunks/x.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { G as Git_branch } from "../../../../chunks/git-branch.js";
import { j as escape_html } from "../../../../chunks/context.js";
function Circle_alert($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
      [
        "line",
        { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "circle-alert" },
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
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
function File_code($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
        }
      ],
      ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
      ["path", { "d": "M10 12.5 8 15l2 2.5" }],
      ["path", { "d": "m14 12.5 2 2.5-2 2.5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "file-code" },
      /**
       * @component @name FileCode
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIgLz4KICA8cGF0aCBkPSJNMTQgMnY1YTEgMSAwIDAgMCAxIDFoNSIgLz4KICA8cGF0aCBkPSJNMTAgMTIuNSA4IDE1bDIgMi41IiAvPgogIDxwYXRoIGQ9Im0xNCAxMi41IDIgMi41LTIgMi41IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-code
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
function Git_fork($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "18", "r": "3" }],
      ["circle", { "cx": "6", "cy": "6", "r": "3" }],
      ["circle", { "cx": "18", "cy": "6", "r": "3" }],
      ["path", { "d": "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" }],
      ["path", { "d": "M12 12v3" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "git-fork" },
      /**
       * @component @name GitFork
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE4IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjYiIGN5PSI2IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjE4IiBjeT0iNiIgcj0iMyIgLz4KICA8cGF0aCBkPSJNMTggOXYyYzAgLjYtLjQgMS0xIDFIN2MtLjYgMC0xLS40LTEtMVY5IiAvPgogIDxwYXRoIGQ9Ik0xMiAxMnYzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/git-fork
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
function Loader_circle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]];
    Icon($$renderer2, spread_props([
      { name: "loader-circle" },
      /**
       * @component @name LoaderCircle
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
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
function Package($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"
        }
      ],
      ["path", { "d": "M12 22V12" }],
      ["polyline", { "points": "3.29 7 12 12 20.71 7" }],
      ["path", { "d": "m7.5 4.27 9 5.15" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "package" },
      /**
       * @component @name Package
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMjEuNzNhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2VjhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M3oiIC8+CiAgPHBhdGggZD0iTTEyIDIyVjEyIiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjMuMjkgNyAxMiAxMiAyMC43MSA3IiAvPgogIDxwYXRoIGQ9Im03LjUgNC4yNyA5IDUuMTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/package
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
function Refresh_cw($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }
      ],
      ["path", { "d": "M21 3v5h-5" }],
      [
        "path",
        { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }
      ],
      ["path", { "d": "M8 16H3v5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "refresh-cw" },
      /**
       * @component @name RefreshCw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAwIDEgOS05IDkuNzUgOS43NSAwIDAgMSA2Ljc0IDIuNzRMMjEgOCIgLz4KICA8cGF0aCBkPSJNMjEgM3Y1aC01IiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIgLz4KICA8cGF0aCBkPSJNOCAxNkgzdjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/refresh-cw
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
function Rocket($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
        }
      ],
      [
        "path",
        {
          "d": "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
        }
      ],
      ["path", { "d": "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" }],
      ["path", { "d": "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "rocket" },
      /**
       * @component @name Rocket
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNC41IDE2LjVjLTEuNSAxLjI2LTIgNS0yIDVzMy43NC0uNSA1LTJjLjcxLS44NC43LTIuMTMtLjA5LTIuOTFhMi4xOCAyLjE4IDAgMCAwLTIuOTEtLjA5eiIgLz4KICA8cGF0aCBkPSJtMTIgMTUtMy0zYTIyIDIyIDAgMCAxIDItMy45NUExMi44OCAxMi44OCAwIDAgMSAyMiAyYzAgMi43Mi0uNzggNy41LTYgMTFhMjIuMzUgMjIuMzUgMCAwIDEtNCAyeiIgLz4KICA8cGF0aCBkPSJNOSAxMkg0cy41NS0zLjAzIDItNGMxLjYyLTEuMDggNSAwIDUgMCIgLz4KICA8cGF0aCBkPSJNMTIgMTV2NXMzLjAzLS41NSA0LTJjMS4wOC0xLjYyIDAtNSAwLTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/rocket
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
    let scanning = null;
    let checkingOutdated = false;
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
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      return date.toLocaleDateString();
    }
    let selectedProjectData = data.selectedProject ? data.projects.find((p) => p.repo === data.selectedProject) : null;
    let displayStack = form?.success && form.repo === data.selectedProject ? form.detectedStack : selectedProjectData?.detectedStack;
    let displayPackageJson = form?.success && form.repo === data.selectedProject ? form.packageJson : selectedProjectData?.packageJson;
    $$renderer2.push(`<div class="min-h-screen bg-gray-900 text-white"><header class="px-6 py-4 border-b border-gray-800"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><a href="/" class="text-gray-400 hover:text-white transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></a> <h1 class="text-xl font-semibold">Repository Configuration</h1></div> `);
    if (data.selectedProject) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr("href", `/?project=${stringify(data.selectedProject)}`)} class="text-sm text-gray-400 hover:text-white flex items-center gap-1">Back to ${escape_html(data.selectedProject)} `);
      External_link($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></header> <div class="flex"><aside class="w-64 border-r border-gray-800 min-h-[calc(100vh-65px)]"><div class="p-4"><h2 class="text-xs uppercase tracking-wider text-gray-500 mb-3">Projects</h2> <nav class="space-y-1"><!--[-->`);
    const each_array = ensure_array_like(data.projects);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let project = each_array[$$index];
      const isActive = data.selectedProject === project.repo;
      $$renderer2.push(`<a${attr("href", `/admin/repos?project=${stringify(project.repo)}`)}${attr_class(`block px-3 py-2 text-sm transition-colors ${stringify(isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}`)}><div class="flex items-center justify-between"><span class="truncate">${escape_html(project.repo)}</span> `);
      if (project.infraConfig) {
        $$renderer2.push("<!--[-->");
        Check($$renderer2, {
          class: `w-3 h-3 ${stringify(isActive ? "text-green-300" : "text-green-400")} shrink-0`
        });
      } else {
        $$renderer2.push("<!--[!-->");
        X($$renderer2, {
          class: `w-3 h-3 ${stringify(isActive ? "text-blue-300" : "text-gray-600")} shrink-0`
        });
      }
      $$renderer2.push(`<!--]--></div> <div${attr_class(`text-xs ${stringify(isActive ? "text-blue-200" : "text-gray-500")}`)}>${escape_html(project.owner)}</div></a>`);
    }
    $$renderer2.push(`<!--]--></nav></div></aside> <main class="flex-1 p-6">`);
    if (data.selectedProject && selectedProjectData) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="max-w-3xl"><div class="flex items-center justify-between mb-6"><div><h2 class="text-2xl font-bold">${escape_html(data.selectedProject)}</h2> <p class="text-gray-400">${escape_html(selectedProjectData.owner)}/${escape_html(selectedProjectData.repo)}</p></div> <form method="POST" action="?/scanRepo"><input type="hidden" name="owner"${attr("value", selectedProjectData.owner)}/> <input type="hidden" name="repo"${attr("value", selectedProjectData.repo)}/> <button type="submit"${attr("disabled", scanning === selectedProjectData.repo, true)} class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-sm transition-colors">`);
      if (scanning === selectedProjectData.repo) {
        $$renderer2.push("<!--[-->");
        Loader_circle($$renderer2, { class: "w-4 h-4 animate-spin" });
        $$renderer2.push(`<!----> <span>Scanning...</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
        Refresh_cw($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> <span>Scan package.json</span>`);
      }
      $$renderer2.push(`<!--]--></button></form></div> `);
      if (form?.error) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-300">${escape_html(form.error)}</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (selectedProjectData.repoInfo) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mb-6 bg-gray-800 p-4"><div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div class="flex items-center gap-2">`);
        Clock($$renderer2, { class: "w-4 h-4 text-gray-500" });
        $$renderer2.push(`<!----> <div><div class="text-xs text-gray-500 uppercase">Last Push</div> <div class="text-gray-200">${escape_html(formatRelativeTime(selectedProjectData.repoInfo.lastPush))}</div></div></div> <div class="flex items-center gap-2">`);
        Git_branch($$renderer2, { class: "w-4 h-4 text-gray-500" });
        $$renderer2.push(`<!----> <div><div class="text-xs text-gray-500 uppercase">Branch</div> <div class="text-gray-200">${escape_html(selectedProjectData.repoInfo.defaultBranch || "unknown")}</div></div></div> <div class="flex items-center gap-2">`);
        if (selectedProjectData.repoInfo.deploymentMethod === "github-actions") {
          $$renderer2.push("<!--[-->");
          Rocket($$renderer2, { class: "w-4 h-4 text-green-400" });
        } else {
          $$renderer2.push("<!--[!-->");
          if (selectedProjectData.repoInfo.deploymentMethod === "forked") {
            $$renderer2.push("<!--[-->");
            Git_fork($$renderer2, { class: "w-4 h-4 text-blue-400" });
          } else {
            $$renderer2.push("<!--[!-->");
            Circle_alert($$renderer2, { class: "w-4 h-4 text-gray-500" });
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--> <div><div class="text-xs text-gray-500 uppercase">Deploy Method</div> <div${attr_class(selectedProjectData.repoInfo.deploymentMethod === "github-actions" ? "text-green-400" : selectedProjectData.repoInfo.deploymentMethod === "forked" ? "text-blue-400" : "text-gray-400")}>`);
        if (selectedProjectData.repoInfo.deploymentMethod === "github-actions") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`GitHub Actions`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (selectedProjectData.repoInfo.deploymentMethod === "forked") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`Forked (local deploy)`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`Unknown`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div></div></div> <div class="flex items-center gap-2">`);
        File_code($$renderer2, { class: "w-4 h-4 text-gray-500" });
        $$renderer2.push(`<!----> <div><div class="text-xs text-gray-500 uppercase">Workflows</div> <div class="text-gray-200">`);
        if (selectedProjectData.repoInfo.workflowFiles.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`${escape_html(selectedProjectData.repoInfo.workflowFiles.length)} file${escape_html(selectedProjectData.repoInfo.workflowFiles.length !== 1 ? "s" : "")}`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`None`);
        }
        $$renderer2.push(`<!--]--></div></div></div></div> `);
        if (selectedProjectData.repoInfo.workflowFiles.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="mt-3 pt-3 border-t border-gray-700"><div class="text-xs text-gray-500 mb-1">Workflow files:</div> <div class="flex flex-wrap gap-2"><!--[-->`);
          const each_array_1 = ensure_array_like(selectedProjectData.repoInfo.workflowFiles);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let file = each_array_1[$$index_1];
            $$renderer2.push(`<span class="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs">${escape_html(file)}</span>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="grid gap-6"><div class="bg-gray-800 p-6"><div class="flex items-center gap-2 mb-4">`);
      File_code($$renderer2, { class: "w-5 h-5 text-gray-400" });
      $$renderer2.push(`<!----> <h3 class="text-lg font-semibold">Current Configuration</h3></div> `);
      if (selectedProjectData.infraConfig) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-4"><div><label class="text-xs text-gray-500 uppercase">Display Name</label> <p class="text-white">${escape_html(selectedProjectData.infraConfig.displayName)}</p></div> <div><label class="text-xs text-gray-500 uppercase">Tech Stack</label> <div class="flex flex-wrap gap-2 mt-1">`);
        if (selectedProjectData.infraConfig.stack.framework) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs">${escape_html(selectedProjectData.infraConfig.stack.framework)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (selectedProjectData.infraConfig.stack.language) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs">${escape_html(selectedProjectData.infraConfig.stack.language)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        const each_array_2 = ensure_array_like(selectedProjectData.infraConfig.stack.css || []);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let css = each_array_2[$$index_2];
          $$renderer2.push(`<span class="px-2 py-1 bg-cyan-900/50 text-cyan-300 text-xs">${escape_html(css)}</span>`);
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        const each_array_3 = ensure_array_like(selectedProjectData.infraConfig.stack.testing || []);
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let test = each_array_3[$$index_3];
          $$renderer2.push(`<span class="px-2 py-1 bg-green-900/50 text-green-300 text-xs">${escape_html(test)}</span>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (selectedProjectData.infraConfig.stack.buildTool) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="px-2 py-1 bg-orange-900/50 text-orange-300 text-xs">${escape_html(selectedProjectData.infraConfig.stack.buildTool)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div><label class="text-xs text-gray-500 uppercase">Services (${escape_html(selectedProjectData.infraConfig.services.length)})</label> <div class="mt-1 space-y-1"><!--[-->`);
        const each_array_4 = ensure_array_like(selectedProjectData.infraConfig.services);
        for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
          let service = each_array_4[$$index_4];
          $$renderer2.push(`<div class="flex items-center gap-2 text-sm text-gray-300"><span class="w-20 text-gray-500">${escape_html(service.category)}</span> <span>${escape_html(service.provider)}</span> <span class="text-gray-500">-</span> <span>${escape_html(service.serviceName)}</span></div>`);
        }
        $$renderer2.push(`<!--]--></div></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<p class="text-gray-500">No configuration found in infrastructure.ts</p> <p class="text-sm text-gray-600 mt-2">Add this project to <code class="bg-gray-700 px-1">${escape_html(data.configFilePath)}</code></p>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (displayStack) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="bg-gray-800 p-6"><div class="flex items-center gap-2 mb-4">`);
        Package($$renderer2, { class: "w-5 h-5 text-gray-400" });
        $$renderer2.push(`<!----> <h3 class="text-lg font-semibold">Detected from package.json</h3></div> <div class="space-y-4"><div><label class="text-xs text-gray-500 uppercase">Detected Stack</label> <div class="flex flex-wrap gap-2 mt-1">`);
        if (displayStack.framework) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs">${escape_html(displayStack.framework)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <span class="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs">${escape_html(displayStack.language)}</span> <!--[-->`);
        const each_array_5 = ensure_array_like(displayStack.css);
        for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
          let css = each_array_5[$$index_5];
          $$renderer2.push(`<span class="px-2 py-1 bg-cyan-900/50 text-cyan-300 text-xs">${escape_html(css)}</span>`);
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        const each_array_6 = ensure_array_like(displayStack.testing);
        for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
          let test = each_array_6[$$index_6];
          $$renderer2.push(`<span class="px-2 py-1 bg-green-900/50 text-green-300 text-xs">${escape_html(test)}</span>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (displayStack.buildTool) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="px-2 py-1 bg-orange-900/50 text-orange-300 text-xs">${escape_html(displayStack.buildTool)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (displayStack.icons) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="px-2 py-1 bg-pink-900/50 text-pink-300 text-xs">${escape_html(displayStack.icons)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div> `);
        if (displayPackageJson) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div><div class="flex items-center justify-between mb-1"><label class="text-xs text-gray-500 uppercase">Dependencies</label> <form method="POST" action="?/checkOutdated"><input type="hidden" name="packages"${attr("value", JSON.stringify(displayPackageJson.dependencies || {}))}/> <button type="submit"${attr("disabled", checkingOutdated, true)} class="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-gray-300 transition-colors cursor-pointer">`);
          {
            $$renderer2.push("<!--[!-->");
            Refresh_cw($$renderer2, { class: "w-3 h-3" });
            $$renderer2.push(`<!----> <span>Check outdated</span>`);
          }
          $$renderer2.push(`<!--]--></button></form></div> `);
          {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <div class="text-xs text-gray-400 max-h-48 overflow-auto bg-gray-900 p-2"><!--[-->`);
          const each_array_8 = ensure_array_like(Object.entries(displayPackageJson.dependencies || {}));
          for (let $$index_8 = 0, $$length = each_array_8.length; $$index_8 < $$length; $$index_8++) {
            let [name, version] = each_array_8[$$index_8];
            $$renderer2.push(`<div${attr_class("")}>${escape_html(name)}: ${escape_html(version)} `);
            {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--></div>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (!selectedProjectData.infraConfig) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="bg-gray-800 p-6"><div class="flex items-center gap-2 mb-4">`);
          Package($$renderer2, { class: "w-5 h-5 text-gray-400" });
          $$renderer2.push(`<!----> <h3 class="text-lg font-semibold">Auto-detect Tech Stack</h3></div> <p class="text-gray-400 text-sm">Click "Scan package.json" to automatically detect the tech stack for this project.</p></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--> <div class="bg-gray-800/50 p-6 border border-gray-700"><h3 class="text-sm font-semibold text-gray-400 mb-3">Configuration Files</h3> <div class="space-y-2 text-sm"><div class="flex items-center justify-between"><span class="text-gray-500">Infrastructure Config:</span> <code class="text-gray-300 bg-gray-700 px-2 py-0.5">${escape_html(data.configFilePath)}</code></div> <div class="flex items-center justify-between"><span class="text-gray-500">Repos List:</span> <code class="text-gray-300 bg-gray-700 px-2 py-0.5">${escape_html(data.reposFilePath)}</code></div></div> <p class="mt-4 text-xs text-gray-500">Edit these files directly to update project configuration. Auto-save coming soon.</p></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64 text-gray-500">Select a project from the sidebar to view its configuration</div>`);
    }
    $$renderer2.push(`<!--]--></main></div></div>`);
  });
}
export {
  _page as default
};
