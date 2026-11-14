<script setup lang="ts">
// Step 2 of sign-in: the six-digit code sent by SMS.
definePageMeta({ layout: 'bare', middleware: 'guest' })

const route = useRoute()
const auth = useAuthStore()
const { verify, pending } = useOtpLogin({ client: 'pwa' })
const code = ref('')
const error = ref('')
const wait = ref(60)

if (!auth.phone) navigateTo('/', { replace: true })

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => { timer = setInterval(() => { if (wait.value > 0) wait.value -= 1 }, 1000) })
onBeforeUnmount(() => clearInterval(timer))

const submit = async () => {
  error.value = ''
  if (normalizeCode(code.value).length < 6) return (error.value = 'کد شش رقمی را کامل وارد کنید.')
  try {
    await verify(code.value)
    await auth.isLoggedIn()
    const next = typeof route.query.next === 'string' && route.query.next.startsWith('/') ? route.query.next : '/results'
    await navigateTo(next, { replace: true })
  } catch (e: any) {
    if (e?.reason === 'expired') return navigateTo({ path: '/', query: { phone: auth.phone ?? '', expired: '1' } }, { replace: true })
    error.value = e?.reason === 'wrong_code' ? 'کد وارد شده درست نیست.'
      : e?.reason === 'network' ? 'اتصال به اینترنت برقرار نیست.' : 'ورود انجام نشد. دوباره امتحان کنید.'
  }
}

watch(code, (v) => { if (normalizeCode(v).length === 6 && !pending.value) submit() })
</script>

<template>
  <form class="min-h-[100dvh] flex flex-col px-6 py-10 gap-6" @submit.prevent="submit">
    <NuxtLink to="/" class="self-start p-2 -mr-2 text-fg-muted" aria-label="تغییر شماره">
      <MaterialSymbols theme="rounded">arrow_forward</MaterialSymbols>
    </NuxtLink>
    <div class="flex flex-col gap-2">
      <h1 class="text-headline font-bold">کد ورود</h1>
      <p class="text-body text-fg-muted">
        کد به شماره‌ی <span dir="ltr">{{ faDigits(auth.phone ?? '') }}</span> پیامک شد.
      </p>
    </div>

    <ThemeVerificationCode v-model:value="code"/>
    <p v-if="error" role="alert" class="text-body-sm text-danger">{{ error }}</p>

    <NuxtLink
      v-if="wait === 0" :to="{ path: '/', query: { phone: auth.phone ?? '' } }"
      class="text-body-sm text-accent self-center">ارسال دوباره‌ی کد</NuxtLink>
    <p v-else class="text-body-sm text-fg-subtle self-center">ارسال دوباره تا {{ faDigits(wait) }} ثانیه</p>

    <DsButton type="submit" block :loading="pending" class="mt-auto">ورود</DsButton>
  </form>
</template>
