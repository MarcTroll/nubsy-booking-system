import { defineNuxtPlugin } from "#app";
import {DirectiveBinding, VNode} from "@vue/runtime-core";

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive("clickaway", {
        beforeMount(el: any, binding: DirectiveBinding<any>, vnode: VNode<any, any>) {
            el.clickOutsideEvent = (event) => {
                if(!(el === event.target || el.contains(event.target))) {
                    binding.value(el, event);
                }
            };
            document.body.addEventListener("click", el.clickOutsideEvent);
        },
        unmounted(el) {
            document.body.removeEventListener("click", el.clickOutsideEvent);
        }
    });
});