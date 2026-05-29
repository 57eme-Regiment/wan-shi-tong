import ms from "ms"

export const sec = (time: ms.StringValue) => ms(time) / 1000
export const min = (time: ms.StringValue) => ms(time) / 60000
