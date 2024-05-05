import styled from 'styled-components'

const PlayerCardStyle = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-family: Montserrat;
  height: 472px;
  position: relative;
  width: 300px;

  .bg {
    position: absolute;
    width: 100%;
    z-index: 1;
  }

  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    z-index: 2;

    .header-team-name{
      max-width: 50%;
      max-height: 30px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-align: center;
      overflow: hidden;
      font-size: 12px;
      font-weight: 500;
      line-height: 15px;
      margin-top: 30px;
    }

    .bar {
      align-items: center;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      padding: 20px;
      width: 100%;

      .left-side-bar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 40px;
        height: 80px;

        .micro-cap {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 15px;
          position: relative;

          .cap{
            color: #FEDB41;
            font-size: 40px;
          }

          .number {
            color: black;
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 10px;
            margin-left: 5px;
            position: absolute;
            text-align: center;
          }
        }

        .micro-shirt {
          align-items: center;
          display: flex;
          flex-direction: column;
          height: 175px;
          justify-content: center;
          margin-top: 15px;
          position: relative;

          .shirt{
            color: #FEDB41;
            font-size: 40px;
            position: absolute;
          }

          .number {
            color: black;
            font-size: 9.60784px;
            font-weight: bold;
            line-height: 12px;
            position: absolute;
            top: 0px;
          }
        }
      }

      .player-avatar-container {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 180px;
        width: 180px;
        height: 180px;

        .player-avatar-bg {
          filter: opacity(0.70);
          position: absolute;
          top: 60px;
        }

        .player-avatar {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          align-self: flex-end;
          z-index: 3;
        }
      }

      .right-side-bar {
        align-items: center;
        display: flex;
        justify-content: center;

        span {
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          font-size: 19px;
          font-weight: 900;
          max-height: 50px;
          line-height: 23px;
          margin-right: -40px;
          overflow: hidden;
          position: absolute;
          text-align: center;
          transform: rotate(-90deg);
          width: 170px;
        }
        span::after {
          align-items: center;
          display: flex;
          justify-content: center;
        }
      }

      .bottom-bar {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        width: 100%;

        h1 {
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          background: rgba(0, 0, 0, 0.25);
          display: -webkit-box;
          overflow: hidden;
          width: 276px;
        }

      }
    }

    .challenge-logo {
      width: 64px;
      top: 380px;
      position: absolute;
    }
  }


`
export default PlayerCardStyle
