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
        if(!route.path.startsWith("/my/accounts")) {
            await router.replace({
                path: "/my/accounts"
            });
        }
    }
}

router.beforeResolve(async (newRoute) => {
    if(authentication.value.loggedIn && !authentication.value.user.name) {
        if(!newRoute.path.startsWith("/my/accounts")) {
            await router.replace({
                path: "/my/accounts"
            });
        }
    }
});

authentication.value.ready = true;
</script>

<template>
    <div>
        <Script src="https://kit.fontawesome.com/f90487fe15.js" crossorigin="anonymous"></Script>
        <Header />
        <NuxtPage v-if="authentication.ready" />
    </div>
</template>
