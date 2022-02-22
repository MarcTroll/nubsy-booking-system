<script setup>
import Header from "./components/Header";

useMeta({
    title: "Testitest"
})

const authentication = useAuth();
// TODO: auto login
authentication.value.ready = true;
</script>

<template>
    <div>
        <Header />
        <NuxtPage v-if="authentication.ready" />
    </div>
</template>
