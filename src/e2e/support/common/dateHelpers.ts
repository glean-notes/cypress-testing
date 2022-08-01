import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

export const formattedDate = (date: dayjs.ConfigType): string => {
  dayjs.extend(advancedFormat)
  return dayjs(date).format('MMMM Do YYYY')
}

export const todayMinus = (days: number) => dayjs(new Date()).subtract(days, 'day').toDate()

export const todayPlus = (days: number) => dayjs(new Date()).add(days, 'day').toDate()
export const todayPlusMonth = (months: number) => dayjs(new Date()).add(months, 'month').toDate()
