<script lang="ts" setup>
    useTitle("Mein Account");
    useBreadcrumb().value.paths = [{
        title: "Startseite",
        link: "/"
    },{
        title: "Mein Konto",
        link: "/my"
    }];

    const authentication = useAuth();
    const form = ref({
        success: false,
        fields: {
            salutation: "none",
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
    let _timer = null;

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
                return "Folgender Fehler ist bei der Verarbeitung deiner Daten aufgetreten: " + errorCode;
        }
    }

    const submit = async function() {
        if(_timer !== null) {
            clearTimeout(_timer);
            _timer = null;
        }

        try {
            const res = await $fetch("/api/user/account/save", {
                method: "POST",
                body: form.value.fields
            });

            if(res.status === "success") {
                resetFormErrors();
                authentication.value.user = res.user;
                form.value.success = true;

                _timer = setTimeout(() => {
                    form.value.success = false;

                    _timer = null;
                }, 5000);
            } else {
                resetFormErrors();
                if(res.code === "ERR_FORM_INVALID") {
                    form.value.errors = {...form.value.errors, ...{__code: res.code}, ...res.formErrors};
                }
                form.value.errors = {...form.value.errors, ...{__code: res.code}};
            }
        } catch(err) {
            resetFormErrors();
            form.value.errors = {...form.value.errors, ...{__code: err.message}};
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
        <div class="content" v-if="form.errors.__code">
            <div class="message error">
                {{ errorCodeDescription }}
            </div>
        </div>
        <div class="content" v-if="form.success">
            <div class="message success">
                Deine Eingaben wurden erfolgreich gespeichert!
            </div>
        </div>
        <form @submit.prevent="submit()">
            <div class="content formInputContainer">
                <div class="grid grid-5">
                    <div :class="{formError: form.errors.salutation}" id="salutationContainer">
                        <label for="salutation">Anrede</label>
                        <select id="salutation" v-model="form.fields.salutation">
                            <option value="none">keine Auswahl</option>
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