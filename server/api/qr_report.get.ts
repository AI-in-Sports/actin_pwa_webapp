import {defineEventHandler, getCookie, setCookie} from "h3"

export default defineEventHandler((event) => {
    const user = getCookie(event, 'user')

    if (user)
        return {
            "res": "cookie found: " + user
        }

    else
    {
        setCookie(event, 'user', "new user")
        return {
            "res": "new user created"
        }
    }
})
