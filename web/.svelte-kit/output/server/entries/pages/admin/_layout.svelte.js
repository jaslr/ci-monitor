import { w as spread_props, F as ensure_array_like, G as attr, x as attr_class, y as stringify } from "../../../chunks/index2.js";
import { p as page } from "../../../chunks/index3.js";
import { A as Arrow_left } from "../../../chunks/arrow-left.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { F as Folder_git_2 } from "../../../chunks/folder-git-2.js";
import { S as Settings } from "../../../chunks/settings.js";
import { j as escape_html } from "../../../chunks/context.js";
function Image($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        {
          "width": "18",
          "height": "18",
          "x": "3",
          "y": "3",
          "rx": "2",
          "ry": "2"
        }
      ],
      ["circle", { "cx": "9", "cy": "9", "r": "2" }],
      ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "image" },
      /**
       * @component @name Image
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgLz4KICA8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/image
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
function Log_out($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m16 17 5-5-5-5" }],
      ["path", { "d": "M21 12H9" }],
      ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "log-out" },
      /**
       * @component @name LogOut
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/log-out
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
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    const navItems = [
      {
        href: "/admin/media",
        label: "Media",
        icon: Image,
        description: "Upload & manage logos"
      },
      {
        href: "/admin/projects",
        label: "Projects",
        icon: Folder_git_2,
        description: "Repos & groups"
      },
      {
        href: "/admin/repos",
        label: "Config",
        icon: Settings,
        description: "Tech stack detection"
      }
    ];
    function isActive(href) {
      return page.url.pathname === href || page.url.pathname.startsWith(href + "/");
    }
    $$renderer2.push(`<div class="min-h-screen bg-gray-900 text-white flex flex-col"><header class="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between"><div class="flex items-center gap-4"><a href="/" class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors" title="Back to Dashboard">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></a> <div><h1 class="text-lg font-semibold text-gray-100">Admin</h1> <p class="text-xs text-gray-500">Manage projects, media, and settings</p></div></div> <form method="POST" action="/logout"><button type="submit" class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors">`);
    Log_out($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>Logout</span></button></form></header> <div class="flex flex-1 overflow-hidden"><nav class="w-56 shrink-0 border-r border-gray-800 bg-gray-900/50 overflow-y-auto"><div class="p-4 space-y-1"><!--[-->`);
    const each_array = ensure_array_like(navItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      const Icon2 = item.icon;
      $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${stringify(isActive(item.href) ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}`)}><!---->`);
      Icon2($$renderer2, { class: "w-5 h-5 shrink-0" });
      $$renderer2.push(`<!----> <div class="min-w-0"><div class="font-medium truncate">${escape_html(item.label)}</div> <div class="text-xs opacity-70 truncate">${escape_html(item.description)}</div></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></nav> <main class="flex-1 overflow-y-auto">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main></div></div>`);
  });
}
export {
  _layout as default
};
