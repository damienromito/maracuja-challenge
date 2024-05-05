import styled from "styled-components"

const Cell: any = styled.div`
  background-color: #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  min-height: 75px;
  padding: 0px 15px;
`
export default Cell

Cell.Line = styled.div`
  display: flex;
`

Cell.Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

Cell.Actions = styled.div`
  display: flex;
  justify-content: center;
`

Cell.Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`

Cell.Tag = styled.span`
  color: #2e32b4;
  font-size: 15px;
  margin-left: 5px;
`

Cell.Subtitle = styled.span`
  font-size: 15px;
  text-transform: capitalize;
`
