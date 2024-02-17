<script setup lang="ts">
definePageMeta({
  layout: "profile"
})
</script>

<template>
  <div class="flex flex-col max-w-[400px]">
    <div class="flex flex-col gap-y-8 w-full px-4 mt-5">
      <PrimaryInput type="text" placeholder="نام" class="text-mainBlack text-base"></PrimaryInput>

      <PrimaryInput type="text" placeholder="نام خانوادگی" class="text-mainBlack text-base"></PrimaryInput>

      <PrimaryInput type="" placeholder="تاریخ تولد" class="text-mainBlack text-base">

      </PrimaryInput>

      <PrimarySelect placeholder="جنسیت" class="text-mainSubDead">
        <option class="text-black/[0.87]">مرد</option>
        <option class="text-black/[0.87]">زن</option>
      </PrimarySelect>
    </div>

    <div class="px-4 mt-[245px] sm:mt-[370px]">
      <PrimaryBorderButton class="flex flex-row justify-center items-center gap-x-2 py-4 cursor-pointer">
        <MaterialSymbols theme="rounded" class="text-mainSubDead text-base">edit</MaterialSymbols>

        <p class="text-base text-mainBlack font-medium">
          ویرایش
        </p>
      </PrimaryBorderButton>
    </div>
  </div>
</template>

<style scoped>

</style>