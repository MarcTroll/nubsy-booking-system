<script lang="ts" setup>
    import {ref, Ref} from "@vue/reactivity";

    let _timer = null;

    interface DateObject {
        time: Date
    }

    const props = defineProps<{
        date: DateObject
    }>();
    let tableDate = reactive(props.date);

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
            console.log("request")
            timetable = await $fetch("/api/timetable/get", {
                params: {
                    unixDay: value.time.getTime() / 1000
                }});
            _timer = null;
        }, 500);
    });
</script>

<template>
    <div>
        <table class="calendar">
            <!--thead>
                <tr>
                    <td class="calendarTime">Zeit</td>
                    <td v-for="court of timetable.courts">Platz {{court.courtName}}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="slot in getTimeSlots()">
                    <td class="calendarTime">
                        {{getTime(getBaseTime() + slot)}}
                    </td>
                    <td v-for="court in timetable.courts"
                        :data-court-id="court.courtID"
                        :data-time="getBaseTime() + slot"
                        :class="slotClassList(court, slot)"
                        class="time-slot">
                        <Timeslot :data-court-id="court.courtID"
                                  :data-time="getBaseTime() + slot" />
                    </td>
                </tr>
            </tbody-->
        </table>
    </div>
</template>