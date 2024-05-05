import { Icon, Title1 } from "@maracuja/shared/components"
import { teamColorsPanel } from "@maracuja/shared/components/TeamColorsPanel"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Field, useFormikContext } from "formik"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import PlayerCardViewer from "../../../components/PlayerCardViewer"

export default () => {
  const { currentTeam, currentPlayer } = useCurrentChallenge()
  const formik = useFormikContext<any>()

  const [teamColors, setTeamColors] = useState<any>(null)
  const [indexActiveColors, setIndexActiveColors] = useState<any>(null)

  useEffect(() => {
    if (currentTeam) {
      const colors = currentTeam.colors || { primary: "#FD4E26", secondary: "#EABD7B" }
      setTeamColors({ ...colors })
      setIndexActiveColors({
        primary: teamColorsPanel.primary.indexOf(colors.primary),
        secondary: teamColorsPanel.secondary.indexOf(colors.secondary),
      })
    }
  }, [currentTeam])

  useEffect(() => {
    if (indexActiveColors) {
      setTeamColors({
        primary: teamColorsPanel.primary[indexActiveColors.primary],
        secondary: teamColorsPanel.secondary[indexActiveColors.secondary],
      })
    }
  }, [indexActiveColors])

  useEffect(() => {
    if (teamColors) {
      formik.setFieldValue("colors", teamColors)
      currentTeam.colors = teamColors
    }
  }, [teamColors])

  const handleClickNextPrimaryColor = () => {
    let newPrimaryIndex = indexActiveColors.primary + 1
    if (newPrimaryIndex > teamColorsPanel.primary.length - 1) {
      newPrimaryIndex = 0
    }
    setIndexActiveColors({
      ...indexActiveColors,
      primary: newPrimaryIndex,
    })
  }

  const handleClickNextSecondaryColor = () => {
    let newSecondaryIndex = indexActiveColors.secondary + 1
    if (newSecondaryIndex > teamColorsPanel.secondary.length - 1) {
      newSecondaryIndex = 0
    }
    setIndexActiveColors({
      ...indexActiveColors,
      secondary: newSecondaryIndex,
    })
  }

  const handleClickPreviousPrimaryColor = () => {
    let newPrimaryIndex = indexActiveColors.primary - 1
    if (newPrimaryIndex < 0) {
      newPrimaryIndex = teamColorsPanel.primary.length - 1
    }
    setIndexActiveColors({
      ...indexActiveColors,
      primary: newPrimaryIndex,
    })
  }

  const handleClickPreviousSecondaryColor = () => {
    let newSecondaryIndex = indexActiveColors.secondary - 1
    if (newSecondaryIndex < 0) {
      newSecondaryIndex = teamColorsPanel.secondary.length - 1
    }
    setIndexActiveColors({
      ...indexActiveColors,
      secondary: newSecondaryIndex,
    })
  }

  return (
    <>
      <Title1>Des couleurs à défendre</Title1>

      <Field hidden id="color" type="text" name="color" />
      <PlayerCardViewer preview team={currentTeam} player={currentPlayer} />
      {currentTeam && teamColors && (
        <ColorSelectors>
          <ColorSwitch
            color={teamColors.primary}
            onClickPrev={handleClickPreviousPrimaryColor}
            onClickNext={handleClickNextPrimaryColor}
          />
          <ColorSwitch
            color={teamColors.secondary}
            onClickPrev={handleClickPreviousSecondaryColor}
            onClickNext={handleClickNextSecondaryColor}
          />
        </ColorSelectors>
      )}
      <br />
    </>
  )
}

const ColorSwitch = ({ onClickNext, onClickPrev, color }) => {
  return (
    <ColorSwitchContainer>
      <div onClick={onClickPrev} className="arrow">
        <Icon name="arrowLeft" />
      </div>
      <ColorPick color={color} onClick={onClickNext} />
      <div onClick={onClickNext} className="arrow">
        <Icon name="arrowRight" />
      </div>
    </ColorSwitchContainer>
  )
}

const ColorSelectors = styled.div`
  display: flex;
  align-content: space-around;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
`

const ColorSwitchContainer = styled.div`
  display: flex;
  align-content: space-around;
  justify-content: space-around;
  align-items: center;
  .arrow {
    width: 50px;
  }
`

const ColorPick = styled.div`
  background: ${(props) => props.color};
  width: 26px;
  height: 26px;
  border-radius: 26px;
`
