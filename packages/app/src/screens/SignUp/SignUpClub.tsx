import { IonContent, IonFooter, IonPage } from "@ionic/react"
import { PLAYER_ROLES } from "@maracuja/shared/constants"
import ROLES from "@maracuja/shared/constants/roles"
import { objectSubset } from "@maracuja/shared/helpers"
import { Club, Team } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import styled from "styled-components"
import * as Yup from "yup"
import {
  Button,
  Container,
  FormikFieldContainer,
  NavBar,
  PlayerCell,
  Spinner,
  TeamHeader,
  Text2,
} from "../../components"
import RadioGroupField from "../../components/RadioGroupField"
import ROUTES from "../../constants/routes"
import { useAuthUser, useCurrentChallenge } from "../../contexts"
import SignUpPickerPopup from "./SignUpPickerPopup"
import SignupSupporterPopup from "./SignupSupporterPopup"

export default () => {
  const history = useHistory()
  const location = useLocation<any>()
  const { authUser } = useAuthUser()
  const { currentChallenge } = useCurrentChallenge()
  const [team, setTeam] = useState(null)
  const [signUpPickerOpened, setSignUpPickerOpened] = useState(false)
  const [supporterPopupIsOpen, setSupporterPopupIsOpen] = useState(false)
  const formSchema = useRef()

  useEffect(() => {
    initTeam()
  }, [])

  useLayoutEffect(() => {
    const yupValues: any = {
      username: Yup.string()
        .min(2, "Trop court !")
        .max(30, "Trop Long !")
        .required("Il te faut un petit nom au moins !"),
    }

    if (isOptinRoleDisplayed) {
      yupValues.optinRole = Yup.string().required("Mais qui es-tu ? 🤔")
    }
    formSchema.current = Yup.object().shape(yupValues)
  }, [])

  const initTeam = async () => {
    let object
    if (location.state?.team) {
      object = location.state.team
    } else if (location.state?.club) {
      object = location.state?.club
    }
    if (!(object instanceof Team) || !(object instanceof Club)) {
      object = new Team(object)
    }
    setTeam(object)
  }

  const onSubmit = (values) => {
    const user = location?.state?.user || {}

    // Roles
    user.roles = user.roles || []
    if (values.optinRole) {
      user.optinRole = values.optinRole
      user.optinRole === ROLES.CAPTAIN && user.roles.push(ROLES.CAPTAIN)
      if (user.optinRole === "supporter" && currentChallenge.referralEnabled) {
        setSupporterPopupIsOpen(true)
        return
      }
    }

    user.email = user.email || location.state.email || authUser?.email || null
    user.username = values.username.trim()
    user.phoneNumber = user.phoneNumber || location.state.phoneNumber || null

    // LOCATION STATE
    location.state.user = user
    location.state.isSigningUp = true
    location.state.club = objectSubset(team, ["id", "zipCode", "name", "logo"])

    // return
    if (authUser) {
      history.push(ROUTES.SIGN_UP__CONFIRM, location.state)
    } else {
      // if (currentChallenge.signUpMethods.length === 1) {
      history.push(ROUTES.SIGN_UP__EMAILPASSWORD, location.state)
      // } else {
      //   setSignUpPickerOpened(true)
      // }
    }
  }

  const isOptinRoleDisplayed = useMemo(() => {
    const diplayed =
      currentChallenge.audience.whitelist === "none" && !location?.state?.user?.roles?.includes(PLAYER_ROLES.REFEREE)
    return diplayed
  }, [])

  return (
    <IonPage>
      {team ? (
        <>
          <IonContent>
            {signUpPickerOpened && (
              <SignUpPickerPopup open={signUpPickerOpened} onClose={() => setSignUpPickerOpened(false)} />
            )}
            <SignupSupporterPopup isOpen={supporterPopupIsOpen} setIsOpen={setSupporterPopupIsOpen} />

            <NavBar leftIcon="back" leftAction={() => history.goBack()} title={team.name} />

            <TeamHeader club={team} />

            {location?.state?.user?.roles?.includes(PLAYER_ROLES.REFEREE) && (
              <RefereeContainer>
                <Text2>Tu as été invité.e par {location.state.user.referer.username}</Text2>
              </RefereeContainer>
            )}
            <UsersContainer>
              {team.players ? (
                <>
                  {Object.keys(team.players)
                    .filter((key) => {
                      return !(team.players[key].roles && team.players[key].roles.includes(ROLES.REFEREE))
                    })
                    .map((key) => {
                      const user = team.players[key]
                      return <PlayerCell key={key} user={user} preview />
                    })}
                </>
              ) : (
                <p className="center">
                  {team.hasDefautName() ? "Crée ton équipe" : `Rejoins ton ${currentChallenge.wording.tribe || "club"}`}
                </p>
              )}
            </UsersContainer>
          </IonContent>

          <BottomContainer>
            <Formik
              initialValues={{ username: authUser?.username || "", optinRole: "" }}
              validationSchema={formSchema.current}
              onSubmit={onSubmit}
            >
              {({ errors, touched }) => {
                return (
                  <Form>
                    <Text2 style={{ marginBottom: 8 }}>
                      C’est sous ce nom que tu apparaitras ; choisis-en un que tes {currentChallenge.wording.friends}{" "}
                      connaissent !{" "}
                    </Text2>
                    <FormikFieldContainer
                      data-test="input-username"
                      type="text"
                      name="username"
                      placeholder={`Entre ton nom de ${currentChallenge.wording.player}`}
                    />

                    {isOptinRoleDisplayed && (
                      <RadioGroupField
                        data-test="radio-role"
                        errors={errors}
                        touched={touched}
                        name="optinRole"
                        label="Je suis"
                        buttons={currentChallenge.optinRoles}
                      />
                    )}

                    <Button type="submit" data-test="button-submit" className="ion-margin-vertical">
                      Rejoins {currentChallenge.wording.theTribe}
                    </Button>
                  </Form>
                )
              }}
            </Formik>
          </BottomContainer>
        </>
      ) : (
        <Spinner />
      )}
    </IonPage>
  )
}

const UsersContainer = styled(Container)`
  padding: 0;
  background: ${(props) => props.theme.primary};
`
const BottomContainer = styled(IonFooter)`
  padding: 15px;
  max-height: 90%;
  background: ${(props) => props.theme.bg.secondary};
`

const RefereeContainer = styled.div`
  background: ${(props) => props.theme.bg.info};
  color: ${(props) => props.theme.text.secondary};
  padding: 3px 15px;
  text-align: center;
`
