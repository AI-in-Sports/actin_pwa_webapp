<script setup lang="ts">

</script>

<template>
  <main class="bg-white h-[100dvh] flex flex-col items-center text-black relative" dir="rtl">
    <!-- Navigation part -->
    <nav class="flex px-[20px] py-[16px] shadow w-full">
      <div class="w-1/4">

      </div>
      <div class="w-1/2 font-bold text-[16px] text-center">
        جزئیات گزارش
      </div>

      <div class="w-1/4 flex items-center justify-end">
        <FaIcon :icon="['fas', 'arrow-left']" @click="$router.go(-1)"
                class="cursor-pointer text-[18px] mt-1"/>
      </div>
    </nav>

    <slot/>
  </main>
</template>
