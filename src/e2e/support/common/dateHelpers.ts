import dayjs from 'dayjs'

export const todayMinus = (days: number) => dayjs(new Date()).subtract(days, 'day').toDate()
