<script setup lang="ts">
defineProps<{
  isOpen: boolean
  closable?: boolean
}>()
</script>

<template>
  <section class="z-[-9999999] opacity-0 h-100dvh bg-primary-black/50 backdrop-blur-[3px] fixed inset-0"
           :class="{ '!z-[9999999999] !opacity-100': isOpen }">
    <div class="fixed flex bottom-[-100%] flex-col gap-4 rounded-[20px_20px_0_0] w-full max-h-[100%] h-fit bg-white p-6" :class="{ '!animation-slide-up': isOpen }">
      hi
    </div>
  </section>
</template>

<style scoped>

</style>