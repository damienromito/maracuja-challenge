import React from "react"
import styled from "styled-components"
import Day from "./Day"

interface CalendarMonthProps {
  year: number
  month: number
  dayRender?: (date: Date) => JSX.Element
}
export default ({ year, month, dayRender }: CalendarMonthProps) => {
  const render: any[] = []
  const date = new Date(year, month, 1)

  const displayWeek = (index: number) => {
    const days = []
    for (let i = 1; i <= 7; i++) {
      const dayNumber = i === 7 ? 0 : i
      if (date.getDay() === dayNumber && date.getMonth() === month) {
        const currentDate = new Date(date)
        // Days.push(<div>X</div>)
        days.push(<Day key={`day-${index}${i}`} date={currentDate} dayRender={dayRender} />)
        date.setDate(date.getDate() + 1)
      } else {
        days.push(<Day key={`day-${index}${i}`}>--</Day>)
      }
    }

    render.push(<Week key={`week-${month}-${index}`}>{days}</Week>)
    // render.push(<Week key={`week-${month}-${index}`} date={date} month={month} dayComponent={dayComponent} />)
  }

  let index = 0
  while (date.getMonth() === month) {
    displayWeek(index)
    index++
  }

  return render
}

const Week = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`
