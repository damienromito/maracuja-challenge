import styled from 'styled-components'

export default styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;

  .player-card-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 232px;
    width: 148px;

    .bg {
      position: absolute;
      height: 232px;
      width: 148px;
      z-index: 1;
    }

    .header-team-name{
      position: absolute;
      width: fit-content;
      top: 16px;
      font-weight: 500;
      font-size: 5.90099px;
      line-height: 7px;
      color: #FFFFFF;
      z-index: 2;

      font-family: Montserrat;
    }

    .side-team-name {
      position: absolute;
      width: 86px;
      height: 10px;
      top: 68px;
      left: 105px;
      transform: rotate(-90deg);
      font-weight: 900;
      font-size: 9.34323px;
      line-height: 11px;
      color: #FEDB41;
      z-index: 2;

      font-family: Montserrat;
    }

    .player-avatar {
      position: absolute;
      z-index: 2;
      top: 30px;
    }

    .username {
      position: absolute;
      width: 136px;
      background: rgba(0, 0, 0, 0.25);
      z-index: 3;
      top: 120px;
      font-family: Montserrat;
      font-weight: bold;
      font-size: 15.736px;
      line-height: 19px;
    }

    .challenge-logo {
      position: absolute;
      width: 35px;
      height: 35px;
      top: 180px;
      z-index: 2;
    }
  }
`
