import { defineStore } from 'pinia'

export type AuthStateUser = {
    id: string | null,
    phone: string | null,
    fullName: string | null
}

export type AuthState = {
    token?: string | null,
    phone?: string | null,
    scanSession?: string | null,
    reportSessionId?: string | null,
    user: AuthStateUser
}

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            token: null,
            phone: null,
            scanSession: null,
            reportSessionId: null,
            user: null as AuthStateUser | null
        } as AuthState
    },
    getters: {
        getToken: (state: AuthState) => `Bearer ${state.token}`
    },
    actions: {
        set(key: keyof AuthState, data: any) {
            this[key] = data
        },

        del(key: keyof AuthState) {
            if (key === "user")
                this.user = { id: null, fullName: null, phone: null }

            else this[key] = null
        },

        logout() {
            this.user = { id: null, fullName: null, phone: null }
            this.token = null
            this.phone = null

            this.$persist()
        },

        async isLoggedIn() {
            const {data, error} = await apiSSRFetch<AuthStateUser>("/auth/info", {
                auth: true
            })

            if (error.value) {
                this.logout()
                return false
            }

            this.user = data.value!

            this.$persist()
            return true
        }
    },
    persist: true,
})