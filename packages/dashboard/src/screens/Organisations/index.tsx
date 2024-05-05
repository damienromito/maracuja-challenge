// import M from 'materialize-css'
import { USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Organisation } from "@maracuja/shared/models"
import { Space } from "antd"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { Spinner } from "../../components"
import ROUTES from "../../constants/routes"
import NewOrganisationButton from "./NewOrganisationButton"

const OrganisationsPage = () => {
  const history = useHistory()

  const { authUser } = useAuthUser()
  const { setCurrentOrganisationById } = useCurrentOrganisation()
  const { setCurrentChallengeById } = useCurrentChallenge()
  const [organisations, setOrganisations] = useState<any>(null)
  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const orgas = await Organisation.fetchAll({
      ids: !authUser.hasRole(USER_ROLES.SUPER_ADMIN) && Object.keys(authUser.organisations),
    })
    setOrganisations(orgas)
  }

  const handleClickOrganisation = (organisationId) => {
    setCurrentChallengeById(null)
    setCurrentOrganisationById(organisationId)
    history.push(`${ROUTES.ORGANISATIONS}/${organisationId}`)
  }

  return (
    <>
      <h1>Organisations</h1>
      <Space direction="vertical">
        {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && <NewOrganisationButton />}
        {!organisations ? (
          <Spinner />
        ) : (
          <>
            {organisations?.map((organisation) => {
              return (
                <OrganisationItem
                  key={organisation.id}
                  organisation={organisation}
                  onClickOrganisation={handleClickOrganisation}
                />
              )
            })}
          </>
        )}
      </Space>
    </>
  )
}

const OrganisationItem = ({ organisation, onClickOrganisation }) => {
  return (
    <div>
      <button onClick={() => onClickOrganisation(organisation.id)}>{organisation.name}</button>
    </div>
  )
}

export default OrganisationsPage
