import { ErrorLabel } from "@maracuja/shared/components"
import { MARACUJA_TEAM_ID } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { Team, WhitelistMember } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { checkboxColumn, DataSheetGrid, keyColumn, textColumn } from "react-datasheet-grid"
import "react-datasheet-grid/dist/style.css"
import { Tab, Tabs } from "react-materialize"
import styled from "styled-components"
import { USER_ROLES } from "../../constants"
import { useDashboard } from "../../contexts"
import { sortArrayByProperty } from "../../utils/helpers"
import selectColumn from "./selectColumn"
import Subscribed from "./Subscribed"
import SubscriptionNotifications from "./SubscriptionNotifications"
import TeamsInfo from "./TeamsInfo"
export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const [members, setMembers] = useState<any>()
  const [membersSubscribed, setMembersSubscribed] = useState<any>()
  const [teams, setTeams] = useState<any>(null)
  const [columns, setColumns] = useState<any>()
  const [error, setError] = useState<any>()
  const [oldMembersToUpdate] = useState<any>({})
  const [membersAreModified, setMembersAreModified] = useState<any>()
  const { setLoading } = useDashboard()
  const { authUser } = useAuthUser()

  useEffect(() => {
    initMembers()
    initTeams()
  }, [])

  useEffect(() => {
    if (teams) initColumns()
  }, [teams, members])

  const initTeams = async () => {
    Team.fetchAll(
      { challengeId: currentChallenge.id },
      {
        listener: (teamsResponse) => {
          // const noTeam = { name: 'Aleatoire', id: null }
          // teamsResponse.push(noTeam)
          if (!teamsResponse) return
          if (!currentChallenge.audience.whitelistWithTeams) {
            teamsResponse = teamsResponse.filter((t) => t.id === MARACUJA_TEAM_ID)
          }
          setTeams(teamsResponse || [])
        },
      }
    )
  }

  const initMembers = async () => {
    WhitelistMember.fetchAll(
      { challengeId: currentChallenge.id },
      {
        listener: (members) => {
          if (!members) return

          const dataMembers = []
          const dataPlayers = []
          members = sortArrayByProperty(members, "firstName")
          members = sortArrayByProperty(members, "clubId")
          for (const member of members) {
            if (member.subscribed) {
              dataPlayers.push(member)
              continue
            }

            const subscriptionNotificationEmailState = member.subscriptionEmailSent
              ? member.subscriptionEmailRetrySent
                ? "relancé"
                : "envoyé"
              : "en attente"
            const subscriptionNotificationSmsState = member.subscriptionSmsSent
              ? member.subscriptionSmsRetrySent
                ? "relancé"
                : "envoyé"
              : "en attente"
            dataMembers.push({
              id: member.id,
              firstName: member.firstName,
              lastName: member.lastName,
              team: member.clubId,
              phoneNumber: member.phoneNumber,
              captain: member.roles?.includes("CAPTAIN"),
              email: member.email,
              subscriptionNotificationEmailState,
              subscriptionNotificationSmsState,
            })
          }

          setMembers(dataMembers)
          setMembersSubscribed(dataPlayers)
        },
      }
    )
  }

  const initColumns = () => {
    let teamsData = teams
      ? teams?.map((team) => {
          return {
            value: team.id,
            label: team.name === "Aucun nom" ? team.id : team.name,
          }
        })
      : []

    const data = [
      {
        ...keyColumn("email", textColumn),
        title: "Email",
      },
      {
        ...keyColumn("firstName", textColumn),
        title: "Prénom",
      },
      {
        ...keyColumn("lastName", textColumn),
        title: "Nom",
      },

      {
        ...keyColumn("subscriptionNotificationEmailState", textColumn),
        title: "Email d'inscription",
        disabled: true,
      },
    ]

    if (currentChallenge.audience.whitelistWithTeams || authUser.hasRole(USER_ROLES.SUPER_ADMIN)) {
      data.splice(3, 0, {
        ...keyColumn(
          "team",
          selectColumn({
            choices: teamsData,
          })
        ),
        title: "Equipe",
      })
    }
    if (currentChallenge.audience.whitelistWithCaptains) {
      data.splice(4, 0, {
        ...keyColumn("captain", checkboxColumn),
        title: "Capitaine ?",
      })
    }

    if (currentChallenge.audience.whitelistWithPhoneNumber) {
      data.splice(1, 0, {
        ...keyColumn("phoneNumber", textColumn),
        title: "Téléphone",
      })
      data.push({
        ...keyColumn("subscriptionNotificationSmsState", textColumn),
        title: "Sms d'inscription",
        disabled: true,
      })
    }

    setColumns(data)
  }

  const handleOnChange = (newValues, operations) => {
    for (const operation of operations) {
      if (operation.type === "DELETE") {
        for (let i = operation.fromRowIndex; i < operation.toRowIndex; i++) {
          const deletedMember = members[i]
          if (deletedMember.id) {
            oldMembersToUpdate[deletedMember.id] = {
              ...deletedMember,
              action: "delete",
            }
          }
        }
      } else if (operation.type === "UPDATE") {
        for (let i = operation.fromRowIndex; i < operation.toRowIndex; i++) {
          const updatedMember = newValues[i]
          if (updatedMember.id) {
            if (updatedMember.phoneNumber) {
              const number = updatedMember.phoneNumber.replace(/[\s.-]/g, "")
              const check = number.match(/(?:(?:\+|00)33|0)(\s*[1-9](?:[\s.-]*\d{2}){4})/)
              if (!check) {
                setError("Le numéro de téléphone doit être format 0612345678")
              } else {
                setError(null)
              }
            }
            oldMembersToUpdate[updatedMember.id] = {
              ...updatedMember,
              action: "update",
            }
          }
        }
      }
    }
    setMembersAreModified(true)
    setMembers(newValues)
  }

  const handleSave = async () => {
    const dataToSave = Object.keys(oldMembersToUpdate).map((key) => oldMembersToUpdate[key])
    for (const member of members) {
      if (!member.id) {
        if (!member.firstName || !member.email) {
          alert(member.id + ' => Les champs "prénom","email" et "équipe",  doivent etre remplis')
          continue
        } else {
          member.email = member.email.trim().toLowerCase()
          dataToSave.push(member)
        }
      }
    }
    if (dataToSave.length) {
      setLoading(true)
      await WhitelistMember.updateMembers({
        challengeId: currentChallenge.id,
        membersToUpdate: dataToSave,
      })
      setMembersAreModified(null)
      setLoading(false)
    }
  }

  const SaveButton = () => {
    return (
      <button className="waves-effect red btn " onClick={handleSave}>
        <i className="material-icons left">save</i>
        Sauvegarder
      </button>
    )
  }

  return (
    <div>
      {/* <TeamsInfo teams={teams} members={members} /> */}
      <h3>Participants</h3>
      {membersAreModified && <SaveButton />}

      {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && !membersAreModified && (
        <SubscriptionNotifications members={members} />
      )}
      {error && <ErrorLabel style={{ marginTop: 20 }}>{error}</ErrorLabel>}
      <Tabs>
        <Tab title={`Non-inscrits (${members?.length || 0})`}>
          {columns && (
            <DataSheetWrapper className="browser-default" value={members} onChange={handleOnChange} columns={columns} />
          )}
          {membersAreModified && <SaveButton />}
        </Tab>
        <Tab title={`Inscrits (${membersSubscribed?.length || 0})`}>
          <Subscribed teams={teams} members={membersSubscribed} />
        </Tab>
      </Tabs>

      <br />
      <br />
      <br />
    </div>
  )
}

const DataSheetWrapper = styled(DataSheetGrid)`
  input:not([type]),
  input[type="text"]:not(.browser-default),
  input[type="password"]:not(.browser-default),
  input[type="email"]:not(.browser-default),
  input[type="url"]:not(.browser-default),
  input[type="time"]:not(.browser-default),
  input[type="date"]:not(.browser-default),
  input[type="datetime"]:not(.browser-default),
  input[type="datetime-local"]:not(.browser-default),
  input[type="tel"]:not(.browser-default),
  input[type="number"]:not(.browser-default),
  input[type="search"]:not(.browser-default),
  textarea.materialize-textarea {
    border-bottom: inherit;
    height: inherit;
    width: inherit;
    font-size: inherit;
    margin: inherit;
    padding: inherit;
  }
  .dsg-input {
    padding: 0 10px !important;
  }

  [type="checkbox"]:not(:checked),
  [type="checkbox"]:checked {
    position: inherit;
    opacity: inherit;
  }
`
