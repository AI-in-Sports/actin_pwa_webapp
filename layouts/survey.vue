<script setup lang="ts">
</script>

<template>
  <main class="flex flex-col w-full h-[100dvh] px-[16px] pt-[20px] pb-[18px] items-center" dir="rtl">
   <div class="w-full max-w-[400px] h-full flex flex-col">
     <MaterialSymbols
         @click="$router.replace('/ce')" theme="rounded"
         class="text-[#666666]  cursor-pointer">
       close
     </MaterialSymbols>

     <h1 class="mt-[20px] font-bold text-[24px]">
       {{ $route.meta.name }}
     </h1>

     <slot/>
   </div>
  </main>
</template>

<style scoped>

</style>