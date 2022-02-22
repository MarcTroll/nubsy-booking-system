<script lang="ts" setup>
const props = defineProps<{
    court: any
}>();

function getCourtDescription(court) {
    if(typeof court.closed === "boolean" && court.closed) {
        return "gesperrt";
    }
    if(typeof court.reservation === "boolean" && court.reservation) {
        return "ausgebucht";
    }
}

const slotClassList = (court) => {
    let classList = {
        courtClosed: false,
        courtReservation: false
    };

    if(typeof court.closed === "boolean") {
        classList.courtClosed = court.closed;
    }

    if(typeof court.reservation === "boolean") {
        classList.courtReservation = court.reservation;
    }

    return classList;
}
</script>

<template>
    <div class="timeSlot"
    :class="slotClassList(court)">
        <span>{{getCourtDescription(court)}}</span>
    </div>
</template>

<style lang="scss">
.timeSlot {
    height: 100%;
    padding: 0 8px;

    &.courtClosed {
        margin-top: -3px;
        border-top: 3px solid #D40000;
        background: rgba(255, 0, 0, 0.1)
    }
    &.courtReservation {
        border-top: 3px solid #005a91;
        background: rgba(0, 90, 145, 0.1);
    }
}
</style>