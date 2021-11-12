import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive("clickaway", {
        beforeMount(el, binding, vnode) {
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