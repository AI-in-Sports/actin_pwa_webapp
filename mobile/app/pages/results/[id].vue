<script setup lang="ts">
// One result: its values (or posture findings) and where it came from, with every change.
definePageMeta({ middleware: 'signed-in', title: 'جزئیات نتیجه', back: true, tabs: false })

const route = useRoute()
const api = useApi()
const { data, pending, error } = useAsyncData(
  `result-${route.params.id}`,
  () => api<{ measurement: Measurement, history: HistoryEntry[] }>(`/care/v1/me/measurements/${route.params.id}/history`),
)
const m = computed(() => data.value?.measurement)
const findings = computed(() => (m.value?.type === 'posture' ? postureFindings(m.value.data) : []))
const flagged = computed(() => findings.value.filter((f) => f.level !== 'ok'))
const LEVEL_TONE = { ok: 'success', watch: 'warning', risk: 'danger' } as const
const LEVEL_TEXT = { ok: 'طبیعی', watch: 'نیازمند توجه', risk: 'نیازمند بررسی' } as const
</script>

<template>
  <p v-if="error" role="alert" class="rounded-card bg-danger/[0.08] text-danger p-4 text-body-sm">{{ error.message }}</p>
  <div v-else-if="pending" class="h-40 rounded-card bg-surface-2 animate-pulse" aria-busy="true"/>

  <template v-else-if="m">
    <DsCard class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <span class="size-12 rounded-full bg-accent/10 text-accent grid place-items-center">
          <MaterialSymbols theme="rounded" filled>{{ TEST_ICON[m.type] }}</MaterialSymbols>
        </span>
        <div class="flex-1">
          <p class="text-title-sm font-semibold">{{ TEST_LABEL[m.type] }}</p>
          <p class="text-caption text-fg-subtle">{{ faDate(m.measured_at, true) }}</p>
        </div>
        <DsBadge v-if="m.corrected" tone="info">اصلاح شده</DsBadge>
      </div>

      <dl v-if="m.type !== 'posture'" class="grid grid-cols-2 gap-3">
        <div v-for="row in measurementRows(m.data)" :key="row.key" class="rounded-input bg-surface-2 p-3">
          <dt class="text-caption text-fg-muted">{{ row.label }}</dt>
          <dd class="text-title-sm font-semibold mt-1">{{ row.value }}</dd>
        </div>
      </dl>

      <div v-else class="flex flex-col gap-2">
        <p class="text-body">{{ headline(m) }}</p>
        <ul class="flex flex-col gap-2">
          <li v-for="f in (flagged.length ? flagged : findings)" :key="f.path.join('.')" class="flex items-center justify-between gap-2">
            <span class="text-body-sm text-fg-muted" dir="ltr">{{ f.path.join(' · ') }}</span>
            <DsBadge :tone="LEVEL_TONE[f.level]">{{ LEVEL_TEXT[f.level] }}</DsBadge>
          </li>
        </ul>
        <p class="text-caption text-fg-subtle">این ارزیابی جایگزین معاینه‌ی پزشک نیست.</p>
      </div>
    </DsCard>

    <section class="flex flex-col gap-2">
      <h2 class="text-body font-semibold">سابقه‌ی این نتیجه</h2>
      <ol class="flex flex-col gap-3 border-r-2 border-border pr-4">
        <li v-for="h in data!.history" :key="h.revision" class="flex flex-col gap-1">
          <p class="text-body-sm font-medium">{{ HISTORY_ACTION_LABEL[h.action] }}</p>
          <p v-if="h.at || h.measured_at" class="text-caption text-fg-subtle">{{ faDate(h.at ?? h.measured_at, true) }}</p>
          <p v-if="h.reason" class="text-caption text-fg-muted">دلیل: {{ h.reason }}</p>
          <p v-if="h.data && m.type !== 'posture'" class="text-caption text-fg-muted">
            <span v-for="row in measurementRows(h.data)" :key="row.key" class="ml-3">{{ row.label }}: {{ row.value }}</span>
          </p>
        </li>
      </ol>
    </section>
  </template>
</template>
