<script setup lang="ts">
definePageMeta({
  layout: "profile"
})

const isEditDisable = shallowRef(true)

</script>

<template>
  <div class="flex flex-col max-w-[400px] justify-between h-full pb-4">
    <div class="flex flex-col gap-y-8 px-4 mt-5">
      <PrimaryInput type="text" placeholder="نام" class="text-mainBlack text-base w-full" :disabled="isEditDisable"></PrimaryInput>

      <PrimaryInput type="text" placeholder="نام خانوادگی" class="text-mainBlack text-base w-full" :disabled="isEditDisable"></PrimaryInput>

      <PrimaryInput type="date" placeholder="تاریخ تولد" class="text-mainBlack text-base w-full" :disabled="isEditDisable"></PrimaryInput>

      <PrimarySelect placeholder="جنسیت" :disabled="isEditDisable">
        <option class="text-black/[0.87]">مرد</option>
        <option class="text-black/[0.87]">زن</option>
      </PrimarySelect>
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