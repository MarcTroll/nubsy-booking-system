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
            hideCourtSlot: false,
            timeTableCell: false
        };

        if(typeof court.display === "boolean") {
            classList.hideCourtSlot = !court.display;
        }
        if(typeof court.bookable === "boolean") {
            classList.timeTableCell = court.bookable;
        }

        return classList;
    }

    function getRowspan(court) {
        return court.rowspan || 1;
    }

    let bookingData = ref({
        courtId: 0,
        timeSlotStart: 0
    })

    function startBookingProcess(court, timeSlot) {
        if(typeof court.bookable === "boolean" && court.bookable) {
            bookingData.value.courtId = court.courtID;
            bookingData.value.timeSlotStart = timeSlot;
        } else {
            // TODO: Display error/handle request when user has administrative permissions or so
        }
    }

    function cancelBookingProcess() {
        bookingData.value.courtId = 0;
        bookingData.value.timeSlotStart = 0;
    }

    function getCourtDetails(courtId) {
        return timetable.courts.find(court => court.courtID === courtId);
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
                        :data-court-id="court.courtID"
                        :data-time="slotIndex"
                        :rowspan="getRowspan(court)"
                        :class="slotClassList(court)"
                        @click="startBookingProcess(court, slot.timeID)">
                        <TimeSlot :court="court" />
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="dialog-container" v-if="bookingData.courtId !== 0">
            <div class="dialog small">
                <div class="dialog-header">
                    <div class="dialog-title">
                        Platz buchen
                    </div>
                    <div class="close-dialog" @click="cancelBookingProcess()">
                        <i class="fa fa-times fa-sm"></i>
                    </div>
                </div>
                <div class="dialog-body">
                    Platz {{getCourtDetails(bookingData.courtId).courtName}} buchen um {{getTime(bookingData.timeSlotStart)}} Uhr
                </div>
            </div>
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
            &.timeTableCell {
                &:hover {
                    background-color: #eeeeee;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>