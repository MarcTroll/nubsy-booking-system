<script lang="ts" setup>
    import {useBreadcrumb} from "~/composables/useBreadcrumb";
    import {useTitle} from "~/composables/useTitle";

    useTitle("Anmelden");

    useBreadcrumb().value.paths = [{
        title: "Startseite",
        link: "/"
    }];

    const loginForm = ref({
        emailAddress: "",
        password: "",
        errors: {
            __code: "",
            emailAddress: "",
            password: ""
        }
    });

    const errorCodeDescription = computed(() => {
        switch(loginForm.value.errors.__code) {
            case "ERR_FORM_INVALID":
                return "Deine Eingaben stimmen nicht. Bitte überprüfe deine Eingaben und sende das Formular danach erneut ab.";
            case "ERR_USER_DOESNT_EXIST":
                return "Es konnte kein Nutzer mit dieser E-Mail-Adresse gefunden werden.";
            case "ERR_PASSWORD_INVALID":
                return "Das Passwort stimmt nicht. Solltest du dein Passwort vergessen haben, kannst du es über die Schaltfläche unten zurücksetzen.";
            case "ERR_EMAIL_NOT_CONFIRMED":
                return "Du musst deine E-Mail-Adresse erst bestätigen, bevor du dich anmelden kannst.";
            default:
                return "Ein unbekannter Fehler ist aufgetreten.";
        }
    })
    function errorFieldDescription(errorCode : string) : string {
        if(errorCode.startsWith("ERR_FORM_VALIDATION_PASSWORD_TOO_SHORT")) {
            return "Das Passwort ist zu kurz. Es muss mindestens " + errorCode.split(":")[1] + " Zeichen lang sein.";
        }
        if(errorCode.startsWith("ERR_FORM_VALIDATION_PASSWORD_TOO_LONG")) {
            return "Die E-Mail-Adresse ist zu lang. Sie darf maximal " + errorCode.split(":")[1] + " Zeichen lang sein.";
        }
        switch(errorCode) {
            case "ERR_FORM_VALIDATION_VALUE_UNDEFINED":
                return "Diese Feld muss ausgefüllt werden.";
            case "ERR_FORM_VALIDATION_EMAIL_INVALID":
                return "Die Eingabe ist keine gültige E-Mail-Adresse.";
            default:
                return "Ein unbekannter Fehler ist aufgetreten. Sollte dieser Fehler weiterhin bestehen, kontaktiere den Administrator.";
        }
    }

    const authentication = useAuth();

    async function submit() {
        try {
            const res = await $fetch("/api/user/login", {
                method: "POST",
                body: loginForm.value
            });

            if(res.status === "success") {
                authentication.value.loggedIn = true;
                authentication.value.user = res.user;

                await useRouter().push("/");
            } else {
                resetFormErrors();
                if(res.code === "ERR_FORM_INVALID") {
                    loginForm.value.errors = {...loginForm.value.errors, ...{__code: res.code}, ...res.formErrors};
                }
                loginForm.value.errors = {...loginForm.value.errors, ...{__code: res.code}};
            }
        } catch(err) {
            loginForm.value.errors = {...loginForm.value.errors, ...{__code: err.code}};
        }
    }

    function resetFormErrors() {
        loginForm.value.errors = {
            __code: "",
            emailAddress: "",
            password: ""
        };
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
        <div class="content" v-if="loginForm.errors.__code">
            <div class="message error">
                {{ errorCodeDescription }}
            </div>
        </div>
        <form @submit.prevent="submit()">
            <div class="content userLogin formInputContainer">
                <div class="grid grid-2">
                    <div :class="{formError: loginForm.errors.emailAddress}">
                        <label for="email">E-Mail-Adresse</label>
                        <input type="text" id="email" v-model="loginForm.emailAddress">
                        <div class="formErrorDescription" v-if="loginForm.errors.emailAddress">{{errorFieldDescription(loginForm.errors.emailAddress)}}</div>
                    </div>
                    <div :class="{formError: loginForm.errors.password}">
                        <label for="password">Passwort</label>
                        <input type="password" id="password" v-model="loginForm.password">
                        <span class="formErrorDescription" v-if="loginForm.errors.password">{{errorFieldDescription(loginForm.errors.password)}}</span>
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
            <h4>
                Zugriff verweigert
            </h4>
            <p v-if="authentication.loggedIn">
                Du bist bereits angemeldet. <NuxtLink to="/">Zurück zur Startseite</NuxtLink>
            </p>
        </div>
    </div>
</template>