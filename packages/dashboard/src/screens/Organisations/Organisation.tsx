// import M from 'materialize-css'
import { USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { List } from "antd"
import { PageContainer } from "../../components"
import ChallengeItem from "../Challenges/ChallengeItem"
import NewChallengeButton from "../Challenges/NewChallengeButton"

export default () => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { authUser } = useAuthUser()

  return (
    <PageContainer
      title={currentOrganisation.name}
      rightItem={authUser.hasRole(USER_ROLES.SUPER_ADMIN) && <NewChallengeButton />}
    >
      <List itemLayout="horizontal">
        {currentOrganisation.challenges ? (
          currentOrganisation.challenges.map((item) => {
            const userOranisation = authUser.organisations?.[currentOrganisation.id]
            // LIMIT ACCES PAR CHALLENGE PLUTOT QUE PAR ORGANISATION
            // const userChallenges = userOranisation?.challenges
            // if (authUser.hasRole(USER_ROLES.SUPER_ADMIN) || userChallenges?.includes(item.id)) {
            if (authUser.hasRole(USER_ROLES.SUPER_ADMIN) || userOranisation) {
              return <ChallengeItem key={item.id} item={item} />
            } else return null
          })
        ) : (
          <div>Il n'y a aucun challenge ...</div>
        )}
      </List>
    </PageContainer>
  )
}
