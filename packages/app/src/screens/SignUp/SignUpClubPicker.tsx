import { IonContent, IonPage } from "@ionic/react"
import { Club, Team } from "@maracuja/shared/models"
import algoliasearch from "algoliasearch/lite"
import Autocomplete from "downshift"
import React, { useEffect, useState } from "react"
import { Configure, connectAutoComplete, Highlight, InstantSearch } from "react-instantsearch-dom"
import { useHistory, useLocation } from "react-router-dom"
import styled from "styled-components"
import { Badge, Cell, Container, HelpLink, NavBar, Spinner, Text2, Text3, Title2 } from "../../components"
import { useApi, useApp, useCurrentChallenge } from "../../contexts"
import { audienceFiltersToAlgoliaFacets } from "../../utils/algolia"

const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY)

const HighlightContainer = styled(Cell)`
  cursor: pointer;
  flex-direction: column;
  align-items: start;
  .ais-Highlight {
    margin: 4px 0;
  }
  .subText {
    color: ${(props) => props.theme.text.tertiary};
    text-transform: uppercase;
  }
  &.active {
    background: ${(props) => props.theme.bg.active};
  }
`

const SignUpClubPicker = () => {
  const history = useHistory()
  const location = useLocation<any>()
  const { currentChallenge } = useCurrentChallenge()
  const { openError } = useApp()
  const api = useApi()
  const algoliaClubIndex = process.env.REACT_APP_ENV === "production" ? "clubs" : "dev_clubs"
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(null)

  useEffect(() => {
    if (!filters) {
      initFilters()
    }
  }, [])

  const initFilters = () => {
    const challengeFilterList = { ...currentChallenge.audience.filters }
    const locationFilters = location?.state?.filters
    if (locationFilters) {
      Object.keys(locationFilters).forEach((key) => {
        challengeFilterList[key] = locationFilters[key]
      })
    }
    const filterArray = audienceFiltersToAlgoliaFacets(challengeFilterList)
    setFilters(filterArray) // [["tribeId: handball","tribeId: equitation"],["departmentCode: 79"]])
  }

  const handleSelect = async (club) => {
    setLoading(true)
    const states = location.state || {}
    try {
      const team = await Team.fetch({ challengeId: currentChallenge.id, id: club.id })
      if (team) {
        states.team = team
      } else {
        console.log("Club not subscribe to currentChallenge ", club)
        states.club = new Club(club)
      }
    } catch (error) {
      openError(error)
      console.log("Error:", error)
      return
    }

    history.push(`/signup-clubs/${club.id}`, states)
    setLoading(false)
  }

  return (
    <IonPage>
      {loading && <Spinner />}
      <NavBar leftIcon="back" leftAction={() => history.goBack()} title="Inscription au challenge" />
      <IonContent>
        {filters ? (
          <>
            <Container>
              <br />
              <Title2>Rejoins ton {currentChallenge.wording.tribe || "club"} :</Title2>
              <br />
              {currentChallenge.audience.searchPickerHelp && (
                <Text2 style={{ marginBottom: 5 }}>ℹ {currentChallenge.audience.searchPickerHelp}</Text2>
              )}
              <InstantSearch searchClient={searchClient} indexName={algoliaClubIndex} refresh>
                <Configure
                  // facetFilters={[['tribeId: boxe', 'tribeId: equitation']]}
                  facetFilters={filters}
                />
                <AutoCompleteWithData
                  handleSelect={handleSelect}
                  filters={filters}
                  filtersInfo={location.state?.filters?.tribe[0]?.name}
                />
              </InstantSearch>
            </Container>
          </>
        ) : null}
      </IonContent>
    </IonPage>
  )
}

function RawAutoComplete({ refine, hits, handleSelect, filters, filtersInfo }) {
  const { currentChallenge } = useCurrentChallenge()

  return (
    //@ts-ignore
    <Autocomplete
      itemToString={(item) => (item ? item.name : "")}
      onChange={(item) => handleSelect(item)}
      defaultIsOpen
    >
      {({ getInputProps, getItemProps, highlightedIndex, inputValue, isOpen }) => (
        <div>
          <input
            data-test="input-club"
            placeholder={`Entre le nom de ton ${currentChallenge.wording.tribe || "club"}`}
            {...getInputProps({
              onChange(e) {
                refine(e.target.value)
              },
            })}
          />
          {isOpen && (
            <div>
              {hits.map((item, index) => (
                <HighlightContainer
                  key={item.objectID}
                  data-test={`item-club-${index}`}
                  {...getItemProps({
                    item,
                    index,
                    className: highlightedIndex === index && "active",
                  })}
                >
                  <Highlight attribute="name" hit={item} tagName="strong" />
                  {(item.city || item.zipCode) && (
                    <Text3 className="subText">
                      {item.city ? item.city + " " : ""} {item.zipCode || ""}
                    </Text3>
                  )}
                  {currentChallenge.audience.clubCellPropertyInBadge &&
                    item[currentChallenge.audience.clubCellPropertyInBadge] && (
                      <Badge style={{ marginBottom: 2 }}>
                        {item[currentChallenge.audience.clubCellPropertyInBadge].name}
                      </Badge>
                    )}
                </HighlightContainer>
              ))}
              <br />
              <p>
                <strong>Tu ne trouves pas ton {currentChallenge.wording.tribe || "club"} ? </strong>
              </p>
              {currentChallenge.audience.searchPickerHelp && <p>{currentChallenge.audience.searchPickerHelp}</p>}
              <br />
              <HelpLink
                label="signup-club-picker"
                email="bonjour@maracuja.ac"
                subject={`Maracuja, je ne trouve pas mon ${currentChallenge.wording.tribe} !`}
                footer={`Recherche : ${inputValue} / ${filtersInfo ? "filters : " + filtersInfo : ""}`}
              >
                Maracuja, je ne trouve vraiment pas mon {currentChallenge.wording.tribe} !
              </HelpLink>
              <br /> <br />
            </div>
          )}
        </div>
      )}
    </Autocomplete>
  )
}
const AutoCompleteWithData = connectAutoComplete(RawAutoComplete)

export default SignUpClubPicker
