<template>
    <header class="header">
        <div class="content">
            <NuxtLink to="/">Kalender</NuxtLink>
            <NuxtLink to="/settings">Verwaltung</NuxtLink>
            <NuxtLink to="/user">Profil</NuxtLink>
        </div>
    </header>
</template>

<style lang="scss">
    .header {
        background: #055B84;
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