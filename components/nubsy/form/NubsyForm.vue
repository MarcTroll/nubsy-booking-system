<script lang="ts" setup>
    import NubsyPasswordFormField from "~/components/nubsy/form/field/NubsyPasswordFormField.vue";
    import NubsySelectFormField from "~/components/nubsy/form/field/NubsySelectFormField.vue";
    import NubsyEmailFormField from "~/components/nubsy/form/field/NubsyEmailFormField.vue";
    import NubsyNumberFormField from "~/components/nubsy/form/field/NubsyNumberFormField.vue";
    import NubsyTextFormField from "~/components/nubsy/form/field/NubsyTextFormField.vue";

    interface FormSubmitResponse {
        status: string;
        code?: string; // set if status === "error"
        formErrors?: Object // set if code === "ERR_FORM_INVALID"
    }

    const props = defineProps<{
        formUrl: string,
        additionalClassList?: string,
        additionalFormErrors?: typeof Object
    }>();
    const emits = defineEmits([
        "form:submit"
    ]);
    const formErrorList = {
        "ERR_FORM_INVALID": "Deine Eingaben stimmen nicht. Bitte überprüfe deine Eingaben und sende das Formular danach erneut ab.",
        ...props.additionalFormErrors
    }

    const form = ref(await $fetch(props.formUrl, {
        method: "GET",
        headers: useRequestHeaders()
    }));
    const formError = ref("");
    const formSuccess = ref(false);
    let _timer = null;

    function resetFormErrors() {
        formError.value = "";
        Object.keys(form.value).forEach(key => {
            form.value[key].error = "";
        });
    }

    // TODO: Change that when @nuxt-community/i18n is available for nuxt 3
    function translateError(error) {
        if(Object.keys(formErrorList).includes(error)) {
            return formErrorList[error];
        }

        return "Ein unbekannter Fehler ist aufgetreten.";
    }

    async function submit() {
        try {
            let fieldInputs = new Map<string, string>();
            Object.values(form.value).forEach(formField => {
                // TODO: pre-validate
                fieldInputs.set(formField.id, formField.value);
            });

            if(_timer !== null) {
                clearTimeout(_timer);
                _timer = null;
                formSuccess.value = false;
            }

            const res = <FormSubmitResponse>await $fetch(props.formUrl, {
                method: "POST",
                body: Object.fromEntries(fieldInputs)
            });

            if(res.status === "success") {
                resetFormErrors();

                formSuccess.value = true;

                _timer = setTimeout(() => {
                    formSuccess.value = false;

                    _timer = null;
                }, 5000);

                emits("form:submit", {
                    status: "success"
                });
            } else if(res.status === "error") {
                resetFormErrors();

                formError.value = res.code;

                if(res.code === "ERR_FORM_INVALID") {
                    Object.keys(res.formErrors).forEach(key => {
                        form.value[key].error = res.formErrors[key];
                    });
                }

                emits("form:submit", {
                    status: "error"
                });
            }
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
        <div class="content" v-if="formError">
            <div class="message error">
                {{ translateError(formError) }}
            </div>
        </div>
        <div class="content" v-if="formSuccess">
            <div class="message success">
                Deine Eingaben wurden erfolgreich gespeichert!
            </div>
        </div>
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
            <slot name="formExtraButtons"></slot>
        </div>
        <div class="content">
            <div class="message">
                Mit <span class="formInputRequired">*</span> markierte Felder sind Pflichtfelder und müssen daher ausgefüllt werden.
            </div>
        </div>
    </form>
</template>