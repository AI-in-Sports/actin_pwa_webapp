<script setup lang="ts">
/** Minimal line chart for a handful of points (oldest first). The last point is emphasised. */
const props = withDefaults(defineProps<{
  values: number[]
  color?: string
  height?: number
}>(), { color: "#00a62e", height: 110 })

const W = 300
const PAD = 12

const points = computed(() => {
  const v = props.values
  if (v.length === 0) return []
  const min = Math.min(...v), max = Math.max(...v)
  const span = max - min || 1
  const step = v.length > 1 ? (W - PAD * 2) / (v.length - 1) : 0
  return v.map((value, i) => ({
    x: v.length > 1 ? PAD + i * step : W / 2,
    y: PAD + (1 - (value - min) / span) * (props.height - PAD * 2),
  }))
})

const path = computed(() => points.value.map(p => `${p.x},${p.y}`).join(" "))
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${height}`" class="w-full" :style="{ height: `${height}px` }" dir="ltr" role="img" aria-hidden="true">
    <line v-for="y in [PAD, height / 2, height - PAD]" :key="y" x1="0" :y1="y" :x2="W" :y2="y" stroke="#eeeeee"/>
    <polyline v-if="points.length > 1" :points="path" fill="none" :stroke="color" stroke-width="3"
              stroke-linecap="round" stroke-linejoin="round"/>
    <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" :r="i === points.length - 1 ? 6 : 4"
            :fill="i === points.length - 1 ? '#212121' : color"/>
  </svg>
</template>
