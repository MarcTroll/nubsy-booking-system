<script lang="ts" setup>
interface EmailFormField {
    id: string;
    type: string;
    label: string | null;
    value: string | null;
    error: string;
    required: boolean;
    maxLength: number;
    validation: string[]; // should be regex
}

const props = defineProps<{
    field: EmailFormField
}>();
const formFieldData = reactive(props.field);
const inputWarning = ref("");

// TODO: Change that when @nuxt-community/i18n is available for nuxt 3
function translateError(error) {
    switch(error) {
        case "ERR_FORM_VALIDATION_VALUE_UNDEFINED":
            return "Diese Feld muss ausgefüllt werden.";
        case "ERR_FORM_VALIDATION_EMAIL_TOO_LONG":
            return "Deine Eingabe darf maximal " + formFieldData.maxLength + " Zeichen lang sein.";
        case "ERR_FORM_VALIDATION_EMAIL_INVALID":
            return "Die Eingabe ist keine gültige E-Mail-Adresse.";
        default:
            return "Ein unbekannter Fehler ist aufgetreten.";
    }
}

function validate() {
    // Reset form field error to show warnings
    formFieldData.error = "";
    inputWarning.value = "";

    if(!formFieldData || (formFieldData.required && formFieldData.value.length === 0)) {
        inputWarning.value = "ERR_FORM_VALIDATION_VALUE_UNDEFINED";
        return;
    }
    if((formFieldData.maxLength && formFieldData.value.length > formFieldData.maxLength) || formFieldData.value.length > 256) {
        inputWarning.value = "ERR_FORM_VALIDATION_EMAIL_TOO_LONG";
        return;
    }
    if(formFieldData.value.match(new RegExp(formFieldData.validation[0], formFieldData.validation[1])) === null) {
        inputWarning.value = "ERR_FORM_VALIDATION_EMAIL_INVALID";
        return;
    }
}
</script>

<template>
    <div :class="{formError: formFieldData.error}" :id="formFieldData.id + 'Field'">
        <label :for="formFieldData.id" v-if="formFieldData.label">{{formFieldData.label}} <span v-if="formFieldData.required" class="formInputRequired">*</span></label>
        <input type="text" :id="formFieldData.id" v-model="formFieldData.value" @blur="validate()">
        <div class="formWarning" v-if="!formFieldData.error && inputWarning">{{translateError(inputWarning)}}</div>
        <div class="formErrorDescription" v-if="formFieldData.error">{{translateError(formFieldData.error)}}</div>
    </div>
</template>