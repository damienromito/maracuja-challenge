import { Idea } from "@maracuja/shared/models"
import { Avatar, List } from "antd"
import moment from "moment"
import { useParams } from "react-router"
import { generatePath, Link } from "react-router-dom"
import { ROUTES } from "../../../constants"

const IdeasList = ({ ideas }: { ideas: Idea[] }) => {
  const { challengeId } = useParams<any>()

  const getPlayerLink = (playerId) =>
    generatePath(ROUTES.CHALLENGE_PLAYER, {
      challengeId,
      playerId,
    })

  return (
    <List
      itemLayout="horizontal"
      dataSource={ideas}
      renderItem={(idea: any) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={idea.player.avatar} />}
            title={
              <Link to={getPlayerLink(idea.player.id)}>
                {idea.player.username} ({idea.team.name})
              </Link>
            }
            description={moment(idea.createdAt).format("ddd D MMM H:mm")}
          />
          {idea.idea}
        </List.Item>
      )}
    />
  )
}

export default IdeasList
