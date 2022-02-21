<script lang="ts" setup>
const authentication = useAuth();
</script>

<template>
    <header class="header">
        <div class="content">
            <img src="https://blau-weiss-stolberg.de/images/style-2/pageLogo-d28c2d75.svg" height="80px">
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