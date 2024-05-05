import { Title1, ClubAvatar, Icon } from "@maracuja/shared/components"
import { ROLES } from "@maracuja/shared/constants"
import React from "react"
// import { useApp } from '../../contexts'
import PlayerCardPatterndot from "../../images/player-card-patterndot.svg"
import Avatar from "../Avatar"
import PlayerCardStyle from "./style/PlayerCardStyle"
import Text3 from "../Text3"
import PlaceholderPlayerAvatar from "@maracuja/shared/images/placeholders/placeholder-player-avatar.png"
import styled from "styled-components"
import { useHistory, generatePath } from "react-router-dom"
import { ROUTES } from "../../constants"

const defaultColors = { primary: "#FD4E26", secondary: "#FEDB41" }

interface PlayerCardProps {
  teamLogoUrl?: any
  teamName?: any
  player?: any
  playerNumber?: any
  challengeImage?: any
  challengePlayersAvatarWithoutBackground?: any
  removeBackground?: any
  colors?: any
  avatarUrl?: any
  playerCurrentScore?: any
}
export default ({
  // player, team, challenge, removeBackground, colors, image, preview
  // team.logo['400']
  // challenge = playersAvatarWithoutBackground
  // playerUsername,
  teamLogoUrl,
  teamName,
  player,
  playerNumber,
  challengeImage,
  challengePlayersAvatarWithoutBackground,
  removeBackground,
  colors = defaultColors,
  avatarUrl,
  playerCurrentScore,
}: // preview,
PlayerCardProps) => {
  playerNumber = player.number ? player.number : 10
  avatarUrl = avatarUrl || PlaceholderPlayerAvatar

  return (
    <PlayerCardStyle>
      <PlayerCardBg colors={colors} />
      <PlayerCardOutline colors={colors} />
      <img className="bg" src={PlayerCardPatterndot} />
      <div className="content">
        <span className="header-team-name">{teamName}</span>
        <div className="bar">
          <div className="left-side-bar">
            <div>
              <ClubAvatar logo={teamLogoUrl} size={40} />
            </div>
            {player.roles?.includes(ROLES.CAPTAIN) ? (
              <div className="micro-cap">
                <span className="icon icon-cap cap" style={{ color: colors.secondary }} />
                <span className="number">{playerNumber}</span>
              </div>
            ) : (
              <div className="micro-shirt">
                <span className="icon icon-shirt shirt" style={{ color: colors.secondary }} />
                <span className="number">{playerNumber}</span>
              </div>
            )}
          </div>
          <div className="player-avatar-container">
            {challengePlayersAvatarWithoutBackground && !removeBackground && (
              <div className="player-avatar-bg">
                <ClubAvatar logo={teamLogoUrl} size={140} />
              </div>
            )}
            {challengePlayersAvatarWithoutBackground && !removeBackground ? (
              <img alt="Player avatar" className="player-avatar" src={avatarUrl} />
            ) : (
              <Avatar image={avatarUrl} size={150} />
            )}
          </div>
          <div className="right-side-bar">
            <span style={{ color: colors.secondary }}>{teamName}</span>
          </div>
          <div className="bottom-bar">
            <Title1>{player.username}</Title1>
            {playerCurrentScore !== null && <PointsInfo score={playerCurrentScore} player={player} />}
          </div>
        </div>
        <div className="challenge-logo">
          <img alt="Challenge logo" src={challengeImage} />
        </div>
      </div>
    </PlayerCardStyle>
  )
}

export const PlayerCardBg = ({ colors = defaultColors }) => {
  return (
    <>
      <div className="bg">
        <svg width="297" height="468" viewBox="0 0 297 468" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M296.384 393.946C290.656 409.323 278.687 411.95 256.253 419.268C215.775 431.47 174.092 444.639 148.603
          467.144C123.125 444.639 81.4427 431.47 40.9652 419.268C18.5308 411.95 6.56175 409.323 0.833801 393.946C1.31113
          331.48 1.63333 89.284 0.833801 61.657C21.7527 60.9167 44.3423 42.2082 57.8865 31.8809C80.2017 16.4436 92.3497
          6.70133 114.104 6.39092C118.006 12.253 126.598 25.4218 148.603 0.660156C170.608 25.4218 179.212 12.253 183.114
          6.39092C204.88 6.70133 217.016 16.4556 239.319 31.8928C252.875 42.2201 275.477 60.9287 296.384 61.6689C295.596
          89.284 295.895 331.48 296.384 393.946Z"
            fill={colors.primary}
          />
        </svg>
      </div>
    </>
  )
}

export const PlayerCardOutline = ({ colors = defaultColors }) => {
  return (
    <>
      <div className="bg">
        <svg width="300" height="473" viewBox="0 0 300 473" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={colors.secondary}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M149.994 472.546L148.81 471.494C124.522 450.042 85.8664 437.24 41.5633 423.888C39.673 423.266 37.8903 422.692 36.1675 422.142C17.1924 416.052 5.73081 412.367 0.155533 397.424L0.0358923 397.113V396.778C0.502492 335.534 0.825523 91.4777 0.0358923 63.8526L0 62.0938L1.78265 62.034C20.5261 61.3761 41.0156 45.6025 54.583 35.1578L54.583 35.1578L54.5922 35.1507C55.7647 34.2414 56.8893 33.38 57.9541 32.5664L59.2552 31.6625L59.2589 31.6599C60.6183 30.7155 61.9151 29.8146 63.1705 28.9413L63.2171 28.9089C82.214 15.6827 94.7726 6.93907 115.382 6.65217L116.363 6.6402L116.901 7.45376C118.959 10.5405 121.974 15.0629 127.131 15.4338C132.885 15.8286 140.1 11.1507 148.666 1.51956L149.994 0.00012207L151.334 1.5076C159.9 11.1387 167.151 15.8167 172.869 15.4219C178.005 15.0644 181.017 10.565 183.026 7.56192L183.051 7.52555L183.589 6.71199L184.618 6.65217C205.256 6.95127 217.819 15.697 236.83 28.9533C237.256 29.2499 237.686 29.5498 238.121 29.8524C239.368 30.7215 240.649 31.6134 241.962 32.5186C243.111 33.38 244.235 34.2534 245.42 35.1746L245.447 35.1957L245.447 35.1958C259.015 45.6287 279.494 61.3764 298.217 62.034L300 62.0938L299.952 63.8765C299.151 91.9802 299.474 335.833 299.952 396.802V397.137L299.833 397.448C294.257 412.391 282.808 416.076 263.821 422.166C262.11 422.716 260.327 423.29 258.473 423.888C214.134 437.252 175.478 450.054 151.178 471.506L149.994 472.546ZM3.63709 396.491C8.63809 409.543 18.2453 412.642 37.2682 418.744C38.991 419.294 40.7737 419.869 42.6401 420.479C86.6082 433.735 125.121 446.477 150.006 467.785C174.891 446.477 213.404 433.735 257.42 420.467C259.238 419.869 261.033 419.294 262.756 418.744L262.759 418.743C281.768 412.642 291.386 409.555 296.387 396.491C295.92 336.072 295.597 100.618 296.351 65.5156C277.012 63.9618 256.826 48.438 243.307 38.0413L243.307 38.0412L243.266 38.0101C242.418 37.3586 241.6 36.7317 240.808 36.125L239.88 35.4139L239.874 35.4098L239.871 35.4077C238.164 34.2253 236.456 33.043 234.796 31.8845C215.976 18.7838 204.491 10.7917 185.539 10.2534C183.206 13.699 179.509 18.5565 173.121 18.9991C166.445 19.4538 158.883 15.0031 149.994 5.37201C141.105 15.0031 133.507 19.4657 126.867 18.9991C120.443 18.5565 116.746 13.6512 114.449 10.2534C95.5095 10.7917 84.0359 18.7838 65.2283 31.8845C63.5653 33.045 61.8425 34.2414 60.0598 35.4737C59.0668 36.2394 57.9422 37.1008 56.7697 37.9981C43.2503 48.4069 23.0309 63.9722 3.67298 65.5275C4.41476 100.271 4.10369 335.821 3.63709 396.491ZM148.881 461.563L149.994 462.437L151.071 461.54C176.59 441.404 213.811 429.165 256.295 416.363C257.285 416.042 258.254 415.731 259.202 415.426C260.019 415.164 260.821 414.907 261.607 414.652C280.463 408.598 288.287 405.727 292.594 395.498L292.738 395.151V394.78C292.307 337.412 291.984 117.595 292.63 69.5595L292.654 68.052L291.171 67.7768C272.402 64.3025 253.598 49.8434 241.119 40.2478L241.041 40.1876L240.742 39.9603C240.377 39.6815 240.017 39.4059 239.659 39.1316C239.019 38.6407 238.384 38.1544 237.739 37.6632C236.628 36.8923 235.546 36.1386 234.489 35.4021C234.02 35.0756 233.556 34.7526 233.097 34.4328L232.714 34.1577L232.688 34.1394C215.116 21.8991 204.494 14.5001 188.303 13.3162L187.358 13.2444L186.772 13.9982C182.56 19.3581 177.799 21.9543 172.199 21.9543C165.763 21.9543 158.907 18.4009 151.238 11.0909L149.994 9.90643L148.75 11.0909C141.081 18.4009 134.225 21.9543 127.789 21.9543C122.154 21.9543 117.38 19.3581 113.216 14.0101L112.63 13.2564L111.673 13.3282C95.4759 14.5244 84.8644 21.9163 67.2815 34.1645L67.2742 34.1696C65.6591 35.3062 63.9841 36.4787 62.1775 37.723C61.4911 38.2418 60.7887 38.7819 60.0632 39.3398C59.7012 39.6181 59.3335 39.9009 58.9592 40.1876C46.4806 49.7948 27.6132 64.3072 8.80564 67.7888L7.32209 68.064L7.34602 69.5714C7.98012 117.368 7.65709 337.28 7.22638 394.816V395.187L7.36995 395.522C11.677 405.751 19.5016 408.622 38.357 414.676C40.0559 415.215 41.8266 415.789 43.7049 416.399C86.1536 429.189 123.374 441.416 148.881 461.563ZM39.4577 411.254C21.1646 405.38 14.5125 402.868 10.8276 394.457C11.2463 336.933 11.5694 121.639 10.9472 71.0311C30.0898 66.9393 48.7179 52.6063 61.1486 43.035C61.759 42.5625 62.3587 42.1043 62.9317 41.6664C63.4031 41.3062 63.8566 40.9597 64.2832 40.6303C66.03 39.4219 67.7049 38.2614 69.3321 37.1248C86.6202 25.0769 96.3111 18.3292 111.003 17.0011C115.717 22.6841 121.364 25.5674 127.801 25.5674C134.836 25.5674 142.11 22.0739 149.994 14.8715C157.878 22.062 165.153 25.5674 172.199 25.5674C178.6 25.5674 184.235 22.6841 188.985 17.0011C203.689 18.3292 213.38 25.0769 230.68 37.1367L231.063 37.3999C231.426 37.6525 231.792 37.908 232.161 38.165C233.312 38.9671 234.485 39.7851 235.645 40.5824C236.215 41.0134 236.798 41.4622 237.397 41.9235C237.78 42.2176 238.168 42.5168 238.564 42.8197L238.863 43.047C251.282 52.6063 269.898 66.9274 289.041 71.0191C288.431 121.855 288.754 337.077 289.173 394.457C285.488 402.868 278.836 405.38 260.542 411.254C258.832 411.805 257.061 412.379 255.254 412.965C213.045 425.683 175.956 437.875 149.994 457.89C124.044 437.875 86.9432 425.683 44.7817 412.977C43.5692 412.576 42.3826 412.195 41.2287 411.825C40.6292 411.632 40.0386 411.443 39.4577 411.254Z"
          />
        </svg>
      </div>
    </>
  )
}

const PointsInfo = ({ score, player }) => {
  const history = useHistory()
  const handleShowPointsDetail = () => {
    history.push(generatePath(ROUTES.PLAYER_CALENDAR, { playerId: player.id }), { player, score })
  }

  return (
    <PointsInfoWrapper onClick={handleShowPointsDetail}>
      <Text3>{score} POINTS</Text3>
      <Icon name="arrowRight" width={15} />
    </PointsInfoWrapper>
  )
}
const PointsInfoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-direction: row;
  .icon {
    padding: 5px 0 0 5px;
  }
`