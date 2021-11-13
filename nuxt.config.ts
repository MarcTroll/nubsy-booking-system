import { defineNuxtConfig } from 'nuxt3'
import {resolve} from "path";

export default defineNuxtConfig({
    css: ["~/assets/styles/main.css"],
    nitro: {
        preset: resolve(__dirname, "preset")
    },
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
