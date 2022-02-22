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
        loading.value = true;

        // Wait 500 milliseconds before request for date changes (e.g. when skipping through dates)
        _timer = setTimeout(async () => {
            timetable = await $fetch("/api/timetable/get", {
                params: {
                    unixTime: dateTime.time
                }});
            timetableRepresentation.grid = timetable.timetableGrid;
            loading.value = false;

            _timer = null;
        }, 750);
    });

    function getTime(slotTime: number) {
        let date = new Date(slotTime * 1000)
        return `${date.getUTCHours() < 10 ? "0" : ""}${date.getUTCHours()}:${date.getUTCMinutes() < 10 ? "0" : ""}${date.getUTCMinutes()}`
    }

    const slotClassList = (court) => {
        let classList = {
            hideCourtSlot: false
        };

        if(typeof court.display === "boolean") {
            classList.hideCourtSlot = !court.display;
        }

        return classList;
    }

    function getRowspan(court) {
        return court.rowspan || 1;
    }
</script>

<template>
    <div>
        <div class="loaderContainer">
            <div class="loaderOverlay" v-if="loading">
                <div class="loader"></div>
            </div>

            <table class="calendar">
                <thead>
                <tr>
                    <td class="calendarTime">
                        <span>
                            Zeit
                        </span>
                    </td>
                    <td v-for="court of timetable.courts">
                        <span>
                            Platz {{court.courtName}}
                        </span>
                    </td>
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
                        :class="slotClassList(court)">
                        <TimeSlot :court="court" />
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss">
.calendar {
    table-layout: fixed;
}

.calendar .hideCourtSlot {
    display: none;
}

.calendar tbody {
    > tr:nth-child(2n) > .calendarTime {
        color: #b1b1b1;
    }

    tr {
        td {
            padding: 5px;
            height: 1px;
        }
    }
}
</style>