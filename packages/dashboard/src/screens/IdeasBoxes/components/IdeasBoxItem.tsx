import { USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { getPeriodString } from "@maracuja/shared/helpers"
import { IdeasBox } from "@maracuja/shared/models"
import { Button, List } from "antd"
import { useHistory } from "react-router"
import { generatePath } from "react-router-dom"
import { ROUTES } from "../../../constants"
import { useDashboard } from "../../../contexts"

const IdeasBoxItem = ({ ideasBox }: { ideasBox: IdeasBox }) => {
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  const { stats } = useDashboard()

  const { authUser } = useAuthUser()
  const handleEdit = (ideasBox: IdeasBox) => {
    const route = generatePath(ROUTES.CHALLENGE_IDEASBOX_EDITION, {
      challengeId: currentChallenge.id,
      ideasBoxId: ideasBox.id,
    })
    history.push(route)
  }
  const handleOpen = (ideasBox: IdeasBox) => {
    const route = generatePath(ROUTES.CHALLENGE_IDEASBOX, {
      challengeId: currentChallenge.id,
      ideasBoxId: ideasBox.id,
    })
    history.push(route)
  }

  const getActions = (ideasBox: IdeasBox) => {
    const actions = []
    if (authUser.hasRole(USER_ROLES.SUPER_ADMIN)) {
      actions.push(<Button onClick={() => handleEdit(ideasBox)}>Configurer</Button>)
    }
    actions.push(
      <Button type="primary" onClick={() => handleOpen(ideasBox)}>
        {stats.ideasBoxes?.[ideasBox.id]?.count || 0} idées
      </Button>
    )
    return actions
  }

  return (
    <List.Item actions={getActions(ideasBox)}>
      <List.Item.Meta
        title={ideasBox.name}
        description={
          <>
            <p>🗓 {getPeriodString(ideasBox)}</p>
            <p>🏁 Phase {currentChallenge.phases.find((p) => p.id === ideasBox.phaseId)?.name}</p>
          </>
        }
      />
    </List.Item>
  )
}

export default IdeasBoxItem
