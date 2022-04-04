<script lang="ts" setup>
    const route = useRoute();
    const breadcrumb = useBreadcrumb();
</script>

<template>
    <div>
        <header class="header">
            <div class="content">
                <NuxtLink to="/">
                    <img src="https://blau-weiss-stolberg.de/images/style-2/pageLogo-d28c2d75.svg" height="80px">
                </NuxtLink>
            </div>
        </header>
        <div class="breadcrumbs" v-if="breadcrumb.paths.length > 0">
            <div class="content">
                <span v-for="path of breadcrumb.paths" class="breadcrumb">
                    <NuxtLink :to="path.link">
                        {{ path.title }}
                    </NuxtLink>
                </span>
            </div>
        </div>
    </div>
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

    .breadcrumbs {
        background: darken(white, 5%);
        padding: 10px 0;
        > .content {
            margin-top: 0;
        }

        .breadcrumb {
            &:not(:first-child) {
                margin-left: 10px;
                &:before {
                    content: '/';
                    margin-right: 10px;
                }
            }
        }
    }
</style>