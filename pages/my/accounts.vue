<script lang="ts" setup>
    useTitle("Nutzer");

    const authentication = useAuth();
    const form = ref({
        fields: {
            salutation: "male",
            forename: "",
            surname: "",
            city: "",
            street: "",
            phone: ""
        },
        errors: {
            __code: "",
            salutation: "",
            forename: "",
            surname: "",
            city: "",
            street: "",
            phone: ""
        }
    });

    const res = await $fetch("/api/user/account/get", {
        headers: useRequestHeaders()
    });
    // @ts-ignore
    form.value.fields = {...form.value.fields, ...res.fields.user};

    const errorCodeDescription = computed(() => {
        switch(form.value.errors.__code) {
            case "ERR_FORM_INVALID":
                return "Deine Eingaben stimmen nicht. Bitte überprüfe deine Eingaben und sende das Formular danach erneut ab.";
            default:
                return "Ein unbekannter Fehler ist aufgetreten.";
        }
    });
    function errorFieldDescription(errorCode : string) : string {
        if(errorCode.startsWith("ERR_FORM_VALIDATION_TEXT_TOO_SHORT")) {
            return "Die Eingabe muss mindestens " + errorCode.split(":")[1] + " Zeichen lang sein.";
        }
        if(errorCode.startsWith("ERR_FORM_VALIDATION_TEXT_TOO_LONG")) {
            return "Die Eingabe darf maximal " + errorCode.split(":")[1] + " Zeichen lang sein.";
        }
        switch(errorCode) {
            case "ERR_FORM_VALIDATION_VALUE_UNDEFINED":
                return "Diese Feld muss ausgefüllt werden.";
            case "ERR_FORM_VALIDATION_SELECTION_UNKNOWN_OPTION":
                return "Bitte wähle aus einer der Optionen.";
            default:
                return "Ein unbekannter Fehler ist aufgetreten.";
        }
    }

    const submit = async function() {
        const res = await $fetch("/api/user/account/create", {
            method: "POST",
            body: form.value.fields
        });

        if(res.status === "success") {
            authentication.value.user = res.user;
        } else {
            resetFormErrors();
            if(res.code === "ERR_FORM_INVALID") {
                form.value.errors = {...form.value.errors, ...{__code: res.code}, ...res.formErrors};
            }
            form.value.errors = {...form.value.errors, ...{__code: res.code}};
        }
    }
    function resetFormErrors() {
        form.value.errors = {
            __code: "",
            salutation: "",
            forename: "",
            surname: "",
            city: "",
            street: "",
            phone: ""
        };
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
                du mehrere Accounts anlegen und diese bei der Buchung eines Platzes auswählen. <!--Du musst mindestens einen
                Account erstellen.-->Derzeit kannst du nur einen Account erstellen.
            </div>
        </div>
        <div class="content" v-if="form.errors.__code">
            <div class="message error">
                {{ errorCodeDescription }}
            </div>
        </div>
        <form @submit.prevent="submit()">
            <div class="content formInputContainer">
                <div class="grid grid-5">
                    <div :class="{formError: form.errors.salutation}" id="salutationContainer">
                        <label for="salutation">Anrede</label>
                        <select id="salutation" v-model="form.fields.salutation">
                            <option value="male">Herr</option>
                            <option value="female">Frau</option>
                        </select>
                        <div class="formErrorDescription" v-if="form.errors.salutation">{{errorFieldDescription(form.errors.salutation)}}</div>
                    </div>
                    <div :class="{formError: form.errors.forename}" id="forenameContainer">
                        <label for="forename">Vorname</label>
                        <input type="text" id="forename" v-model="form.fields.forename">
                        <div class="formErrorDescription" v-if="form.errors.forename">{{errorFieldDescription(form.errors.forename)}}</div>
                    </div>
                    <div :class="{formError: form.errors.surname}" id="surnameContainer">
                        <label for="surname">Nachname</label>
                        <input type="text" id="surname" v-model="form.fields.surname">
                        <span class="formErrorDescription" v-if="form.errors.surname">{{errorFieldDescription(form.errors.surname)}}</span>
                    </div>
                    <div :class="{formError: form.errors.city}" id="cityContainer">
                        <label for="city">PLZ und Stadt</label>
                        <input type="text" id="city" v-model="form.fields.city">
                        <span class="formErrorDescription" v-if="form.errors.city">{{errorFieldDescription(form.errors.city)}}</span>
                    </div>
                    <div :class="{formError: form.errors.street}" id="streetContainer">
                        <label for="street">Straße und Hausnummer</label>
                        <input type="text" id="street" v-model="form.fields.street">
                        <span class="formErrorDescription" v-if="form.errors.street">{{errorFieldDescription(form.errors.street)}}</span>
                    </div>
                    <div :class="{formError: form.errors.phone}" id="phoneContainer">
                        <label for="phone">Telefon-/Handynummer</label>
                        <input type="text" id="phone" v-model="form.fields.phone">
                        <span class="formErrorDescription" v-if="form.errors.phone">{{errorFieldDescription(form.errors.phone)}}</span>
                    </div>
                </div>
            </div>
            <div class="content formSubmit">
                <input class="button primary" type="submit" value="Account speichern">
            </div>
        </form>
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