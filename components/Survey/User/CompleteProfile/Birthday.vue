<script setup lang="ts">
const profile = useProfileStore()

const birthday = computed({
  get() { return new Date(profile.user_info.birthday!) },
  set(value) {
    profile.set("user_info", "birthday", value)
  }
})
</script>

<template>
  <div>
    <DatePicker
        inline auto-submit simple
        input-format="jYYYY-jMM-jDD"
        format="YYYY/MM/DD" v-model="birthday"/>
  </div>
</template>

<style lang="sass" src="~/assets/sass/birthday.sass"></style>