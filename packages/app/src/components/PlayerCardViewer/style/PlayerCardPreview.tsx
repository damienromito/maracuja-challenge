import styled from "styled-components"

export default styled.div<{ isPlaceholder: boolean }>`
  transform: scale(0.4);
  transform-origin: top center;
  margin-bottom: -280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  filter: ${(props) => (props.isPlaceholder ? "grayscale(1)" : "none")};
`
