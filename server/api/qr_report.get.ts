import {defineEventHandler} from "h3"
import {useNitroApp} from "#imports";

export default defineEventHandler((event) => {

    return useNitroApp()
})