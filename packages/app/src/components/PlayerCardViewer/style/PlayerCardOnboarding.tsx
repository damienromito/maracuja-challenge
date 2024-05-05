import styled from "styled-components"

const PlayerCardOnboarding = styled.div<{ isPlaceholder?: boolean }>`
  justify-content: space-around;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;

  .player-card__content {
    transform: scale(0.5);
    transform-origin: top center;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: ${(props) => (props.isPlaceholder ? "grayscale(1)" : "none")};
  }
`
export default PlayerCardOnboarding
