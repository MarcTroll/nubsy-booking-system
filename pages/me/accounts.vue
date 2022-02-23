<script lang="ts" setup>
    useTitle("Nutzer");

    const authentication = useAuth();

    const submit = function() {

    }
</script>

<template>
    <div>
        <div class="content">
            <h2>
                Accounts
            </h2>
        </div>
        <div class="content">
            <div class="message information">
                Verwalte hier deine Accounts, für die du Plätze buchen möchtest. Für gemeinsame E-Mail-Adressen kannst
                du mehrere Accounts anlegen und diese bei der Buchung eines Platzes auswählen. Du musst mindestens einen
                Account erstellen.
            </div>
        </div>
        <form @submit.prevent="submit()">
            <div class="content">

            </div>
            <div class="content formSubmit">
                <input class="button primary" type="submit" value="Account erstellen">
            </div>
        </form>
    </div>
</template>