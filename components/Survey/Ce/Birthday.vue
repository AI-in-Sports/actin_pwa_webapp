<script setup lang="ts">

const survey = useCESurveyStore()

const birthday = computed({
  get() { return new Date(survey.survey1.birthday!) },
  set(value) {
    survey.set("survey1", "birthday", value)
  }
})
</script>

<template>
  <div class="flex flex-col w-full justify-center h-full">
    <DatePicker
        inline auto-submit simple
        input-format="jYYYY-jMM-jDD"
        format="YYYY/MM/DD"
        v-model="birthday"/>
  </div>
</template>

<style lang="sass" src="~/assets/sass/birthday.sass"></style>