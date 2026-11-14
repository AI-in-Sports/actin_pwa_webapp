<script setup lang="ts">
// Signed-in screens: a header with the screen title and a bottom tab bar.
const route = useRoute()
const tabs = [
  { to: '/results', icon: 'monitoring', label: 'نتایج من' },
  { to: '/claim', icon: 'qr_code_scanner', label: 'دریافت نتیجه' },
  { to: '/sharing', icon: 'shield_person', label: 'اشتراک‌گذاری' },
]
const showTabs = computed(() => route.meta.tabs !== false)
</script>

<template>
  <div class="min-h-[100dvh] bg-canvas text-fg font-sans flex flex-col">
    <header class="pt-safe sticky top-0 z-10 bg-canvas/95 backdrop-blur border-b border-border">
      <div class="h-14 px-4 flex items-center gap-2">
        <button
          v-if="route.meta.back" type="button" aria-label="بازگشت"
          class="p-2 -mr-2 text-fg-muted" @click="$router.back()">
          <MaterialSymbols theme="rounded">arrow_forward</MaterialSymbols>
        </button>
        <h1 class="text-title-sm font-semibold truncate">{{ route.meta.title ?? 'اکتین' }}</h1>
      </div>
    </header>

    <main class="flex-1 px-4 py-4 flex flex-col gap-stack" :class="showTabs && 'pb-24'">
      <slot/>
    </main>

    <nav v-if="showTabs" class="pb-safe fixed bottom-0 inset-x-0 bg-surface border-t border-border">
      <ul class="grid grid-cols-3">
        <li v-for="t in tabs" :key="t.to">
          <NuxtLink
            :to="t.to"
            class="h-16 flex flex-col items-center justify-center gap-1 text-caption"
            :class="route.path.startsWith(t.to) ? 'text-accent font-semibold' : 'text-fg-subtle'">
            <MaterialSymbols theme="rounded" class="text-[24px]">{{ t.icon }}</MaterialSymbols>
            {{ t.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
