import { CSSProperties } from "react"
import Month from "./Month"

interface CalendarProps {
  startDate?: any
  endDate?: any
  dayRender?: any
  monthHeaderRender?: any
  className?: any
  style?: any
}

export default ({ startDate, endDate, dayRender, monthHeaderRender, className, style }: CalendarProps) => {
  const firstYear = startDate.getUTCFullYear()
  const firstMonth = startDate.getMonth()
  const lastMonth = endDate.getMonth()
  const lastYear = endDate.getUTCFullYear()
  const render: any = []

  const loadMonth = (month: number, year: number) => {
    const monthHeader = monthHeaderRender({ monthNumber: month })
    render.push(monthHeader)

    /* @ts-ignore */
    const monthCalendar = <Month key={`month-${month}`} year={year} month={month} dayRender={dayRender} />
    render.push(monthCalendar)

    if (year < lastYear) {
      if (month === 11) loadMonth(0, year + 1)
      else loadMonth(month + 1, year)
    } else if (month < lastMonth) {
      loadMonth(month + 1, year)
    }
  }

  loadMonth(firstMonth, firstYear)
  return (
    <div className={className} style={style}>
      {render}
    </div>
  )
}
