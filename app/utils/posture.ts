/**
 * Turns the graded posture zones (report.analyze.zones, or the posture part of a mirror
 * result) into a short list of findings for summaries: home, the report header and progress.
 * Grades use the same keywords as the layer's ReportCard.
 */

export type PostureLevel = "healthy" | "need_to_fix" | "dangerous"

export type PostureFinding = {
    key: string
    title: string
    level: PostureLevel
}

const NEED_TO_FIX = ["need_to_fix", "low_kyphosis", "low_flatback", "low_lordosis", "low_swayback"]
const DANGEROUS = ["dangerous", "high_swayback", "high_lordosis", "high_flatback", "high_kyphosis"]

export const postureLevel = (grade?: string | null): PostureLevel => {
    if (grade && DANGEROUS.includes(grade)) return "dangerous"
    if (grade && NEED_TO_FIX.includes(grade)) return "need_to_fix"
    return "healthy"
}

export const POSTURE_LEVEL_TEXT: Record<PostureLevel, string> = {
    healthy: "سالم",
    need_to_fix: "نیاز به اصلاح",
    dangerous: "ناهنجاری شدید",
}

/** DsBadge tone for each level. */
export const POSTURE_LEVEL_TONE: Record<PostureLevel, "success" | "warning" | "danger"> = {
    healthy: "success",
    need_to_fix: "warning",
    dangerous: "danger",
}

const FRONTAL: [string, string, string][] = [
    ["neck", "left", "گردن"],
    ["shoulder", "right", "شانه راست"],
    ["shoulder", "left", "شانه چپ"],
    ["hip", "right", "لگن راست"],
    ["hip", "left", "لگن چپ"],
    ["knee", "right", "زانوی راست"],
    ["knee", "left", "زانوی چپ"],
]

/**
 * `zones` is the object that holds `frontal`, `sagital` and optionally `dense_pose`
 * (report.analyze.zones, or a mirror result's posture). Missing parts are skipped.
 */
export const postureFindings = (zones: any): PostureFinding[] => {
    if (!zones) return []
    const out: PostureFinding[] = []

    for (const [zone, side, title] of FRONTAL) {
        const grade = zones?.frontal?.[zone]?.[side]?.grade
        if (grade !== undefined) out.push({ key: `${zone}.${side}`, title, level: postureLevel(grade) })
    }

    const forwardHead = zones?.sagital?.forward_head?.grade
    if (forwardHead !== undefined) out.push({ key: "forward_head", title: "سر به جلو", level: postureLevel(forwardHead) })

    const kyphosis = zones?.dense_pose?.D1?.grade
    if (kyphosis !== undefined) out.push({ key: "kyphosis", title: "قوز کمر", level: postureLevel(kyphosis) })

    const lordosis = zones?.dense_pose?.D2?.grade
    if (lordosis !== undefined) out.push({ key: "lordosis", title: "گودی کمر", level: postureLevel(lordosis) })

    return out
}

export type PostureSummary = {
    total: number
    healthy: number
    attention: PostureFinding[]
}

/** Findings that need attention come first, the most serious first. */
export const postureSummary = (zones: any): PostureSummary => {
    const findings = postureFindings(zones)
    const rank: Record<PostureLevel, number> = { dangerous: 0, need_to_fix: 1, healthy: 2 }
    const attention = findings.filter(f => f.level !== "healthy").sort((a, b) => rank[a.level] - rank[b.level])

    return { total: findings.length, healthy: findings.length - attention.length, attention }
}
