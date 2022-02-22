<script lang="ts" setup>
    useMeta({
        title: "Anmelden - nubsy"
    });

    const loginForm = {
        emailAddress: ""
    }

    const authentication = useAuth();

    function submit() {

    }
</script>

<template>
    <div>
        <div class="content">
            <h2>
                Anmelden
            </h2>
        </div>
        <div class="content">
            <div class="message information">
                Du hast noch kein Benutzerkonto? <NuxtLink to="/login">Registriere</NuxtLink> dich jetzt, um Plätze zu buchen!
            </div>
        </div>
        <form @submit.prevent="submit()">
            <div class="content userLogin formInputContainer">
                <div class="grid grid-2">
                    <div>
                        <label for="email">E-Mail-Adresse</label>
                        <input type="email" id="email" v-model="loginForm.emailAddress">
                    </div>
                    <div>
                        <label for="password">Passwort</label>
                        <input type="password" id="password" v-model="loginForm.emailAddress">
                    </div>
                </div>
            </div>
            <div class="content">
                <input class="button primary" type="submit" value="Anmelden">
                <NuxtLink to="/login" class="button">Passwort vergessen</NuxtLink>
            </div>
        </form>
    </div>
</template>