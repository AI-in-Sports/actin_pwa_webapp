import {JalaaliDateObject} from "jalaali-js";

export const convertToPersianNumber = (text: string) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
    const englishDigits = '0123456789'

    let result = ''
    for (let i = 0; i < text.length; i++) {
        const index = englishDigits.indexOf(text[i])
        result += index !== -1 ? persianDigits[index] : text[i]
    }

    return result
}

export const convertJalaliToString = (date: JalaaliDateObject) => {
    const year = convertToPersianNumber(date.jy.toString())
    const month = convertToPersianNumber(date.jm < 10 ? '0' + date.jm : date.jm.toString())
    const day = convertToPersianNumber(date.jd < 10 ? '0' + date.jd : date.jd.toString())

    return `${year}/${month}/${day}`
}