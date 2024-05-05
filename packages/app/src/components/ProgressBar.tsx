import styled from "styled-components"

const ProgressBarWrapper = styled.div<{ percent: string }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .total {
    width: 100%;
    height: 14px;
    background: #d8d8d8;
    display: flex;
    align-items: center;
    border-radius: 7.5px;
  }
  .progress {
    width: ${(props) => `${props.percent}%`};
    height: 14px;
    background-color: ${(props) => props.theme.icon.inProgress};
    border-radius: 100px;
    transition: width 0.5s linear;
  }
  span {
    position: absolute;
    font-size: 12px;
    margin: 0 0 1px 5px;
  }
`

export default ({ percent, style = undefined, text = undefined }) => {
  return (
    <ProgressBarWrapper percent={percent} style={style}>
      <div className="total">
        {text && <span>{text}</span>}
        <div className="progress" />
      </div>
    </ProgressBarWrapper>
  )
}
