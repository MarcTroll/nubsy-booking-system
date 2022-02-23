<script lang="ts" setup>
import Header from "~/components/Header.vue";

useTitle("nubsy - loading...")

const authentication = useAuth();

const res = await $fetch("/api/user/relogin", {
    method: "POST",
    headers: useRequestHeaders()
});

if(res.status === "success") {
    authentication.value.loggedIn = true;
    authentication.value.user = res.user;

    // TODO: Check if user account exists
}
authentication.value.ready = true;
</script>

<template>
    <div>
        <Header />
        <NuxtPage v-if="authentication.ready" />
    </div>
</template>
