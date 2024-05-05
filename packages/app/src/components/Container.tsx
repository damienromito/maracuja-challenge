import styled from "styled-components"

const Container = styled.div<{ centering?: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 220px;
  padding: 8px 16px;

  ${({ centering }: any) =>
    centering &&
    `
    justify-content: center;
    align-items: center;
  `}
`

export default Container
