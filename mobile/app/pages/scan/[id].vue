<script setup lang="ts">
// The mirror's QR link is app.actinhealth.ir/scan/<session id>. When that link opens
// the app (or a web build of it), go to the claim screen with the session filled in.
definePageMeta({ middleware: 'signed-in' })
const route = useRoute()
await navigateTo({ path: '/claim', query: { ref: String(route.params.id) } }, { replace: true })
</script>

<template>
  <div/>
</template>
