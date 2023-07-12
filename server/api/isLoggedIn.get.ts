import {defineEventHandler, getCookie, deleteCookie, sendRedirect} from "h3"

export default defineEventHandler((event) => getCookie(event, 'user'))
