<script setup lang="ts">
const emit = defineEmits(['validate'])

const height = surveyComputed("survey1", "height")

const isValid = () => emit('validate', !parseInt(height.value.toString()) || parseInt(height.value.toString()) < 140)

isValid()

watch(height, isValid)
</script>

<template>
  <SurveyUtilsNumberInput v-model:value="height" unit="سانتی متر" placeholder="قد"/>
</template>

<style scoped>

</style>