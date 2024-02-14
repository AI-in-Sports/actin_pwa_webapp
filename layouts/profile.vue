<script setup lang="ts">

</script>

<template>
  <main class="flex flex-col justify-center max-w-[400px] mx-auto w-full">
    <header class="flex flex-row justify-between items-center py-3.5 pl-16 pr-4 cursor-pointer">
      <div></div>

      <h1 class="text-[21px] text-mainBlack font-semibold">
        پروفایل
      </h1>

      <MaterialSymbols theme="rounded" class="text-mainSubDead text-4xl cursor-pointer hover:scale-90">
        arrow_forward
      </MaterialSymbols>
    </header>

    <slot/>
  </main>
</template>

<style scoped>

</style>