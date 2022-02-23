<script setup lang="ts">
    import TimeTable from "~/components/TimeTable.vue";
    import DatePicker from "~/components/DatePicker.vue";

    const route = useRoute();
    const router = useRouter();

    useTitle("Kalender");
    useDescription("Description");

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
                date: `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
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
            <div class="calendarUserNavigation">
                <NuxtLink to="/login" class="button" v-if="!authentication.loggedIn">
                    Anmelden, um Plätze zu buchen!
                </NuxtLink>
                <span v-if="authentication.loggedIn">
                    <span class="userWelcome">Willkommen, <strong>{{authentication.user.name}}</strong></span>
                    <NuxtLink to="/my" class="button">
                        Konto
                    </NuxtLink>
                    <NuxtLink to="/my" class="button">
                        Administration
                    </NuxtLink>
                </span>
            </div>
            <div class="calendarDateNavigation">
                <DatePicker :unixTime="timetableOptions" />
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
        .calendarUserNavigation {
            .userWelcome {
                display: block;
                margin-bottom: 20px;
            }
        }
    }
    @media all and  (max-width: 1100px) {
        .calendarUserNavigation {
            margin-bottom: 20px;
            text-align: center;
        }
    }
    @media all and (min-width: 1101px) {
        display: grid;
        grid-template-columns: 350px auto;
        grid-column-gap: 20px;
        align-items: center;

        .calendarDateNavigation, .calendarUserNavigation {
            grid-row: 1;
        }

        .calendarDateNavigation {
            grid-column-start: 1;
            grid-column-end: 2;
        }
        .calendarUserNavigation {
            grid-column-start: 2;
            grid-column-end: 3;
            justify-self: end;
        }
    }
}

.calendar {
    width: 100%;

    .calendarTime {
        width: 70px;
    }
}
</style>