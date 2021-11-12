import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    css: ["~/assets/styles/main.css"],

    vue: {
        compilerOptions: {
            directiveTransforms: {
                clickaway: () => ({
                    props: [],
                    needRuntime: true
                })
            }
        }
    }
})
