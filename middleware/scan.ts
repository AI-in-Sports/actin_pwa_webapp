/**
 * Remembers the scanned mirror session (QR session id or 6-digit code) so that the
 * user comes back to it after signing in (see pages/otp.vue). The page itself shows
 * the session preview and asks the user to sign in when needed.
 */
export default defineNuxtRouteMiddleware((to) => {
    const ref = to.params.session_id

    if (!ref || Array.isArray(ref)) return navigateTo("/scan")

    useAuthStore().set("reportSessionId", ref)
})
