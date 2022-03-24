<script lang="ts" setup>
interface NumberFormField {
    id: string;
    type: string;
    label: string | null;
    value: string | null;
    error: string;
    decimals: number;
    validation: string[]; // should be regex
}

const props = defineProps<{
    field: NumberFormField
}>();
const formFieldData = reactive(props.field);
const inputWarning = ref("");

// TODO: Change that when @nuxt-community/i18n is available for nuxt 3
function translateError(error) {
    switch(error) {
        case "ERR_FORM_VALIDATION_VALUE_UNDEFINED":
            return "Diese Feld muss ausgefüllt werden.";
        case "ERR_FORM_VALIDATION_NUMBER_INVALID":
            if(formFieldData.decimals && formFieldData.decimals > 0) {
                return "Deine Eingabe darf nur eine Zahl mit maximal " + formFieldData.decimals + " Nachkommastellen sein.";
            }
            return "Deine Eingabe darf nur eine ganzzahlige Zahl sein.";
        default:
            return "Ein unbekannter Fehler ist aufgetreten.";
    }
}

function validate() {
    // Reset form field error to show warnings
    formFieldData.error = "";
    inputWarning.value = "";

    // TODO: https://stackoverflow.com/questions/39154255/converting-regexp-to-string-then-back-to-regexp
    console.log(formFieldData.value, new RegExp(formFieldData.validation[0], formFieldData.validation[1]));
    console.log(formFieldData.value.match(new RegExp(formFieldData.validation[0], formFieldData.validation[1])));

    if(!formFieldData || formFieldData.value.length === 0) {
        inputWarning.value = "ERR_FORM_VALIDATION_VALUE_UNDEFINED";
        return;
    }
    if(formFieldData.value.match(new RegExp(formFieldData.validation[0], formFieldData.validation[1])) === null) {
        inputWarning.value = "ERR_FORM_VALIDATION_NUMBER_INVALID";
    }
}
</script>

<template>
    <div :class="{formError: formFieldData.error}" :id="formFieldData.id + 'Field'">
        <label :for="formFieldData.id" v-if="formFieldData.label">{{formFieldData.label}}</label>
        <div class="fieldInputContainer">
            <div class="counterButton">-</div>
            <input type="text" :id="formFieldData.id" v-model="formFieldData.value" @blur="validate()">
            <div class="counterButton">+</div>
        </div>
        <div class="formWarning" v-if="!formFieldData.error && inputWarning">{{translateError(inputWarning)}}</div>
        <div class="formErrorDescription" v-if="formFieldData.error">{{translateError(formFieldData.error)}}</div>
    </div>
</template>

<style lang="scss">
.fieldInputContainer {
    display: flex;
    align-items: stretch;

    > .counterButton {
        width: 45px;
        border: 1px solid #005a91;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: #005a91;
        cursor: pointer;
    }

    > input {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>