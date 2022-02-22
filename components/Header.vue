<script lang="ts" setup>

</script>

<template>
    <header class="header">
        <div class="content">
            <NuxtLink to="/">
                <img src="https://blau-weiss-stolberg.de/images/style-2/pageLogo-d28c2d75.svg" height="80px">
            </NuxtLink>
        </div>
    </header>
</template>

<style lang="scss">
    .header {
        background: #005a91;
        padding: 30px 0;

        .content {
            margin: 0 auto;
        }

        a {
            color: #ffffff;
            margin: 0 10px;

            &.router-link-active {
                text-decoration: 2px underline #FFFFFF;
            }
        }
    }
</style>