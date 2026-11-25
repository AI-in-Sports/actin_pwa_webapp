<script setup lang="ts">
/** Short status list: done steps in grey with a green check, the current one in bold. */
defineProps<{
  steps: { text: string, done: boolean }[]
}>()
</script>

<template>
  <ol class="w-full rounded-[16px] bg-surface-2 px-[16px] py-[14px] flex flex-col gap-[10px]" dir="rtl">
    <li v-for="step in steps" :key="step.text" class="flex items-center gap-[10px]">
      <MaterialSymbols v-if="step.done" theme="rounded" :filled="true" class="text-mainGreen text-[22px]">check_circle</MaterialSymbols>
      <MaterialSymbols v-else theme="rounded" class="text-mainSubDead text-[22px] animate-pulse">pending</MaterialSymbols>
      <p class="text-[14px]" :class="step.done ? 'text-mainSubDead' : 'text-mainBlack font-semibold'">{{ step.text }}</p>
    </li>
  </ol>
</template>
