<script setup lang="ts">
definePageMeta({
  layout: "profile"
})

const isEditDisable = shallowRef(true)

const weekDays = shallowRef([
  "شنبه", "دوشنبه","چهارشنبه"
])
</script>

<template>
  <div class="flex flex-col max-w-[400px] justify-between h-full pb-4">
    <div class="flex flex-col gap-y-8 px-4 mt-5">
      <PrimarySelect placeholder="محل تمرین" :disabled="isEditDisable">
        <option class="text-black/[0.87]">خانه</option>
        <option class="text-black/[0.87]">محل کار</option>
        <option class="text-black/[0.87]">باشگاه</option>
        <option class="text-black/[0.87]">باشگاه خانگی</option>
      </PrimarySelect>

      <PrimarySelect placeholder="روزهای تمرین" :disabled="isEditDisable">
        <option class="text-black/[0.87]">شنبه</option>
        <option class="text-black/[0.87]">یکشنبه</option>
        <option class="text-black/[0.87]">دوشنبه</option>
        <option class="text-black/[0.87]">سه شنبه</option>
        <option class="text-black/[0.87]">چهارشنبه</option>
        <option class="text-black/[0.87]">پنج شنبه</option>
        <option class="text-black/[0.87]">جمعه</option>
      </PrimarySelect>

      <div class="flex flex-wrap gap-2">
        <ThemeChip v-for="day in weekDays" :key="day" :name="day" :disabled="isEditDisable"/>
      </div>
    </div>

    <div class="px-4">
      <PrimaryBorderButton
          class="flex flex-row justify-center items-center gap-x-2 py-4 cursor-pointer"
          v-if="isEditDisable" @click="isEditDisable = !isEditDisable">
        <MaterialSymbols theme="rounded" class="text-mainSubDead text-base">edit</MaterialSymbols>

        <p class="text-base text-mainBlack font-medium">
          ویرایش
        </p>
      </PrimaryBorderButton>

      <PrimaryButton
          class="px-4 py-4 cursor-pointer text-base text-mainBlack font-medium"
          v-else @click="isEditDisable = !isEditDisable">
        ذخیره تغییرات
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>

</style>