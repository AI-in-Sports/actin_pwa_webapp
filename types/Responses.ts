import type {JalaaliDateObject} from "jalaali-js";

export type Reservation = {
    name: string,
    date: Date,
    time: string,
    status: "OK" | "PENDING"
}

export type Report = {
    testId: string,
    date: string | Date | JalaaliDateObject
}
