<script lang="ts" setup>

    interface TextFormField {
        id: string;
        type: string;
        label: string | null;
        value: string | null;
        error: string;
        minLength: number;
        maxLength: number;
    }

    const props = defineProps<{
        field: TextFormField
    }>();
    const formFieldData = reactive(props.field);
</script>

<template>
    <div :class="{formError: formFieldData.error}" :id="formFieldData.id + 'Field'">
        <label :for="formFieldData.id" v-if="formFieldData.label">{{formFieldData.label}}</label>
        <input type="text" :id="formFieldData.id" v-model="formFieldData.value">
        <div class="formErrorDescription" v-if="formFieldData.error">{{formFieldData.error}}</div>
    </div>
</template>