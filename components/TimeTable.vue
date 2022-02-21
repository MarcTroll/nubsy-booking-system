<script lang="ts" setup>
    let _timer = null;

    interface DateTimeObject {
        time: number
    }

    const props = defineProps<{
        dateTime: DateTimeObject
    }>();
    let dateTime = reactive(props.dateTime);
    let loading = ref(false);
    let timetableRepresentation = reactive({grid: {}});

    // Init timetable for today
    let timetable = await $fetch("/api/timetable/get", {
        headers: useRequestHeaders(),
        params: {
            unixTime: dateTime.time
        }
    });
    timetableRepresentation.grid = timetable.timetableGrid

    // Update timetable when changing the date
    watch(dateTime, () => {
        if(_timer !== null) {
            clearTimeout(_timer);
            _timer = null;
        }

        // TODO: set loading to true

        // Wait 500 milliseconds before request for date changes (e.g. when skipping through dates)
        _timer = setTimeout(async () => {
            timetable = await $fetch("/api/timetable/get", {
                params: {
                    unixTime: dateTime.time
                }});
            timetableRepresentation.grid = timetable.timetableGrid

            _timer = null;
        }, 500);
    });

    function getTime(slotTime: number) {
        let date = new Date(slotTime * 1000)
        return `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
    }

    const slotClassList = (court) => {
        let classList = {
            courtClosed: false,
            hideCourtSlot: false,
            courtReservation: false
        };

        if(typeof court.closed === "boolean") {
            classList.courtClosed = court.closed;
        }

        if(typeof court.display === "boolean") {
            classList.hideCourtSlot = !court.display;
        }

        if(typeof court.reservation === "boolean") {
            classList.courtReservation = court.reservation;
        }

        return classList;
    }

    function getRowspan(court) {
        return court.rowspan || 1;
    }

    function getCourtDescription(court) {
        if(typeof court.closed === "boolean" && court.closed) {
            return "gesperrt";
        }
        if(typeof court.reservation === "boolean" && court.reservation) {
            return "ausgebucht";
        }
    }
</script>

<template>
    <div>
        <table class="calendar" v-if="!loading">
            <thead>
                <tr>
                    <td class="calendarTime">Zeit</td>
                    <td v-for="court of timetable.courts">Platz {{court.courtName}}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(slot, slotIndex) in timetableRepresentation.grid" :key="slot.timeID">
                    <td class="calendarTime">
                        {{getTime(slotIndex)}}
                    </td>
                    <td v-for="court in slot.courts"
                        :data-court-id="1"
                        :data-time="slotIndex"
                        :rowspan="getRowspan(court)"
                        :class="slotClassList(court)"
                        class="time-slot">
                        {{getCourtDescription(court)}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
.calendar {
    table-layout: fixed;
}

.calendar .courtClosed {
    background: rgba(255, 0, 0, 0.2);
}

.calendar .courtReservation {
    background: rgba(0, 128, 0, 0.2);
}

.calendar .hideCourtSlot {
    display: none;
}

.calendar tbody > tr:nth-child(2n) > .calendarTime {
    color: #b1b1b1;
}
</style>