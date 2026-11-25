/**
 * Client for the member side of the care API in actin_pwa_backend (/care/v1/me/...):
 * the centers the member belongs to, what each may see (consent), the specialists the
 * center assigned, and every result claimed into the account.
 */
import type { CenterType, MirrorTest } from "~/composables/useMirrorLink"

export type ConsentCategory = MirrorTest | "wearables"
export type ConsentAudience = "specialists" | "center_admins" | "ai_assistant"

export type ConsentSummary = {
    status: "none" | "granted" | "withdrawn"
    categories: ConsentCategory[]
    audiences: ConsentAudience[]
    recorded_at: string | null
}

export type SpecialistKind = "trainer" | "doctor" | "physiotherapist" | "nutritionist"

export type SpecialistRef = {
    id: string
    kind: SpecialistKind
    title: string | null
    first_name: string | null
    last_name: string | null
}

export type CenterRef = { id: string, name: string, type: CenterType }

export type MyCenter = {
    center: CenterRef
    member_id: string
    consent: ConsentSummary
    specialists: SpecialistRef[]
}

export type Measurement = {
    id: string
    type: MirrorTest
    record_kind: "measurement" | "report" | "wearable"
    source: string
    center_id: string | null
    device_id: string | null
    session_id: string | null
    measured_at: string
    data: Record<string, any>
    revision: number
    corrected: boolean
    updated_at: string | null
}

/** Version of the sharing text shown in the app (scan page and progress page). */
export const CONSENT_POLICY_VERSION = "2026-11"

export const SPECIALIST_KIND_TEXT: Record<SpecialistKind, string> = {
    trainer: "مربی",
    doctor: "پزشک",
    physiotherapist: "فیزیوتراپیست",
    nutritionist: "متخصص تغذیه",
}

export const specialistName = (s: SpecialistRef) =>
    [s.title, s.first_name, s.last_name].filter(Boolean).join(" ") || SPECIALIST_KIND_TEXT[s.kind]

const ALL_TESTS: MirrorTest[] = ["posture", "heart_rate", "body_composition"]

export const useCare = () => {
    const call = <T>(path: string, options: { method?: "GET" | "PUT" | "DELETE", body?: any, query?: any } = {}) =>
        $fetch<T>(`/care/v1/me${path}`, {
            baseURL: useRuntimeConfig().public.APP_BACKEND as string,
            method: options.method ?? "GET",
            body: options.body,
            query: options.query,
            headers: { Authorization: useAuthStore().getToken },
        })

    const centers = () => call<MyCenter[]>("/centers")

    const measurements = (type?: MirrorTest) => call<Measurement[]>("/measurements", { query: type ? { type } : undefined })

    /** Shares the mirror results with the specialists the center assigned to the member. */
    const shareWithSpecialists = (centerId: string, categories: ConsentCategory[] = ALL_TESTS) =>
        call<unknown>(`/centers/${encodeURIComponent(centerId)}/consent`, {
            method: "PUT",
            body: { categories, audiences: ["specialists"], policy_version: CONSENT_POLICY_VERSION },
        })

    const stopSharing = (centerId: string) =>
        call<unknown>(`/centers/${encodeURIComponent(centerId)}/consent`, { method: "DELETE" })

    return { centers, measurements, shareWithSpecialists, stopSharing }
}

/** True when the member currently shares with that center's specialists. */
export const sharesWithSpecialists = (c: MyCenter) =>
    c.consent.status === "granted" && c.consent.audiences.includes("specialists") && c.consent.categories.length > 0

/** Latest measurement of a type, or null. The API returns newest first. */
export const latestOf = (list: Measurement[] | null | undefined, type: MirrorTest) =>
    list?.find(m => m.type === type) ?? null
