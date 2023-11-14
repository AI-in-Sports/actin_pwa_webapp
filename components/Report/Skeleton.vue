<script lang="ts" setup>
import Frontal from '~/assets/images/frontal_points.svg'
import Sagital from '~/assets/images/sagital_points.svg'

const props = defineProps<{
  report: any,
  test: string
}>()

const svgContent = shallowRef<string>('')

const colors = useNuxtApp().$getHealthyColor

const report = props.report

// Simulate API data, where the keys are the circle IDs and values are the colors
const apiData = shallowRef<{ [key: string]: string }>()
const sagitalData = shallowRef<{ [key: string]: string }>({})

if (props.test === 'frontal') {
  apiData.value = {
    left_knee: colors(report['knee']['left']["grade"]),
    right_knee: colors(report['knee']['right']["grade"]),
    left_hip: colors(report['hip']['left']["grade"]),
    right_hip: colors(report['hip']['right']["grade"]),
    left_shoulder: colors(report['shoulder']['left']["grade"]),
    right_shoulder: colors(report['shoulder']['right']["grade"]),
    neck: colors(report['neck']['left']["grade"]),
  }
}

else sagitalData.value = {
  forward_head: colors(report['sagital']['forward_head']["grade"]),
  kyphosis: colors(report['dense_pose']['D1']["grade"]),
  lordosis: colors(report['dense_pose']['D2']["grade"])
}

// Load the SVG content and update circle colors when the component is mounted
onMounted(() => {
  fetch(props.test === 'frontal' ? Frontal : Sagital)
      .then((response) => response.text())
      .then((svgText) => {
        svgContent.value = svgText
        updateCircleColors()
      })
})

// Update the circle colors based on API data
const updateCircleColors = () => {
  const svg = document.createElement('div')
  svg.innerHTML = svgContent.value

  const data = props.test === 'frontal' ? apiData.value : sagitalData.value

  for (const id in data) {
    const circle = svg.querySelectorAll(`.${id}`)

    for (const round of circle) {
      round.setAttribute('fill', data[id])
      round.setAttribute('stroke', data[id])
    }
  }

  svgContent.value = svg.innerHTML
}
</script>

<template>
  <div class="bg-[#EEE] p-8 rounded-[24px] flex justify-center items-center relative">
    <div v-html="svgContent"></div>
  </div>
</template>