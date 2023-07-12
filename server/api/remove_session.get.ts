import {defineEventHandler, getCookie, deleteCookie, sendRedirect} from "h3"

export default defineEventHandler((event) => {

    const user = getCookie(event, 'user')

    if (user) deleteCookie(event, "user")

    return sendRedirect(event, "/", 301)
})
