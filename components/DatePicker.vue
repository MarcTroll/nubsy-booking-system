<template>
    <div v-clickaway="disablePicker" class="datePicker">
        <div class="selectedDate controlCenter">
            <div class="arrows prev-day" @click="prevDay">&lt;</div>
            <div class="currentSelection" @click="togglePicker">
                {{ dayName.name }}, {{ selectedDay }}. {{ months[selectedMonth] }} {{ selectedYear }}

                <span v-if="supportsTime">
                    , {{time}} Uhr
                </span>
            </div>
            <div class="arrows next-day" @click="nextDay">&gt;</div>
        </div>
        <div v-show="showPicker === true" class="dates">
            <div class="controlCenter month">
                <div class="arrows prev-month" @click="prevMonth">&lt;</div>
                <div class="currentSelection">
                    {{ monthName }}
                </div>
                <div class="arrows next-month" @click="nextMonth">&gt;</div>
            </div>
            <div class="days">
                <div v-for="i in days" class="day dayName">
                    {{ i.short }}
                </div>
                <div v-for="x in dayPadding" class="day dayPadding">

                </div>
                <div v-for="i in monthDays"
                     :class="{selected: isSelectedDate(i)}"
                     class="day"
                     @click="selectDay(i)">
                    {{ i }}
                </div>
            </div>
            <div class="time" v-if="supportsTime">
                Uhrzeit:
                <input type="time" v-model="time">
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, ref, Ref} from "@vue/reactivity";

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const days = [{
    name: "Montag",
    short: "Mo"
}, {
    name: "Dienstag",
    short: "Di"
}, {
    name: "Mittwoch",
    short: "Mi"
}, {
    name: "Donnerstag",
    short: "Do"
}, {
    name: "Freitag",
    short: "Fr"
}, {
    name: "Samstag",
    short: "Sa"
}, {
    name: "Sonntag",
    short: "So"
}];

interface DateObject {
    time: Date
}

const props = defineProps<{
    date: DateObject,
    supportsTime?: boolean
}>();

const emits = defineEmits([
    "update:date"
])

let showPicker: Ref<boolean> = ref(false);

let date = reactive(props.date);
date.time.setHours(12, 0, 0, 0);

let day: Ref<number> = ref(date.time.getDate());
let month: Ref<number> = ref(date.time.getMonth());
let year: Ref<number> = ref(date.time.getFullYear());

let time: Ref<string> = ref("12:00");

let selectedDay: Ref<number> = ref(day.value);
let selectedMonth: Ref<number> = ref(month.value);
let selectedYear: Ref<number> = ref(year.value);

const togglePicker = (): void => {
    showPicker.value = !showPicker.value;

    if (!showPicker.value) {
        day.value = selectedDay.value;
        month.value = selectedMonth.value;
        year.value = selectedYear.value;
    }
}

const disablePicker = (): void => {
    showPicker.value = false;

    if (!showPicker.value) {
        day.value = selectedDay.value;
        month.value = selectedMonth.value;
        year.value = selectedYear.value;
    }
}

watch(time, (value) => {
    let houmin : string[] = value.split(":");

    date.time.setHours(parseInt(houmin[0]), parseInt(houmin[1]));

    emits("update:date", date);
});

const monthDays = computed(() => {
    if (month.value === 1) {
        if(year.value % 4 === 0) {
            if(year.value % 100 === 0) {
                if(year.value % 400 === 0) {
                    return 29;
                }
            } else {
                return 29;
            }
        }
        return 28;
    } else if (month.value <= 6 && month.value % 2 === 0) {
        return 31;
    } else if (month.value > 6 && month.value % 2 === 1) {
        return 31;
    } else {
        return 30;
    }
});

const dayPadding = computed(() => {
    let tempDate = new Date(`${year.value}-${month.value + 1}-01`);
    return (tempDate.getDay() + 6) % 7;
});

const dayName = computed(() => {
    let tempDate = new Date(`${selectedYear.value}-${selectedMonth.value + 1}-${selectedDay.value}`);
    return days[(tempDate.getDay() + 6) % 7];
});

const monthName = computed(() => {
    return `${months[month.value]} ${year.value}`;
});

const nextDay = (): void => {
    if (day.value === monthDays.value) {
        nextMonth();
        selectDay(1);
    } else {
        selectDay(day.value + 1);
    }
}

const prevDay = (): void => {
    if (day.value === 1) {
        prevMonth();
        selectDay(monthDays.value);
    } else {
        selectDay(day.value - 1);
    }
}

const nextMonth = (): void => {
    if (month.value == 11) {
        month.value = 0;
        year.value++;
    } else {
        month.value++;
    }
}

const prevMonth = (): void => {
    if (month.value == 0) {
        month.value = 11;
        year.value--;
    } else {
        month.value--;
    }
}

const selectDay = (newDay: number): void => {
    selectedDay.value = newDay;
    day.value = newDay;
    selectedMonth.value = month.value;
    selectedYear.value = year.value;

    if(props.supportsTime) {
        date.time = new Date(selectedYear.value, selectedMonth.value, selectedDay.value, date.time.getHours(), date.time.getMinutes(), 0, 0);
    } else {
        date.time = new Date(selectedYear.value, selectedMonth.value, selectedDay.value, 0, 0, 0, 0);
    }

    emits("update:date", date);

    disablePicker();
}

const isSelectedDate = (i: number): boolean => {
    return selectedYear.value === year.value
        && selectedMonth.value === month.value
        && selectedDay.value === i;
}
</script>

<style lang="scss">
.datePicker {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: 1px 1px 4px rgba(204, 209, 221, 0.5);

    .controlCenter {
        display: flex;
        justify-content: space-between;
        align-items: center;

        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        user-select: none;

        > .currentSelection {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                background-color: #ccd1dd;
            }
        }

        > .arrows {
            @media screen and (max-width: 768px) {
                width: 55px;
            }
            @media screen and (min-width: 769px) {
                width: 45px;
            }
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #313131;
            background-color: #f5f5f5;
            font-size: 20px;

            &:hover {
                background-color: #ccd1dd;
            }
        }
    }

    > .selectedDate {
        width: 100%;
        height: 100%;
    }

    > .dates {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #ffffff;
        box-shadow: 1px 1px 4px rgba(204, 209, 221, 0.8);
        border: 1px solid #ccd1dd;

        > .days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);

            > .day {
                display: flex;
                justify-content: center;
                align-items: center;
                color: #313131;
                cursor: pointer;
                user-select: none;
                height: 35px;

                &:hover {
                    background-color: #ccd1dd;
                }

                &.dayPadding {
                    background-color: #ffffff;
                    cursor: auto;
                }

                &.dayName {
                    background-color: #f5f5f5;
                    cursor: auto;
                    user-select: auto;
                }

                &.selected {
                    color: #fff;
                    background-color: #0c81de;
                }
            }
        }

        .time {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            border-top: 1px solid #ccd1dd;

            input[type=time] {
                border: none;
                border-bottom: 1px solid #262e3e;
                outline: none;
                font-family: "Roboto", sans-serif;
                margin-left: 10px;
            }
        }
    }
}
</style>