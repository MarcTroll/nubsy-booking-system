<script lang="ts" setup>
    useTitle("Anmelden");

    const loginForm = ref({
        emailAddress: "",
        password: ""
    });

    const authentication = useAuth();

    async function submit() {
        const res = await $fetch("/api/user/login", {
            method: "POST",
            body: loginForm.value
        });

        console.log(res);
        if(res.status === "success") {
            authentication.value.loggedIn = true;
            authentication.value.user = res.user;
            await useRouter().push("/");
        }
    }
</script>

<template>
    <div v-if="!authentication.loggedIn">
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
                        <input type="password" id="password" v-model="loginForm.password">
                    </div>
                </div>
            </div>
            <div class="content formSubmit">
                <input class="button primary" type="submit" value="Anmelden">
                <NuxtLink to="/login" class="button">Passwort vergessen</NuxtLink>
            </div>
        </form>
    </div>
    <div v-else>
        <div class="content">
            <h2>
                Anmelden
            </h2>
        </div>
        <div class="content">
            <div class="message error">
                Diese Seite kannst du derzeit nicht aufrufen.
            </div>
        </div>
    </div>
</template>