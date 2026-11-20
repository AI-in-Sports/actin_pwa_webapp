// Pure helpers and types for the member app, kept free of Nuxt so they can be unit tested.
// Shapes follow actin_pwa_backend/openapi/openapi.json (/mirror/v1/link and /care/v1/me).

export type MirrorTest = 'posture' | 'heart_rate' | 'body_composition'
export type CenterType = 'club' | 'organization' | 'pharmacy'
export type Audience = 'specialists' | 'center_admins'
export type HistoryAction = 'created' | 'replaced' | 'corrected' | 'deleted' | 'claimed'
export type LinkStatus = 'pending' | 'ready' | 'claimed' | 'needs_review' | 'rejected' | 'expired' | 'cancelled'

export const TESTS: MirrorTest[] = ['body_composition', 'heart_rate', 'posture']
export const AUDIENCES: Audience[] = ['specialists', 'center_admins']
/** Version of the consent text shown on the sharing screen; sent with every choice. */
export const POLICY_VERSION = '2026-11'

export type CenterRef = { id: string, name: string, type: CenterType }

export type LinkPreview = {
  session_id: string
  status: LinkStatus
  /** True when the QR link was used and the center also wants the code from the mirror screen. */
  requires_code: boolean
  center: { name: string, type: CenterType }
  tests: MirrorTest[]
  expires_at: string | null
  claimed_by_you: boolean
}

export type Measurement = {
  id: string
  type: MirrorTest
  record_kind: 'measurement' | 'report'
  source: string
  center_id: string | null
  session_id: string | null
  measured_at: string
  data: Record<string, unknown>
  revision: number
  corrected: boolean
}

export type HistoryEntry = {
  revision: number
  action: HistoryAction
  source: string
  actor: { kind: 'device' | 'user' | 'system', id: string | null }
  data: Record<string, unknown> | null
  measured_at: string | null
  reason: string | null
  at?: string
}

export type ConsentSummary = {
  status: 'none' | 'granted' | 'withdrawn'
  /** Mirror tests, plus categories added later such as 'wearables'. */
  categories: string[]
  audiences: Audience[]
  recorded_at: string | null
}

export type MyCenter = {
  center: CenterRef
  member_id: string
  consent: ConsentSummary
  specialists: { id: string, kind: string, title: string | null, first_name: string | null, last_name: string | null }[]
}

// ---------------------------------------------------------------- labels

export const TEST_LABEL: Record<MirrorTest, string> = {
  body_composition: 'ترکیب بدن',
  heart_rate: 'ضربان قلب',
  posture: 'وضعیت بدنی',
}

/** Consent categories: the mirror tests plus any the backend adds later (wearables, from the sync work). */
export const CATEGORY_LABEL: Record<string, string> = { ...TEST_LABEL, wearables: 'ساعت و دستبند هوشمند' }

export const TEST_ICON: Record<MirrorTest, string> = {
  body_composition: 'monitor_weight',
  heart_rate: 'favorite',
  posture: 'accessibility_new',
}

export const CENTER_LABEL: Record<CenterType, string> = {
  club: 'باشگاه',
  organization: 'سازمان',
  pharmacy: 'داروخانه',
}

export const AUDIENCE_LABEL: Record<Audience, string> = {
  specialists: 'متخصصانی که مرکز برای شما تعیین کرده',
  center_admins: 'مدیران مرکز',
}

export const SPECIALIST_KIND_LABEL: Record<string, string> = {
  trainer: 'مربی',
  doctor: 'پزشک',
  physiotherapist: 'فیزیوتراپیست',
  nutritionist: 'متخصص تغذیه',
}

export const HISTORY_ACTION_LABEL: Record<HistoryAction, string> = {
  created: 'ثبت توسط آینه',
  replaced: 'اندازه‌گیری دوباره',
  corrected: 'اصلاح توسط متخصص',
  deleted: 'حذف',
  claimed: 'ثبت در حساب شما',
}

const FIELD_LABEL: Record<string, string> = {
  bpm: 'ضربان (در دقیقه)',
  hrv_ms: 'تغییرپذیری ضربان (میلی‌ثانیه)',
  duration_s: 'مدت اندازه‌گیری (ثانیه)',
  weight_kg: 'وزن (کیلوگرم)',
  bmi: 'شاخص توده‌ی بدنی',
  body_fat_pct: 'چربی بدن (٪)',
  muscle_mass_kg: 'توده‌ی عضلانی (کیلوگرم)',
  body_water_pct: 'آب بدن (٪)',
  bone_mass_kg: 'توده‌ی استخوان (کیلوگرم)',
  visceral_fat: 'چربی احشایی',
  bmr_kcal: 'متابولیسم پایه (کیلوکالری)',
}
/** Device-side fields a member has no use for. */
const HIDDEN_FIELDS = new Set(['impedance_ohm', 'scale_model', 'confidence', 'samples_bpm', 'measured_at'])

export const fieldLabel = (key: string) => FIELD_LABEL[key] ?? key

// ---------------------------------------------------------------- digits and dates

/** Persian/Arabic digits to Latin, everything else kept. */
export const toLatinDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

/** Latin digits to Persian, with at most one decimal for measurements. */
export const faDigits = (value: number | string) => {
  const text = typeof value === 'number' ? String(Math.round(value * 10) / 10) : value
  return text.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)] ?? d).replace('.', '٫')
}

/** "۲۳ آبان ۱۴۰۵" in the Persian calendar; empty for a missing or bad date. */
export const faDate = (iso: string | null | undefined, withTime = false) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric', month: 'long', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(d)
}

// ---------------------------------------------------------------- claiming a mirror result

/** Digits only, from whatever was typed (Persian digits, spaces, dashes). */
export const normalizeCode = (value: string) => toLatinDigits(value).replace(/\D/g, '')

/** The short code shown on the mirror (its length is configurable, 4 to 9 digits). */
export const isLinkCode = (ref: string) => /^\d{4,9}$/.test(ref)

/**
 * What the mirror's QR code holds, turned into a ref for /mirror/v1/link/sessions/{ref}:
 * the link `https://app.actinhealth.ir/scan/<session id>`, a bare session id, or a code.
 * Returns null for anything that is not an Actin mirror code.
 */
export const refFromScan = (raw: string): string | null => {
  const text = raw.trim()
  if (!text) return null
  const digits = normalizeCode(text)
  if (digits === toLatinDigits(text).replace(/[\s-]/g, '') && isLinkCode(digits)) return digits
  let path = text
  try {
    const url = new URL(text)
    if (!/(^|\.)actinhealth\.ir$/.test(url.hostname)) return null
    path = url.pathname
  } catch {
    // Not a URL: a bare session id.
  }
  const match = path.match(/(?:^|\/)scan\/([A-Za-z0-9-]{8,64})\/?$/) ?? path.match(/^([A-Za-z0-9-]{8,64})$/)
  return match ? (match[1] ?? null) : null
}

export type ClaimError =
  | 'wrong_code' | 'not_member' | 'not_found' | 'conflict' | 'expired' | 'locked' | 'unauthorized' | 'network' | 'server'

/** HTTP status of a failed claim to a reason the screen can explain. */
export const claimErrorOf = (status: number): ClaimError =>
  status === 0 ? 'network'
    : status === 400 || status === 422 ? 'wrong_code'
      : status === 401 ? 'unauthorized'
        : status === 403 ? 'not_member'
          : status === 404 ? 'not_found'
            : status === 409 ? 'conflict'
              : status === 410 ? 'expired'
                : status === 429 ? 'locked'
                  : 'server'

export const CLAIM_ERROR_TEXT: Record<ClaimError, string> = {
  wrong_code: 'کد وارد شده با این تست مطابقت ندارد.',
  not_member: 'این مرکز فقط نتایج اعضای خود را ثبت می‌کند. لطفا با پذیرش مرکز تماس بگیرید.',
  not_found: 'تستی با این کد پیدا نشد.',
  conflict: 'این تست قبلا برای حساب دیگری ثبت شده یا هنوز در حال اندازه‌گیری است.',
  expired: 'مهلت ثبت این تست تمام شده یا تست لغو شده است. لطفا تست را دوباره انجام دهید.',
  locked: 'تعداد تلاش‌های ناموفق زیاد بود. چند دقیقه دیگر دوباره امتحان کنید.',
  unauthorized: 'نشست شما منقضی شده است. لطفا دوباره وارد شوید.',
  network: 'اتصال به اینترنت برقرار نیست.',
  server: 'خطا از سمت سرور! لطفا دوباره امتحان کنید.',
}

/** What the preview says about whether this result can still be claimed. */
export const previewBlocker = (p: LinkPreview): string | null => {
  if (p.claimed_by_you) return null
  switch (p.status) {
    case 'pending': return 'آینه هنوز در حال اندازه‌گیری است. پس از پایان تست دوباره امتحان کنید.'
    case 'claimed': return CLAIM_ERROR_TEXT.conflict
    case 'needs_review': return 'این نتیجه منتظر تایید مرکز است.'
    case 'rejected': return 'مرکز ثبت این نتیجه را تایید نکرد. لطفا با پذیرش مرکز تماس بگیرید.'
    case 'expired':
    case 'cancelled': return CLAIM_ERROR_TEXT.expired
    default: return null
  }
}

// ---------------------------------------------------------------- results

/** Label/value rows for a heart rate or body composition result. Nested values are skipped. */
export const measurementRows = (data: Record<string, unknown> | null) =>
  Object.entries(data ?? {})
    .filter(([key, v]) => !HIDDEN_FIELDS.has(key) && (typeof v === 'number' || typeof v === 'string'))
    .map(([key, v]) => ({ key, label: fieldLabel(key), value: typeof v === 'number' ? faDigits(v) : String(v) }))

/** The one number shown on a result card. */
export const headline = (m: Pick<Measurement, 'type' | 'data'>): string => {
  const d = m.data ?? {}
  if (m.type === 'heart_rate' && typeof d.bpm === 'number') return `${faDigits(d.bpm)} ضربه در دقیقه`
  if (m.type === 'body_composition' && typeof d.weight_kg === 'number') {
    const fat = typeof d.body_fat_pct === 'number' ? ` · چربی ${faDigits(d.body_fat_pct)}٪` : ''
    return `${faDigits(d.weight_kg)} کیلوگرم${fat}`
  }
  if (m.type === 'posture') {
    const flagged = postureFindings(d).filter((f) => f.level !== 'ok').length
    return flagged ? `${faDigits(flagged)} مورد نیازمند توجه` : 'بدون مورد نگران‌کننده'
  }
  return ''
}

/** Posture grades the backend uses (same names as the report colours in the design system). */
const POSTURE_LEVEL = (grade: string): 'ok' | 'watch' | 'risk' =>
  grade === 'healthy' || grade === 'normal' ? 'ok'
    : grade === 'dangerous' || grade.startsWith('high_') ? 'risk'
      : 'watch'

/**
 * Every graded zone in a posture report as a flat list: zones are nested
 * (view → body part → side) and end in a string grade.
 */
export const postureFindings = (zones: unknown, path: string[] = []): { path: string[], grade: string, level: 'ok' | 'watch' | 'risk' }[] => {
  if (typeof zones === 'string') return [{ path, grade: zones, level: POSTURE_LEVEL(zones) }]
  if (!zones || typeof zones !== 'object' || Array.isArray(zones)) return []
  return Object.entries(zones as Record<string, unknown>).flatMap(([k, v]) => postureFindings(v, [...path, k]))
}

/** The newest result of each test, for the summary cards on the home screen. */
export const latestByTest = (list: Measurement[]) => {
  const out: Partial<Record<MirrorTest, Measurement>> = {}
  for (const m of list) {
    const seen = out[m.type]
    if (!seen || new Date(m.measured_at) > new Date(seen.measured_at)) out[m.type] = m
  }
  return out
}

/** Change from the previous result of the same test for one numeric field, or null. */
export const trend = (list: Measurement[], m: Measurement, key: string): number | null => {
  const now = m.data?.[key]
  if (typeof now !== 'number') return null
  const before = list
    .filter((x) => x.type === m.type && x.id !== m.id && new Date(x.measured_at) < new Date(m.measured_at))
    .sort((a, b) => +new Date(b.measured_at) - +new Date(a.measured_at))[0]
  const prev = before?.data?.[key]
  return typeof prev === 'number' ? Math.round((now - prev) * 10) / 10 : null
}

// ---------------------------------------------------------------- sharing

/** One sentence that says what this center sees today. */
export const consentSentence = (c: ConsentSummary) => {
  if (c.status !== 'granted' || !c.categories.length || !c.audiences.length) return 'این مرکز هیچ‌کدام از نتایج شما را نمی‌بیند.'
  const tests = c.categories.map((t) => CATEGORY_LABEL[t] ?? t).join('، ')
  const who = c.audiences.map((a) => (a === 'specialists' ? 'متخصصان شما' : 'مدیران مرکز')).join(' و ')
  return `${who} نتایج ${tests} را می‌بینند.`
}

/**
 * The body for PUT /care/v1/me/centers/{id}/consent from the toggles on screen.
 * Categories this screen has no toggle for (shared elsewhere) are kept, not dropped.
 */
export const consentBody = (categories: string[], audiences: Audience[]) => ({
  categories: [
    ...TESTS.filter((t) => categories.includes(t)),
    ...categories.filter((c) => !(TESTS as string[]).includes(c)),
  ],
  audiences: AUDIENCES.filter((a) => audiences.includes(a)),
  policy_version: POLICY_VERSION,
})

export const personName = (p: { first_name: string | null, last_name: string | null }) =>
  [p.first_name, p.last_name].filter(Boolean).join(' ')
