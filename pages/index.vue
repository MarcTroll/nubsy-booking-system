<script setup lang="ts">
    import TimeTable from "~/components/TimeTable.vue";
    import DatePicker from "~/components/DatePicker.vue";

    useMeta({
        title: "Buchungskalender"
    });

    const initDate = new Date();
    initDate.setUTCHours(0, 0,0, 0);
    let dateTime = initDate.getTime() / 1000;

    const timetableOptions = reactive({time: dateTime});
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
                <DatePicker :unixTime="timetableOptions" />
            </div>
            <div class="calendarUserNavigation">
                Anmelden/registrieren
            </div>
        </div>
        <div class="content">
            <TimeTable :dateTime="timetableOptions" />
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