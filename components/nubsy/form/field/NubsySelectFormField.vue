<script lang="ts" setup>
interface SelectFormField {
    id: string;
    type: string;
    label: string | null;
    value: string | null;
    error: string;
    required: boolean;
    options: string[];
}

const props = defineProps<{
    field: SelectFormField
}>();
const formFieldData = reactive(props.field);
const inputWarning = ref("");

// TODO: Change that when @nuxt-community/i18n is available for nuxt 3
function translateError(error) {
    switch(error) {
        case "ERR_FORM_VALIDATION_VALUE_UNDEFINED":
            return "Diese Feld muss ausgefüllt werden.";
        default:
            return "Ein unbekannter Fehler ist aufgetreten.";
    }
}

function validate() {
    // Reset form field error to show warnings
    formFieldData.error = "";
    inputWarning.value = "";

    if(!formFieldData || (formFieldData.required && formFieldData.value === "none")) {
        inputWarning.value = "ERR_FORM_VALIDATION_VALUE_UNDEFINED";
        return;
    }
}
</script>

<template>
    <div :class="{formError: formFieldData.error}" :id="formFieldData.id + 'Field'">
        <label :for="formFieldData.id" v-if="formFieldData.label">{{formFieldData.label}} <span v-if="formFieldData.required" class="formInputRequired">*</span></label>
        <select :id="formFieldData.id" v-model="formFieldData.value" @blur="validate()">
            <option v-for="value in formFieldData.options" :value="value">{{value}}</option>
        </select>
        <div class="formWarning" v-if="!formFieldData.error && inputWarning">{{translateError(inputWarning)}}</div>
        <div class="formErrorDescription" v-if="formFieldData.error">{{translateError(formFieldData.error)}}</div>
    </div>
</template>