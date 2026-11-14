<script setup lang="ts">
// Home: the newest result of each test, then every result, newest first.
definePageMeta({ middleware: 'signed-in', title: 'نتایج من' })

const api = useApi()
const filter = ref<MirrorTest | 'all'>('all')
const { data: list, pending, error, refresh } = useAsyncData('my-results', () => api<Measurement[]>('/care/v1/me/measurements'), { default: () => [] })

const latest = computed(() => latestByTest(list.value))
const shown = computed(() => (filter.value === 'all' ? list.value : list.value.filter((m) => m.type === filter.value)))
const weightTrend = computed(() => latest.value.body_composition ? trend(list.value, latest.value.body_composition, 'weight_kg') : null)
</script>

<template>
  <p v-if="error" role="alert" class="rounded-card bg-danger/[0.08] text-danger p-4 text-body-sm">
    {{ error.message }}
    <button type="button" class="underline mr-2" @click="refresh()">تلاش دوباره</button>
  </p>

  <div v-if="pending && !list.length" class="flex flex-col gap-3" aria-busy="true">
    <div v-for="i in 3" :key="i" class="h-24 rounded-card bg-surface-2 animate-pulse"/>
  </div>

  <DsCard v-else-if="!list.length" class="flex flex-col items-center text-center gap-3 py-10">
    <MaterialSymbols theme="rounded" class="text-[48px] text-fg-subtle">qr_code_scanner</MaterialSymbols>
    <p class="text-title-sm font-semibold">هنوز نتیجه‌ای ندارید</p>
    <p class="text-body-sm text-fg-muted">بعد از تست با آینه‌ی اکتین، کد روی صفحه را اسکن کنید تا نتیجه در حساب شما ثبت شود.</p>
    <DsButton variant="accent" @click="navigateTo('/claim')">دریافت نتیجه</DsButton>
  </DsCard>

  <template v-else>
    <section class="grid grid-cols-1 gap-3" aria-label="آخرین نتایج">
      <NuxtLink
        v-for="t in TESTS.filter((x) => latest[x])" :key="t" :to="`/results/${latest[t]!.id}`"
        class="rounded-card bg-surface shadow-card p-card flex items-center gap-4">
        <span class="size-12 rounded-full bg-accent/10 text-accent grid place-items-center shrink-0">
          <MaterialSymbols theme="rounded" filled>{{ TEST_ICON[t] }}</MaterialSymbols>
        </span>
        <span class="flex-1 min-w-0 flex flex-col gap-1">
          <span class="text-body-sm text-fg-muted">{{ TEST_LABEL[t] }}</span>
          <span class="text-title-sm font-semibold">{{ headline(latest[t]!) }}</span>
          <span v-if="t === 'body_composition' && weightTrend" class="text-caption" :class="weightTrend < 0 ? 'text-success' : 'text-warning'">
            {{ weightTrend > 0 ? '+' : '−' }}{{ faDigits(Math.abs(weightTrend)) }} کیلوگرم نسبت به تست قبل
          </span>
        </span>
        <span class="text-caption text-fg-subtle">{{ faDate(latest[t]!.measured_at) }}</span>
      </NuxtLink>
    </section>

    <section class="flex flex-col gap-3">
      <div class="flex gap-2 overflow-x-auto -mx-4 px-4" role="tablist">
        <button
          v-for="f in (['all', ...TESTS] as const)" :key="f" type="button" role="tab" :aria-selected="filter === f"
          class="rounded-chip px-4 h-9 text-body-sm whitespace-nowrap border"
          :class="filter === f ? 'bg-primary text-on-primary border-primary' : 'border-border text-fg-muted'"
          @click="filter = f">
          {{ f === 'all' ? 'همه' : TEST_LABEL[f] }}
        </button>
      </div>
      <ul class="flex flex-col divide-y divide-border rounded-card bg-surface">
        <li v-for="m in shown" :key="m.id">
          <NuxtLink :to="`/results/${m.id}`" class="flex items-center gap-3 p-4">
            <MaterialSymbols theme="rounded" class="text-fg-subtle">{{ TEST_ICON[m.type] }}</MaterialSymbols>
            <span class="flex-1 min-w-0">
              <span class="block text-body">{{ headline(m) }}</span>
              <span class="block text-caption text-fg-subtle">{{ TEST_LABEL[m.type] }} · {{ faDate(m.measured_at) }}</span>
            </span>
            <DsBadge v-if="m.corrected" tone="info">اصلاح شده</DsBadge>
            <MaterialSymbols theme="rounded" class="text-fg-subtle">chevron_left</MaterialSymbols>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </template>
</template>
