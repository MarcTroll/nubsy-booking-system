<script setup lang="ts">
import {Ref} from "@vue/reactivity";

useMeta({
    title: "Buchungskalender"
})

const settings = {
    start: 8,
    end: 21,
    slotLength: 30,
    courts: ["Platz 2", "Platz 3", "Platz 4", "Platz 5"]
}

function getBaseTime(date : Date = new Date()) {
    let now = new Date();
    return ((new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime())/1000;
}

function getTime(datetime : number) {
    let date = new Date(datetime * 1000);
    return `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
}

function getTimeSlots() {
    let slots = [];
    // Unix Timestamp of day start
    const startTime = settings.start * 60 * 60;

    for(let i = startTime; i < (settings.end * 60 * 60); i+= settings.slotLength * 60) {
        slots.push(i);
    }
    return slots;
}

const date : Ref<Date> = ref(new Date());
</script>

<template>
    <div>
        <div class="content">
            <h2>
                Buchungskalender
            </h2>
        </div>
        <div class="content">
            <div class="calendarNavBar">
                <DatePicker v-model:date="date" supports-time />
            </div>
        </div>
        <div class="content">
            <table class="calendar">
                <thead>
                <tr>
                    <td>Zeit</td>
                    <td v-for="court in settings.courts">{{court}}</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="slot in getTimeSlots()">
                    <td>
                        {{getTime(getBaseTime() + slot)}}
                    </td>
                    <td v-for="court in settings.courts" :data-court-id="court" :data-time="getBaseTime() + slot" class="time-slot">-</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss">
.time-slot {
    background: #f5f5f5;
}
</style>