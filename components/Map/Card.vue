<script setup lang="ts">
import icon_map_recommend from "~/assets/map/icon_map_recommend.svg"
import icon_map_st1 from "~/assets/map/icon_map_st1.svg"
//import icon_map_st2 from "~/assets/map/icon_map_st2.svg"
import icon_map_st3 from "~/assets/map/icon_map_st3.svg"
import {LIcon} from "@vue-leaflet/vue-leaflet"
import {Ref} from "vue"

const props = defineProps<{
  flag: "special" | "active" | "deactivate",
  location: [number, number]
  zoom: number,
  dr: {
    fullName: string,
    speciality: string
  }
}>()


const emit = defineEmits(['changeZoom'])

const flags = {
  special: icon_map_recommend,
  active: icon_map_st1,
  deactivate: icon_map_st3
}

const isZoom = computed(() => props.zoom > 13)
const anchorPoint: Ref<[number, number]> = computed(() => isZoom.value ? [80, 140] : [16, 40])
const iconSize: Ref<[number, number]> = computed(() => isZoom.value ? [160, 140]: [40, 32])

let dr_marker = ref()

onMounted(() => {
  const icon: HTMLDivElement = dr_marker.value.leafletObject._icon
  icon.addEventListener("click", () => {
    if (props.zoom > 15) alert("پروفایل منو باز کن")
    else emit("changeZoom", props.location)
  })
})
</script>

<template>
  <LMarker :lat-lng="location" ref="dr_marker">
    <LIcon class-name="!border-none" :icon-size="iconSize" v-model:iconAnchor="anchorPoint" ref="dr_flag">
      <div class="dr_flag flex flex-col justify-center items-center mx-auto" :class="{ 'absolute': isZoom }">
        <div class="relative w-[160px] h-[88px] bg-black/80 rounded-lg shadow-lg mb-[12px] flex flex-col p-2" v-if="isZoom">
          <div class="flex items-center mb-2 font-bold">
            <FaIcon :icon="['far', 'circle-user']" class="text-[18px] ml-2"/>

            {{ dr.fullName }}
          </div>
          <div class="flex items-center">
            <FaIcon :icon="['fas', 'stethoscope']" class="text-[16px] ml-2"/>

            {{ dr.speciality }}
          </div>
        </div>

        <img :src="flags[flag]" alt="flag">
      </div>
    </LIcon>
  </LMarker>
</template>

<style lang="sass">

.dr_flag > div::after
  left: 50%
  right: 50%
  transform: translateX(50%)
  content: "▾"
  color: rgba(0, 0, 0, 0.8)
  font-size: 20px
  height: 10px
  width: 10px
  position: absolute
  border-style: solid
  bottom: -0px
</style>