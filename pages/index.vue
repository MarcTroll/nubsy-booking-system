<script setup lang="ts">
    import TimeTable from "~/components/TimeTable.vue";
    import DatePicker from "~/components/DatePicker.vue";

    useMeta({
        title: "Buchungskalender"
    });

    const initDate = new Date();
    initDate.setUTCHours(0, 0,0, 0);

    const dateTime = ref(initDate.getTime() / 1000);

    watch(dateTime, value => {
        console.log("index > value changed:", value)
    })

    const updateUnixTime = () => {
        console.log("index > fun updateUnixTime:", dateTime.value)
    }

    const date = reactive({time: initDate});
</script>

<template>
    <div>
        <div class="content">
            <h2>
                Buchungskalender
            </h2>
        </div>
        <div class="content calendarNavigation">
            <div class="calendarDateNavigation">
                <!--DatePickerO v-model:date="date" :supports-time="false" /-->
                <DatePicker :unixTime="dateTime" @update:unixTime="updateUnixTime()" />
            </div>
            <div class="calendarUserNavigation">
                Anmelden/registrieren
            </div>
        </div>
        <div class="content">
            <TimeTable v-bind:date="date" />
        </div>
    </div>
</template>

<style lang="scss">
.calendarNavigation {
    @media all and (max-width: 768px) {

    }
    @media all and (min-width: 769px) {
        display: grid;
        grid-template-columns: 300px auto;

        .calendarUserNavigation {
            justify-self: right;
        }
    }
}

.calendar {
    width: 100%;

    .calendarTime {
        width: 70px;
    }
}

.time-slot {
    background: #f5f5f5;

    &.disabled {
        background: none;
        cursor: not-allowed;
    }
}
</style>