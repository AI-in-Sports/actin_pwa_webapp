<script setup lang="ts">
const emit = defineEmits(['validate'])

const weight = surveyComputed("survey1", "weight")

const isValid = () => emit('validate', !parseInt(weight.value.toString()) || parseInt(weight.value.toString()) < 15)

isValid()

watch(weight, isValid)
</script>

<template>
  <SurveyUtilsNumberInput v-model:value="weight" unit="کیلوگرم" class="mt-[40px]" placeholder="وزن"/>
</template>

<style scoped>

</style>