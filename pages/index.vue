<script setup lang="ts">
import {Ref} from "@vue/reactivity";
import DatePicker from "~/components/DatePicker.vue";
import TimeTable from "~/components/TimeTable.vue";

useMeta({
    title: "Buchungskalender"
});

const settings = {
    slotLength: 30
}

function getBaseTime(date : Date = new Date()) {
    let now = new Date();
    return ((new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime())/1000;
}

function getTime(datetime : number) {
    let date = new Date(datetime * 1000);
    return `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
}

let timetable;

const date = reactive({time: new Date()});
watch(date, value => {
    console.log("a", value)
});

function getTimeSlots() {
    let minStartTime = 86400;
    let maxEndTime = 0;
    for(let court of timetable.courts) {
        if(court.openTime < minStartTime) {
            minStartTime = court.openTime;
        }
        if(court.closeTime > maxEndTime) {
            maxEndTime = court.closeTime;
        }
    }

    let slots = [];
    for(let i = minStartTime; i < (maxEndTime); i+= settings.slotLength * 60) {
        slots.push(i);
    }

    return slots;
}

const slotClassList = (court, slot) => {
    let classList = {
        disabled: false
    };

    if(court.openTime > slot) {
        classList.disabled = true;
    }

    if(court.closeTime <= slot) {
        classList.disabled = true;
    }

    return classList;
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
                <DatePicker v-model:date="date" :supports-time="false" />
            </div>
            <div class="calendarUserNavigation">
                Anmelden/registrieren
            </div>
        </div>
        <TimeTable v-bind:date="date" />
        <div class="content">
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