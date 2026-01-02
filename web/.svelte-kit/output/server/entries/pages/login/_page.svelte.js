import { w as spread_props, G as attr } from "../../../chunks/index2.js";
import { j as escape_html } from "../../../chunks/context.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Eye($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
        }
      ],
      ["circle", { "cx": "12", "cy": "12", "r": "3" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "eye" },
      /**
       * @component @name Eye
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
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
    let { form } = $$props;
    let isLoading = false;
    let rememberMe = true;
    let savedUsername = "";
    $$renderer2.push(`<div class="min-h-screen bg-gray-900 flex items-start justify-center p-4 pt-16"><div class="w-full max-w-sm"><div class="flex justify-center mb-10"><img src="/logo.svg" alt="Orchon" class="w-32 h-32"/></div> <form method="POST" autocomplete="on" class="bg-gray-800 p-6 shadow-xl">`);
    if (
      // Save username if "remember me" checked
      form?.error
    ) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 text-sm">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="mb-4"><input type="email" name="username" id="username" required autocomplete="email" inputmode="email"${attr("value", savedUsername)} class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base" placeholder="Email"/></div> <div class="mb-4"><div class="relative"><input${attr("type", "password")} name="password" id="password" required autocomplete="current-password" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 text-base" placeholder="Password"/> <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1"${attr("aria-label", "Show password")}>`);
    {
      $$renderer2.push("<!--[!-->");
      Eye($$renderer2, { class: "w-5 h-5" });
    }
    $$renderer2.push(`<!--]--></button></div></div> <div class="mb-4 flex items-center gap-2"><input type="checkbox" id="remember" name="remember"${attr("checked", rememberMe, true)} class="w-4 h-4 border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"/> <label for="remember" class="text-sm text-gray-400">Remember me</label></div> <button type="submit"${attr("disabled", isLoading, true)} class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium transition-colors text-base">${escape_html("Sign In")}</button></form></div></div>`);
  });
}
export {
  _page as default
};
