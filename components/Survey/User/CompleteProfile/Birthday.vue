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
  <div class="flex flex-col justify-center items-center w-full">
    <p class="font-semibold text-[24px] text-black/90 mb-8 text-center">تاریخ تولد؟</p>

    <DatePicker
        inline auto-submit simple
        input-format="jYYYY-jMM-jDD"
        format="YYYY/MM/DD" v-model="birthday"/>
  </div>
</template>

<style lang="sass" src="@actin/pwa-layer/assets/style/birthday.sass"></style>