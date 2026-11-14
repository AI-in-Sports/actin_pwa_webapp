import { describe, expect, it } from 'vitest'
import {
  claimErrorOf, consentBody, consentSentence, faDigits, headline, isLinkCode, latestByTest, measurementRows,
  normalizeCode, postureFindings, previewBlocker, refFromScan, trend, type LinkPreview, type Measurement,
} from '../utils/app'

const m = (over: Partial<Measurement>): Measurement => ({
  id: 'x', type: 'heart_rate', record_kind: 'measurement', source: 'mirror', center_id: null, session_id: null,
  measured_at: '2026-11-01T10:00:00Z', data: {}, revision: 1, corrected: false, ...over,
})

describe('claiming', () => {
  it('reads codes typed with Persian digits and spaces', () => {
    expect(normalizeCode('۴۸۲ ۱۹۷')).toBe('482197')
    expect(isLinkCode('482197')).toBe(true)
    expect(isLinkCode('12')).toBe(false)
  })

  it('turns what the QR holds into a ref, and refuses other codes', () => {
    expect(refFromScan('https://app.actinhealth.ir/scan/2c835fe1-c9cf-4039-8fb6-5b5a072f2f65'))
      .toBe('2c835fe1-c9cf-4039-8fb6-5b5a072f2f65')
    expect(refFromScan('https://staging.actinhealth.ir/scan/abcdef12/')).toBe('abcdef12')
    expect(refFromScan('2c835fe1-c9cf-4039-8fb6-5b5a072f2f65')).toBe('2c835fe1-c9cf-4039-8fb6-5b5a072f2f65')
    expect(refFromScan('۴۸۲۱۹۷')).toBe('482197')
    expect(refFromScan('https://evil.example/scan/abcdef12')).toBeNull()
    expect(refFromScan('https://app.actinhealth.ir/profile')).toBeNull()
    expect(refFromScan('')).toBeNull()
  })

  it('explains each failure status', () => {
    expect(claimErrorOf(0)).toBe('network')
    expect(claimErrorOf(422)).toBe('wrong_code')
    expect(claimErrorOf(403)).toBe('not_member')
    expect(claimErrorOf(410)).toBe('expired')
    expect(claimErrorOf(429)).toBe('locked')
    expect(claimErrorOf(500)).toBe('server')
  })

  it('blocks a claim the preview already rules out', () => {
    const p: LinkPreview = {
      session_id: 's', status: 'ready', requires_code: false, center: { name: 'c', type: 'club' },
      tests: ['posture'], expires_at: null, claimed_by_you: false,
    }
    expect(previewBlocker(p)).toBeNull()
    expect(previewBlocker({ ...p, status: 'pending' })).toMatch(/در حال اندازه‌گیری/)
    expect(previewBlocker({ ...p, status: 'claimed' })).not.toBeNull()
    expect(previewBlocker({ ...p, status: 'claimed', claimed_by_you: true })).toBeNull()
  })
})

describe('results', () => {
  it('shows one headline number per test', () => {
    expect(headline(m({ data: { bpm: 72 } }))).toBe('۷۲ ضربه در دقیقه')
    expect(headline(m({ type: 'body_composition', data: { weight_kg: 72.44, body_fat_pct: 18.1 } })))
      .toBe('۷۲٫۴ کیلوگرم · چربی ۱۸٫۱٪')
    expect(faDigits(3)).toBe('۳')
  })

  it('flattens posture zones and counts what needs attention', () => {
    const zones = { frontal: { neck: { left: 'healthy', right: 'need_to_fix' } }, sagittal: { spine: 'high_kyphosis' } }
    const list = postureFindings(zones)
    expect(list).toHaveLength(3)
    expect(list.find((f) => f.grade === 'high_kyphosis')?.level).toBe('risk')
    expect(headline(m({ type: 'posture', record_kind: 'report', data: zones }))).toBe('۲ مورد نیازمند توجه')
    expect(headline(m({ type: 'posture', data: { a: 'normal' } }))).toBe('بدون مورد نگران‌کننده')
  })

  it('hides device fields from the value rows', () => {
    const rows = measurementRows({ weight_kg: 70, impedance_ohm: 500, scale_model: 'x', nested: { a: 1 } })
    expect(rows.map((r) => r.key)).toEqual(['weight_kg'])
  })

  it('finds the newest result per test and the change since the one before', () => {
    const list = [
      m({ id: 'a', type: 'body_composition', measured_at: '2026-10-01T00:00:00Z', data: { weight_kg: 74 } }),
      m({ id: 'b', type: 'body_composition', measured_at: '2026-11-01T00:00:00Z', data: { weight_kg: 72.5 } }),
      m({ id: 'c', type: 'heart_rate', measured_at: '2026-09-01T00:00:00Z', data: { bpm: 70 } }),
    ]
    const latest = latestByTest(list)
    expect(latest.body_composition?.id).toBe('b')
    expect(latest.posture).toBeUndefined()
    expect(trend(list, latest.body_composition!, 'weight_kg')).toBe(-1.5)
    expect(trend(list, list[0], 'weight_kg')).toBeNull()
  })
})

describe('sharing', () => {
  it('sends tests and audiences in a stable order with the policy version', () => {
    expect(consentBody(['posture', 'heart_rate'], ['center_admins', 'specialists'])).toEqual({
      categories: ['heart_rate', 'posture'],
      audiences: ['specialists', 'center_admins'],
      policy_version: '2026-11',
    })
    expect(consentBody(['wearables', 'posture'], ['specialists']).categories).toEqual(['posture', 'wearables'])
  })

  it('says in one sentence what a center sees', () => {
    expect(consentSentence({ status: 'none', categories: [], audiences: [], recorded_at: null })).toMatch(/هیچ‌کدام/)
    expect(consentSentence({ status: 'withdrawn', categories: ['posture'], audiences: ['specialists'], recorded_at: null })).toMatch(/هیچ‌کدام/)
    expect(consentSentence({ status: 'granted', categories: ['heart_rate'], audiences: ['specialists'], recorded_at: null }))
      .toBe('متخصصان شما نتایج ضربان قلب را می‌بینند.')
  })
})
