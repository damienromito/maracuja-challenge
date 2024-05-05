import Autocomplete from "downshift"
import React from "react"
import { Cell, Container, HelpLink, NavBar, Title2 } from "../../components"
import { useCurrentChallenge } from "../../contexts"
import styled from "styled-components"
import { IonPage, IonContent } from "@ionic/react"
import { useHistory, useLocation } from "react-router-dom"
import { ROUTES } from "../../constants"
import { normalizeString } from "../../utils/helpers"

const HighlightContainer = styled(Cell)`
  cursor: pointer;
`
const category = {
  filterName: "tribe",
}

const SignUpLeaguePicker = () => {
  const history = useHistory()
  const location = useLocation<any>()
  const { currentChallenge } = useCurrentChallenge()
  // if(currentChallenge.ligues.onboarding === "random"){
  //   history.push(ROUTES.SIGN_UP_CLUBPICKER)
  // }

  const handleSelect = (filter) => {
    const state = location.state || {}
    state.filters = { tribe: [filter] }
    history.push(ROUTES.SIGN_UP_CLUBPICKER, state)
  }

  return (
    <IonPage>
      <NavBar
        // leftIcon='back' leftAction={() => history.goBack()}
        title="Inscription au challenge"
        rightIcon="close"
        rightAction={() => history.goBack()}
      />
      <IonContent>
        <Container>
          <br />
          <Title2>Rejoins ta ligue :</Title2>
          <br />
          {/* @ts-ignore */}
          <Autocomplete itemToString={(i) => (i ? i.name : "")} onChange={(item) => handleSelect(item)} defaultIsOpen>
            {(props) => (
              <div>
                <input placeholder="Entre le nom de ta ligue" data-test="input-league" {...props.getInputProps()} />
                <div {...props.getMenuProps()}>
                  <Results
                    {...props}
                    results={currentChallenge.audience.filters.tribe.filter(
                      (item) =>
                        !props.inputValue || normalizeString(item.name).includes(normalizeString(props.inputValue))
                    )}
                  />
                </div>
              </div>
            )}
          </Autocomplete>
        </Container>
      </IonContent>
    </IonPage>
  )
}

export default SignUpLeaguePicker

const Results = (props) => {
  return (
    <>
      {props.results.map((item, index) => (
        <HighlightContainer
          key={item.id}
          data-test={`item-league-${index}`}
          {...props.getItemProps({
            item,
            index,
            className: props.highlightedIndex === index && "active",
          })}
        >
          {item.name}
        </HighlightContainer>
      ))}
      <br />
      <HelpLink
        label="signup-league-picker"
        email="bonjour@maracuja.ac"
        subject="Maracuja, je ne trouve pas ma ligue !"
        footer={`Recherche : ${props.inputValue}`}
      >
        Aide : Maracuja, je ne trouve pas ma ligue !
      </HelpLink>
      <br /> <br />
    </>
  )
}
