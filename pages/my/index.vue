<script lang="ts" setup>
    import {useBreadcrumb} from "~/composables/useBreadcrumb";
    import NubsyAuthenticatedContent from "~/components/nubsy/authentication/NubsyAuthenticatedContent.vue";

    useTitle("Mein Konto");

    const authentication = useAuth();
    useBreadcrumb().value.paths = [{
        title: "Startseite",
        link: "/"
    }];

    let accountInformation = (await $fetch("/api/user/account/get", {
        headers: useRequestHeaders()
    }));

    function translateSalutation(salutation) {
        if(salutation === "male") {
            return "Herr";
        } else if(salutation === "female") {
            return "Frau";
        }
        return "";
    }
</script>

<template>
    <NubsyAuthenticatedContent permission="user.account.canEdit">
        <div class="content">
            <h2>
                Mein Konto
            </h2>
        </div>
        <div class="content">
            <div class="message warning">
                Du bearbeitest dein eigenes Benutzerkonto. Alle Änderungen können direkte Auswirkungen auf dieses haben.
            </div>
        </div>
        <div class="content">
            <div id="accountContainer">
                <h4>Mein Account</h4>
                <div class="grid grid-4">
                    <p>
                        <strong>Anrede:</strong><br>
                        {{translateSalutation(accountInformation.user.salutation)}} {{accountInformation.user.forename}} {{accountInformation.user.surname}}
                    </p>
                    <p>
                        <strong>Adresse:</strong><br>
                        {{accountInformation.user.street}}<br>
                        {{accountInformation.user.city}}
                    </p>
                    <p>
                        <strong>Telefon-/Handynummer:</strong><br>
                        {{accountInformation.user.phone}}
                    </p>
                    <p>
                        <NuxtLink to="/my/accounts" class="button block">
                            Account bearbeiten
                        </NuxtLink>
                    </p>
                </div>
            </div>
        </div>
        <div class="content">
            <div id="privacyContainer">
                <h4>Privatsphäre</h4>
                <div class="grid grid-4">
                    <p id="privacySelectionDescription">
                        <strong>Volle Kontrolle über deine Privatsphäre!</strong><br>
                        Dieses Buchungssystem zeigt im Buchungskalender zu den Platzbuchungen auch den Namen des Buchenden an.
                        Solltest du nicht damit einverstanden sein, dass dein Name öffentlich/für registrierte Benutzer angezeigt wird, kannst du deinen Namen ausblenden.<br><br>
                        Die Funktion zur Veröffentlichung deines Namen ist derzeit <strong>aktiviert</strong>.
                    </p>
                    <p id="privacySelectionAction">
                        <span class="button block">Deaktivieren</span>
                    </p>
                </div>
            </div>
        </div>
    </NubsyAuthenticatedContent>
</template>

<style lang="scss">
    #privacySelectionDescription {
        grid-column-start: 1;
        grid-column-end: 4;
    }
    #privacySelectionAction {
        align-self: end;
    }
</style>