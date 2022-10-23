<template>
    <div v-if="alert" class="alert alert-success">
        {{ alert }}
    </div>
</template>

<script setup>
defineProps({ alert: String });

</script>

<style scoped>

</style>
