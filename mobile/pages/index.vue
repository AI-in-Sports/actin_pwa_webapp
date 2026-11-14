<script setup lang="ts">
// Step 1 of sign-in: phone number. Same OTP flow as the web app (client "pwa"),
// so a new number gets an account and a member listed by a center is matched by phone.
definePageMeta({ layout: 'bare', middleware: 'guest' })

const route = useRoute()
const { requestCode, pending } = useOtpLogin({ client: 'pwa' })
const phone = ref((route.query.phone as string) ?? '')
const error = ref(route.query.expired ? 'نشست شما منقضی شده است. لطفا دوباره وارد شوید.' : '')

const submit = async () => {
  error.value = ''
  try {
    await requestCode(phone.value)
    await navigateTo({ path: '/verify', query: route.query.next ? { next: route.query.next } : {} })
  } catch (e: any) {
    error.value = e?.reason === 'invalid_phone'
      ? 'شماره موبایل را به شکل ۰۹۱۲۱۲۳۴۵۶۷ وارد کنید.'
      : e?.reason === 'network' ? 'اتصال به اینترنت برقرار نیست.' : 'ارسال کد انجام نشد. دوباره امتحان کنید.'
  }
}
</script>

<template>
  <form class="min-h-[100dvh] flex flex-col px-6 py-10 gap-6" @submit.prevent="submit">
    <img src="~/assets/images/logo_tr_white.png" alt="اکتین" class="h-16 self-center mt-8 mb-6 dark:invert">
    <div class="flex flex-col gap-2">
      <h1 class="text-headline font-bold">ورود به اکتین</h1>
      <p class="text-body text-fg-muted">نتایج تست‌های آینه را ببینید و انتخاب کنید چه کسی آن‌ها را ببیند.</p>
    </div>

    <label class="flex flex-col gap-2">
      <span class="text-body-sm text-fg-muted">شماره موبایل</span>
      <input
        v-model="phone" type="tel" inputmode="numeric" autocomplete="tel" dir="ltr" required
        placeholder="09121234567"
        class="h-control-md rounded-input bg-surface border border-border px-4 text-body text-left focus:outline-accent">
    </label>
    <p v-if="error" role="alert" class="text-body-sm text-danger">{{ error }}</p>

    <DsButton type="submit" block :loading="pending" class="mt-auto">دریافت کد</DsButton>
  </form>
</template>
