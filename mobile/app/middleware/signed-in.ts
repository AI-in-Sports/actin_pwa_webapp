/** Every screen but login needs a member who is signed in. */
export default defineNuxtRouteMiddleware((to) => {
  if (!useAuthStore().token) return navigateTo({ path: '/', query: to.fullPath !== '/results' ? { next: to.fullPath } : {} })
})
