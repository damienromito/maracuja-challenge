import { IonSlide, IonSlides } from "@ionic/react"
import { Button } from "@maracuja/shared/components"
import React from "react"
import styled from "styled-components"
import { ChallengeInfo } from "."
import { nanoid } from "nanoid"
import { useCurrentChallenge } from "@maracuja/shared/contexts"

const ChallengesContainer = styled(IonSlides)`
  margin: 15px 0 0px 0;
  /* width: 100%;
  flex-wrap: wrap;
  align-self: center;
  justify-content: center; */

  h2 {
    margin-bottom: 10px;
  }
`

interface ChallengesSliderProps {
  challenges?: any
  onSelectChallenge?: any
}
export default ({ challenges, onSelectChallenge }: ChallengesSliderProps) => {
  const { setCurrentChallengeById } = useCurrentChallenge()

  const handleSelectChallenge = (challenge: any, isAvailable?: boolean) => {
    if (isAvailable) {
      setCurrentChallengeById(challenge.id)
      onSelectChallenge && onSelectChallenge()
    }
  }

  return (
    <ChallengesContainer options={swiperOptions} key={nanoid(4)}>
      {challenges?.map((challenge) => {
        if (challenge.hidden) return null
        const isAvailable = challenge.endDate > new Date() && challenge.startDate < new Date()
        return (
          <ChallengeThumb key={challenge.id} onClick={() => handleSelectChallenge(challenge, isAvailable)}>
            <ChallengeInfo challenge={challenge} small />
            {isAvailable && (
              <Button onClick={() => handleSelectChallenge(challenge)} small>
                Rejoindre
              </Button>
            )}
          </ChallengeThumb>
        )
      })}
    </ChallengesContainer>
  )
}

const ChallengeThumb = styled(IonSlide)`
  cursor: pointer;
  flex-direction: column;
`

const swiperOptions = {
  spaceBetween: 15,
  initialSlide: 0,
  slidesPerView: 2,
  centeredSlides: true,
  speed: 400,
}
