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

    console.log("load")
    // Update timetable when changing the date
    watch(tableDate, (value) => {
        // Wait 500 milliseconds before request for date changes (e.g. when skipping through dates)
        console.log("change")
        window.clearTimeout(_timer);
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
        Timetable for {{tableDate.time}}
    </div>
</template>