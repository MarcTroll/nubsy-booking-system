<script setup lang="ts">
    import TimeTable from "~/components/TimeTable.vue";
    import DatePicker from "~/components/DatePicker.vue";

    useMeta({
        title: "Buchungskalender"
    });

    const route = useRoute();
    const router = useRouter();

    let initDate = new Date();

    if(route.query.date) {
        const dateString = route.query.date.toString().replaceAll("-", "/");
        initDate = new Date(dateString + " UTC");

        if(initDate.toUTCString() === "Invalid Date") {
            initDate = new Date();
        }
    }

    initDate.setUTCHours(0, 0,0, 0);
    let dateTime = initDate.getTime() / 1000;

    const timetableOptions = reactive({time: dateTime});

    watch(timetableOptions, (value) => {
        const date = new Date(value.time * 1000);

        // Is this a good idea?
        router.replace({
            path: "/",
            query: {
                date: `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1) < 10 ? "0" : ""}${date.getUTCMonth() + 1}-${date.getUTCDate() < 10 ? "0" : ""}${date.getUTCDate()}`
            }
        })
    })

    const authentication = useAuth();

    function toggleAuthentication() {
        authentication.value.loggedIn = !authentication.value.loggedIn;
    }
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
            <div class="calendarUserNavigation" v-if="!authentication.loggedIn" @click="toggleAuthentication">
                Anmelden/registrieren
            </div>
            <div class="calendarUserNavigation" v-if="authentication.loggedIn" @click="toggleAuthentication">
                Willkommen {{authentication.username}}
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
        grid-template-columns: 360px auto;

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