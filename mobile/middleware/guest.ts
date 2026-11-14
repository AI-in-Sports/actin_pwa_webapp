/** Login screens: a signed-in member goes straight to their results. */
export default defineNuxtRouteMiddleware(() => {
  if (useAuthStore().token) return navigateTo('/results', { replace: true })
})
