<script setup lang="ts">
// Consent: per center, which tests are shared and with whom. Every save is a new
// consent record on the server (the old ones stay in the history).
definePageMeta({ middleware: 'signed-in', title: 'اشتراک‌گذاری' })

const api = useApi()
const auth = useAuthStore()
const { data: centers, pending, error, refresh } = useAsyncData('my-centers', () => api<MyCenter[]>('/care/v1/me/centers'), { default: () => [] })

/** Edits in progress, by center id. */
const drafts = reactive<Record<string, { categories: string[], audiences: Audience[] }>>({})
const saving = ref<string | null>(null)
const message = ref<{ center: string, text: string, ok: boolean } | null>(null)

const open = (c: MyCenter) => {
  drafts[c.center.id] = c.consent.status === 'granted'
    ? { categories: [...c.consent.categories], audiences: [...c.consent.audiences] }
    : { categories: [], audiences: ['specialists'] }
}
const toggle = <T,>(list: T[], v: T) => { const i = list.indexOf(v); i < 0 ? list.push(v) : list.splice(i, 1) }

const save = async (c: MyCenter) => {
  const d = drafts[c.center.id]
  if (!d) return
  saving.value = c.center.id
  message.value = null
  try {
    if (!d.categories.length || !d.audiences.length) await api(`/care/v1/me/centers/${c.center.id}/consent`, { method: 'DELETE' })
    else await api(`/care/v1/me/centers/${c.center.id}/consent`, { method: 'PUT', body: consentBody(d.categories, d.audiences) })
    delete drafts[c.center.id]
    message.value = { center: c.center.id, text: 'انتخاب شما ثبت شد.', ok: true }
    await refresh()
  } catch (e: any) {
    message.value = { center: c.center.id, text: e.message, ok: false }
  } finally {
    saving.value = null
  }
}

const stopAll = async (c: MyCenter) => {
  saving.value = c.center.id
  try {
    await api(`/care/v1/me/centers/${c.center.id}/consent`, { method: 'DELETE' })
    delete drafts[c.center.id]
    message.value = { center: c.center.id, text: 'اشتراک‌گذاری با این مرکز متوقف شد.', ok: true }
    await refresh()
  } catch (e: any) {
    message.value = { center: c.center.id, text: e.message, ok: false }
  } finally {
    saving.value = null
  }
}

const signOut = async () => {
  auth.logout()
  clearNuxtData()
  await navigateTo('/', { replace: true })
}
</script>

<template>
  <p class="text-body-sm text-fg-muted">
    نتایج شما فقط در حساب خودتان است. برای هر مرکز انتخاب کنید کدام نتایج را و چه کسانی ببینند. هر وقت بخواهید می‌توانید آن را تغییر دهید یا متوقف کنید.
  </p>

  <p v-if="error" role="alert" class="rounded-card bg-danger/[0.08] text-danger p-4 text-body-sm">
    {{ error.message }} <button type="button" class="underline mr-2" @click="refresh()">تلاش دوباره</button>
  </p>
  <div v-if="pending && !centers.length" class="h-32 rounded-card bg-surface-2 animate-pulse" aria-busy="true"/>
  <DsCard v-else-if="!centers.length" class="text-body-sm text-fg-muted">
    شما عضو هیچ مرکزی نیستید. وقتی مرکزی شما را به فهرست اعضایش اضافه کند، اینجا دیده می‌شود.
  </DsCard>

  <DsCard v-for="c in centers" :key="c.center.id" class="flex flex-col gap-3">
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="text-caption text-fg-subtle">{{ CENTER_LABEL[c.center.type] }}</p>
        <p class="text-title-sm font-semibold">{{ c.center.name }}</p>
      </div>
      <DsBadge :tone="c.consent.status === 'granted' && c.consent.categories.length ? 'success' : 'neutral'">
        {{ c.consent.status === 'granted' && c.consent.categories.length ? 'در حال اشتراک' : 'بدون اشتراک' }}
      </DsBadge>
    </div>
    <p class="text-body-sm">{{ consentSentence(c.consent) }}</p>
    <p v-if="c.specialists.length" class="text-caption text-fg-muted">
      متخصصان شما:
      {{ c.specialists.map((s) => `${personName(s) || 'بدون نام'} (${s.title || SPECIALIST_KIND_LABEL[s.kind] || s.kind})`).join('، ') }}
    </p>

    <div v-if="drafts[c.center.id]" class="flex flex-col gap-4 border-t border-border pt-3">
      <fieldset class="flex flex-col gap-2">
        <legend class="text-body-sm font-medium mb-1">کدام نتایج</legend>
        <label v-for="t in TESTS" :key="t" class="flex items-center gap-3 min-h-11">
          <input type="checkbox" class="size-5 accent-accent" :checked="drafts[c.center.id].categories.includes(t)" @change="toggle(drafts[c.center.id].categories, t)">
          <span class="text-body">{{ TEST_LABEL[t] }}</span>
        </label>
      </fieldset>
      <fieldset class="flex flex-col gap-2">
        <legend class="text-body-sm font-medium mb-1">چه کسانی</legend>
        <label v-for="a in AUDIENCES" :key="a" class="flex items-center gap-3 min-h-11">
          <input type="checkbox" class="size-5 accent-accent" :checked="drafts[c.center.id].audiences.includes(a)" @change="toggle(drafts[c.center.id].audiences, a)">
          <span class="text-body">{{ AUDIENCE_LABEL[a] }}</span>
        </label>
      </fieldset>
      <div class="flex gap-2">
        <DsButton class="flex-1" :loading="saving === c.center.id" @click="save(c)">ذخیره</DsButton>
        <DsButton variant="secondary" @click="delete drafts[c.center.id]">انصراف</DsButton>
      </div>
    </div>
    <div v-else class="flex gap-2">
      <DsButton variant="secondary" size="sm" @click="open(c)">تغییر</DsButton>
      <DsButton
        v-if="c.consent.status === 'granted' && c.consent.categories.length"
        variant="ghost" size="sm" class="text-danger" :loading="saving === c.center.id" @click="stopAll(c)">
        توقف همه
      </DsButton>
    </div>
    <p v-if="message?.center === c.center.id" role="status" class="text-body-sm" :class="message.ok ? 'text-success' : 'text-danger'">{{ message.text }}</p>
  </DsCard>

  <div class="mt-6 flex flex-col items-center gap-1 text-caption text-fg-subtle">
    <p dir="ltr">{{ faDigits(auth.phone ?? '') }}</p>
    <button type="button" class="text-danger text-body-sm p-2" @click="signOut">خروج از حساب</button>
  </div>
</template>
