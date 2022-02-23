<script lang="ts" setup>
import Header from "~/components/Header.vue";

const authentication = useAuth();
const route = useRoute();
const router = useRouter();

const res = await $fetch("/api/user/relogin", {
    method: "POST",
    headers: useRequestHeaders()
});

if(res.status === "success") {
    authentication.value.loggedIn = true;
    authentication.value.user = res.user;

    if(!authentication.value.user.name) {
        if(!route.path.startsWith("/me/accounts")) {
            await router.replace({
                path: "/me/accounts"
            });
        }
    }
}

watch(route, async (newRoute) => {
    if(authentication.value.loggedIn && !authentication.value.user.name) {
        if(!newRoute.path.startsWith("/me/accounts")) {
            await router.replace({
                path: "/me/accounts"
            });
        }
    }
})

authentication.value.ready = true;
</script>

<template>
    <div>
        <Header />
        <NuxtPage v-if="authentication.ready" />
    </div>
</template>
