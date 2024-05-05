import styled from "styled-components"

const Container = styled.div`
  display: flex;
  position: relative;
  .question-set-icon {
    margin-right: 0px;
  }
`

interface CalendarWeekDaysProps {
  style?: any
}
export default ({ style }: CalendarWeekDaysProps) => {
  const weekDays = ["L", "M", "M", "J", "V", "S", "D"]
  let currentDay = new Date().getDay()
  if (currentDay === 0) currentDay = 7
  return (
    <Container style={style}>
      {weekDays.map((dayLetter, index) => {
        return (
          <Day key={`day-${index}`} className={`${currentDay === index + 1 ? "current" : ""} day`}>
            {dayLetter}
          </Day>
        )
      })}
    </Container>
  )
}

const Day = styled.div`
  flex: 1;
  height: 15px;
  text-align: center;
  font-size: 11px;
  color: ${(props) => props.theme.text.tertiary};
  &.current {
    color: white;
    font-weight: bold;
  }
`
