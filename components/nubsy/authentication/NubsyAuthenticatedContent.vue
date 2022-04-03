<script lang="ts" setup>
import {FetchError} from "ohmyfetch";
import {useAuth} from "~/composables/useAuth";

const props = withDefaults(defineProps<{
    permission: string;
    showError?: boolean;
}>(), {
    showError: true
});

let permissionValue = ref(false);
const authentication = useAuth();

try {
    const response = await $fetch("/api/user/permission/request", {
        method: "GET",
        headers: useRequestHeaders(),
        params: {
            permissionList: props.permission
        }
    });

    if(response.status === "success") {
        permissionValue.value = response.value;
    }
} catch(err) {
    if(err instanceof FetchError) {
        if(err.response.status !== 403) {
            throw err;
        }
    }
}

</script>

<template>
    <div>
        <div v-if="permissionValue">
            <slot>
                User Permission Granted. Place your content here.
            </slot>
        </div>
        <div class="content" v-if="!permissionValue && (props.showError)">
            <h4>
                Zugriff verweigert
            </h4>
            <p v-if="authentication.loggedIn">
                Du besitzt nicht die notwendigen Zugriffsrechte diese Seite aufzurufen.
            </p>
            <p v-else>
                Du bist nicht angemeldet. <NuxtLink to="/login">Melde dich an</NuxtLink>, um Zugriff zu dieser Seite zu erhalten.
            </p>
        </div>
    </div>
</template>