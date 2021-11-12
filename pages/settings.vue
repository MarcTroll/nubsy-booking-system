<script setup>
const { data: hello } = await useFetch("/api/hello");

useMeta({
    title: "User"
})
</script>

<template>
    <div>
        <h1>
            Settings: {{ hello.title }}
        </h1>
    </div>
</template>