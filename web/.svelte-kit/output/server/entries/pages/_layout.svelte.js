import { w as spread_props, x as attr_class, y as stringify, z as head } from "../../chunks/index2.js";
import { p as page } from "../../chunks/index3.js";
import { I as Icon } from "../../chunks/Icon.js";
import { L as Layers } from "../../chunks/layers.js";
import { C as Cloud } from "../../chunks/cloud.js";
import { S as Settings } from "../../chunks/settings.js";
import { j as escape_html } from "../../chunks/context.js";
function Activity($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "activity" },
      /**
       * @component @name Activity
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTJoLTIuNDhhMiAyIDAgMCAwLTEuOTMgMS40NmwtMi4zNSA4LjM2YS4yNS4yNSAwIDAgMS0uNDggMEw5LjI0IDIuMThhLjI1LjI1IDAgMCAwLS40OCAwbC0yLjM1IDguMzZBMiAyIDAgMCAxIDQuNDkgMTJIMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/activity
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
function Network($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        { "x": "16", "y": "16", "width": "6", "height": "6", "rx": "1" }
      ],
      [
        "rect",
        { "x": "2", "y": "16", "width": "6", "height": "6", "rx": "1" }
      ],
      [
        "rect",
        { "x": "9", "y": "2", "width": "6", "height": "6", "rx": "1" }
      ],
      ["path", { "d": "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" }],
      ["path", { "d": "M12 12V8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "network" },
      /**
       * @component @name Network
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIiAvPgogIDxyZWN0IHg9IjIiIHk9IjE2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cmVjdCB4PSI5IiB5PSIyIiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cGF0aCBkPSJNNSAxNnYtM2ExIDEgMCAwIDEgMS0xaDEyYTEgMSAwIDAgMSAxIDF2MyIgLz4KICA8cGF0aCBkPSJNMTIgMTJWOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/network
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
function Radio($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M16.247 7.761a6 6 0 0 1 0 8.478" }],
      ["path", { "d": "M19.075 4.933a10 10 0 0 1 0 14.134" }],
      ["path", { "d": "M4.925 19.067a10 10 0 0 1 0-14.134" }],
      ["path", { "d": "M7.753 16.239a6 6 0 0 1 0-8.478" }],
      ["circle", { "cx": "12", "cy": "12", "r": "2" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "radio" },
      /**
       * @component @name Radio
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYuMjQ3IDcuNzYxYTYgNiAwIDAgMSAwIDguNDc4IiAvPgogIDxwYXRoIGQ9Ik0xOS4wNzUgNC45MzNhMTAgMTAgMCAwIDEgMCAxNC4xMzQiIC8+CiAgPHBhdGggZD0iTTQuOTI1IDE5LjA2N2ExMCAxMCAwIDAgMSAwLTE0LjEzNCIgLz4KICA8cGF0aCBkPSJNNy43NTMgMTYuMjM5YTYgNiAwIDAgMSAwLTguNDc4IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/radio
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
function MainNav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let currentPath = page.url.pathname;
    $$renderer2.push(`<nav class="flex flex-col gap-1 py-2"><a href="/"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath === "/" ? "bg-gray-800 border-l-2 border-blue-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Activity($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath === "/" ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath === "/" ? "text-white" : "text-gray-300")} truncate`)}>Console</div></div></a> <a href="/projects"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath === "/projects" || currentPath.startsWith("/projects") ? "bg-gray-800 border-l-2 border-blue-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Layers($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath === "/projects" || currentPath.startsWith("/projects") ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath === "/projects" || currentPath.startsWith("/projects") ? "text-white" : "text-gray-300")} truncate`)}>Projects</div></div></a> <a href="/deployments"${attr_class(`flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors ${stringify(currentPath === "/deployments" || currentPath.startsWith("/deployments") ? "bg-gray-800/50 border-l-2 border-blue-400" : "hover:bg-gray-800/30 border-l-2 border-transparent")}`)}>`);
    Cloud($$renderer2, {
      class: `w-3.5 h-3.5 ${stringify(currentPath === "/deployments" || currentPath.startsWith("/deployments") ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`text-sm ${stringify(currentPath === "/deployments" || currentPath.startsWith("/deployments") ? "text-white" : "text-gray-400")} truncate`)}>Deployments</div></div></a> <a href="/ecosystem"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath === "/ecosystem" ? "bg-gray-800 border-l-2 border-blue-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Network($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath === "/ecosystem" ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath === "/ecosystem" ? "text-white" : "text-gray-300")} truncate`)}>Ecosystem</div></div></a></nav>`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children, data } = $$props;
    let isAdminRoute = page.url.pathname.startsWith("/admin");
    let isLoginRoute = page.url.pathname === "/login";
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Orchon</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"/>`);
    });
    if (isAdminRoute || isLoginRoute) {
      $$renderer2.push("<!--[-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="min-h-screen bg-gray-900 text-white flex flex-col"><header class="shrink-0 px-4 py-3 border-b border-gray-800"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><a href="/" class="flex items-center gap-3"><img src="/logo.svg" alt="Orchon logo" class="w-8 h-8 text-gray-200"/> <div><h1 class="text-lg font-semibold text-gray-100" style="font-family: 'Roboto', sans-serif;">Orchon</h1> <p class="text-xs text-gray-500">Infrastructure Observatory</p></div></a></div> <div class="flex items-center gap-4"><div class="relative connection-status"><button class="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer">`);
      Radio($$renderer2, {
        class: `w-3 h-3 ${stringify("text-gray-500")}`
      });
      $$renderer2.push(`<!----> <span${attr_class("text-gray-500")}>${escape_html("Offline")}</span></button></div> <a href="/admin" class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors" title="Settings">`);
      Settings($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></a></div></div></header> <div class="flex-1 flex flex-col lg:flex-row min-h-0"><aside class="hidden lg:flex lg:flex-col w-[12rem] shrink-0 border-r border-gray-800 bg-gray-900">`);
      MainNav($$renderer2);
      $$renderer2.push(`<!----></aside> <div class="lg:hidden border-b border-gray-800 bg-gray-900"><div class="flex"><a href="/"${attr_class(`flex-1 py-2 text-center text-sm ${stringify(page.url.pathname === "/" ? "text-white border-b-2 border-blue-500" : "text-gray-400")}`)}>Console</a> <a href="/projects"${attr_class(`flex-1 py-2 text-center text-sm ${stringify(page.url.pathname.startsWith("/projects") ? "text-white border-b-2 border-blue-500" : "text-gray-400")}`)}>Projects</a> <a href="/deployments"${attr_class(`flex-1 py-2 text-center text-sm ${stringify(page.url.pathname.startsWith("/deployments") ? "text-white border-b-2 border-blue-500" : "text-gray-400")}`)}>Deploys</a> <a href="/ecosystem"${attr_class(`flex-1 py-2 text-center text-sm ${stringify(page.url.pathname === "/ecosystem" ? "text-white border-b-2 border-blue-500" : "text-gray-400")}`)}>Ecosystem</a></div></div> <main class="flex-1 flex flex-col overflow-hidden min-w-0">`);
      children($$renderer2);
      $$renderer2.push(`<!----></main></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _layout as default
};
