<script lang="ts" setup>
    let _timer = null;

    interface DateObject {
        time: Date
    }

    const props = defineProps<{
        date: DateObject
    }>();
    let tableDate = reactive(props.date);
    let loading = ref(false);

    // Init timetable for today
    let timetable = await $fetch("/api/timetable/get", {
        headers: useRequestHeaders()
    });

    // Update timetable when changing the date
    watch(tableDate, (value) => {
        if(_timer !== null) {
            clearTimeout(_timer);
            _timer = null;
        }

        // TODO: set loading to true

        // Wait 500 milliseconds before request for date changes (e.g. when skipping through dates)
        _timer = setTimeout(async () => {
            timetable = await $fetch("/api/timetable/get", {
                params: {
                    unixTime: value.time.getTime() / 1000
                }});

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

    function rerender() {
        console.log("rerender");
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
                <tr v-for="(slot, slotIndex) in timetable.timetableGrid" :key="slot.timeID">
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
</style>