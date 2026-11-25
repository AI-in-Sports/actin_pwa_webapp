<script setup lang="ts">
/**
 * Branded launch screen, shown once per browser session (opening the PWA from the home
 * screen or from the mirror QR), then it fades out on its own.
 */
const KEY = "actin_splash_seen"
const visible = shallowRef(false)

onMounted(() => {
  let seen = false
  try { seen = sessionStorage.getItem(KEY) === "1" } catch { /* private mode */ }
  if (seen) return

  visible.value = true
  try { sessionStorage.setItem(KEY, "1") } catch { /* private mode */ }
  setTimeout(() => { visible.value = false }, 1400)
})
</script>

<template>
  <Transition leave-active-class="transition-opacity duration-500" leave-to-class="opacity-0">
    <div v-if="visible" class="fixed inset-0 z-[1000] bg-mainBlack flex flex-col items-center justify-center" dir="rtl"
         role="status" aria-label="اکتین">
      <div class="flex-1"></div>
      <p class="text-mainYellow text-[44px] font-extrabold tracking-[0.2em]" dir="ltr">ACTIN</p>
      <p class="text-white/85 text-[16px] mt-[10px]">سلامت بدن، با یک اسکن</p>
      <div class="flex-1"></div>
      <p class="text-white/40 text-[12px] pb-[32px]" dir="ltr">Actin Health</p>
    </div>
  </Transition>
</template>
