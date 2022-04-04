<script lang="ts" setup>
import NubsyForm from "~/components/nubsy/form/NubsyForm.vue";
import {useAuth} from "~/composables/useAuth";

useTitle("Mein Account");
useBreadcrumb().value.paths = [{
    title: "Startseite",
    link: "/"
},{
    title: "Mein Konto",
    link: "/my"
}];

const authentication = useAuth();

const updateUser = (event) => {
    if(event.body && event.body.user) {
        useAuth().value.user = event.body.user;
    }
}
</script>

<template>
    <div>
        <div class="content">
            <h2>
                Mein Account
            </h2>
        </div>
        <div class="content">
            <div class="message information">
                Verwalte hier deine Accounts, für die du Plätze buchen möchtest. Für gemeinsame E-Mail-Adressen kannst
                du mehrere Accounts anlegen und diese bei der Buchung eines Platzes auswählen. <!--Du musst mindestens einen
                Account erstellen.-->Derzeit kannst du nur einen Account erstellen.
            </div>
        </div>
        <NubsyForm form-url="/api/user/account/edit" additional-class-list="grid grid-5" @form:submit="updateUser($event)">

        </NubsyForm>
    </div>
</template>

<style lang="scss">
#forenameContainer {
    grid-column-start: 2;
    grid-column-end: 4;
}
#surnameContainer {
    grid-column-start: 4;
    grid-column-end: 6;
}
#cityContainer {
    grid-column-start: 1;
    grid-column-end: 3;
}
#streetContainer {
    grid-column-start: 3;
    grid-column-end: 5;
}
</style>