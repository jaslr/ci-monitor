import { w as spread_props, F as ensure_array_like, x as attr_class, G as attr, J as attr_style, y as stringify } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Check } from "../../../../chunks/check.js";
import { X } from "../../../../chunks/x.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { F as Folder_git_2 } from "../../../../chunks/folder-git-2.js";
import { j as escape_html } from "../../../../chunks/context.js";
function Grip_vertical($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "9", "cy": "12", "r": "1" }],
      ["circle", { "cx": "9", "cy": "5", "r": "1" }],
      ["circle", { "cx": "9", "cy": "19", "r": "1" }],
      ["circle", { "cx": "15", "cy": "12", "r": "1" }],
      ["circle", { "cx": "15", "cy": "5", "r": "1" }],
      ["circle", { "cx": "15", "cy": "19", "r": "1" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "grip-vertical" },
      /**
       * @component @name GripVertical
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjUiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjE5IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iMTUiIGN5PSI1IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTkiIHI9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/grip-vertical
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
function Pen($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "pen" },
      /**
       * @component @name Pen
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pen
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
function Rotate_ccw($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
      ],
      ["path", { "d": "M3 3v5h5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "rotate-ccw" },
      /**
       * @component @name RotateCcw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rotate-ccw
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
    let groups = structuredClone(data.groups);
    let projects = structuredClone(data.projects);
    let editingProjectId = null;
    let editingProjectName = "";
    let draggedProject = null;
    let dragOverGroup = null;
    function getProjectsInGroup(groupId) {
      return projects.filter((p) => p.groups.includes(groupId)).sort((a, b) => a.order - b.order);
    }
    $$renderer2.push(`<div class="p-6 space-y-6"><div class="flex items-center justify-between"><div><h2 class="text-xl font-semibold text-white">Projects &amp; Groups</h2> <p class="text-gray-400 text-sm mt-1">Organize repos into groups. Drag to move between groups.</p></div> <div class="flex items-center gap-2">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="?/resetConfig"><button type="submit" class="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors" title="Reset to defaults">`);
    Rotate_ccw($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button></form></div></div> `);
    if (form?.success) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-2 text-green-300 text-sm">`);
      Check($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> ${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-2 text-red-300 text-sm">`);
      X($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> ${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex items-center gap-2">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 text-sm transition-colors">`);
      Plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Add Group</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"><!--[-->`);
    const each_array = ensure_array_like(groups);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let group = each_array[$$index_1];
      const groupProjects = getProjectsInGroup(group.id);
      $$renderer2.push(`<div${attr_class(`bg-gray-800 rounded-lg overflow-hidden transition-all ${stringify(dragOverGroup === group.id ? "ring-2 ring-blue-500" : "")}`)} role="region"${attr("aria-label", `Drop zone for ${stringify(group.name)}`)}><div class="px-4 py-3 border-b border-gray-700 flex items-center justify-between"${attr_style(`border-left: 3px solid ${stringify(group.color)}`)}><div class="flex items-center gap-2"><span class="font-medium text-white">${escape_html(group.name)}</span> <span class="text-xs text-gray-500">(${escape_html(groupProjects.length)})</span></div> `);
      if (group.id !== "jaslr" && group.id !== "jvp-ux") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<form method="POST" action="?/deleteGroup"><input type="hidden" name="groupId"${attr("value", group.id)}/> <button type="submit" class="p-1 text-gray-500 hover:text-red-400 transition-colors" title="Delete group">`);
        Trash_2($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----></button></form>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="p-2 min-h-[100px] space-y-1">`);
      const each_array_1 = ensure_array_like(groupProjects);
      if (each_array_1.length !== 0) {
        $$renderer2.push("<!--[-->");
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let project = each_array_1[$$index];
          $$renderer2.push(`<div${attr_class(`group flex items-center gap-2 px-2 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded cursor-move transition-colors ${stringify(draggedProject === project.id ? "opacity-50" : "")}`)} draggable="true" role="listitem">`);
          Grip_vertical($$renderer2, { class: "w-4 h-4 text-gray-500 shrink-0" });
          $$renderer2.push(`<!----> `);
          if (editingProjectId === project.id) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<input type="text"${attr("value", editingProjectName)} class="flex-1 px-2 py-0.5 bg-gray-800 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"/> <button class="p-1 text-green-400 hover:text-green-300">`);
            Check($$renderer2, { class: "w-3.5 h-3.5" });
            $$renderer2.push(`<!----></button> <button class="p-1 text-gray-400 hover:text-gray-300">`);
            X($$renderer2, { class: "w-3.5 h-3.5" });
            $$renderer2.push(`<!----></button>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="flex-1 min-w-0"><div class="text-sm text-white truncate">${escape_html(project.displayName)}</div> <div class="text-xs text-gray-500 truncate">${escape_html(project.owner)}/${escape_html(project.repo)}</div></div> <button class="p-1 text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" title="Rename">`);
            Pen($$renderer2, { class: "w-3.5 h-3.5" });
            $$renderer2.push(`<!----></button> `);
            if (project.groups.length > 1) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<button class="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove from this group">`);
              X($$renderer2, { class: "w-3.5 h-3.5" });
              $$renderer2.push(`<!----></button>`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div>`);
        }
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex items-center justify-center h-20 text-gray-500 text-sm">`);
        Folder_git_2($$renderer2, { class: "w-5 h-5 mr-2 opacity-50" });
        $$renderer2.push(`<!----> Drag repos here</div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-8"><h3 class="text-lg font-medium text-gray-300 mb-3">All Projects</h3> <div class="bg-gray-800 rounded-lg p-4"><div class="flex flex-wrap gap-2"><!--[-->`);
    const each_array_2 = ensure_array_like(projects);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let project = each_array_2[$$index_2];
      $$renderer2.push(`<div class="flex items-center gap-1.5 px-2 py-1 bg-gray-700 rounded text-sm cursor-move" draggable="true" role="listitem"><span class="text-gray-300">${escape_html(project.displayName)}</span> <span class="text-xs text-gray-500">(${escape_html(project.groups.length)})</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div>`);
  });
}
export {
  _page as default
};
