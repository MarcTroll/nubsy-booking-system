<script lang="ts" setup>
    import NubsyPasswordFormField from "~/components/nubsy/form/field/NubsyPasswordFormField.vue";
    import NubsySelectFormField from "~/components/nubsy/form/field/NubsySelectFormField.vue";
    import NubsyEmailFormField from "~/components/nubsy/form/field/NubsyEmailFormField.vue";
    import NubsyNumberFormField from "~/components/nubsy/form/field/NubsyNumberFormField.vue";
    import NubsyTextFormField from "~/components/nubsy/form/field/NubsyTextFormField.vue";

    const props = defineProps<{
        formUrl: string,
        additionalClassList?: string
    }>();
    const emits = defineEmits([
        "form:submit"
    ]);

    const form = ref(await $fetch(props.formUrl, {
        method: "GET",
        headers: useRequestHeaders()
    }));

    async function submit() {
        try {
            const res = await $fetch(props.formUrl, {
                method: "POST",
                body: form.value
            });

            emits("form:submit", {
                status: "success"
            });
        } catch(err) {
            emits("form:submit", {
                status: "error",
                err: err
            });
        }
    }
</script>

<template>
    <form @submit.prevent="submit()">
        <div class="content formInputContainer">
            <div :class="additionalClassList">
                <div v-for="(formField, formFieldId) of form" :id="`${formFieldId}Container`">
                    <NubsyTextFormField v-if="formField.type === 'text'" :field="formField"></NubsyTextFormField>
                    <NubsyNumberFormField v-else-if="formField.type === 'number'" :field="formField"></NubsyNumberFormField>
                    <NubsyEmailFormField v-else-if="formField.type === 'email'" :field="formField"></NubsyEmailFormField>
                    <NubsyPasswordFormField v-else-if="formField.type === 'password'" :field="formField"></NubsyPasswordFormField>
                    <NubsySelectFormField v-else-if="formField.type === 'select'" :field="formField"></NubsySelectFormField>
                </div>
            </div>
        </div>
        <div class="content formSubmitContainer formSubmit">
            <input class="button primary" type="submit" value="Absenden">
        </div>
    </form>
</template>