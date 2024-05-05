import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import "firebase/firestore"
// import { updateExpression } from '@babel/types';
import FieldContainer from "../../../components/FormikFieldContainer"

const DEBRIEFING_PREFIX = "debriefing_"
export default ({ questionSetPhaseId }) => {
  const { currentQuestionSets } = useCurrentChallenge()

  return (
    <FieldContainer
      component="select"
      className="browser-default"
      name="questionSetId"
      label="Quiz (non) effectué par les joueurs"
    >
      <option value="none">❗️Sélectionnez un quiz</option>

      {currentQuestionSets.map((questionSet) => {
        if (questionSet.phase.id === questionSetPhaseId) {
          const content = [
            <option key={questionSet.id} value={questionSet.id}>
              {questionSet.name}
            </option>,
          ]
          if (questionSet.type === ACTIVITY_TYPES.CONTEST) {
            const debriefingId = DEBRIEFING_PREFIX + questionSet.id
            content.push(
              <option key={debriefingId} value={debriefingId}>
                {questionSet.name} (Debriefing)
              </option>
            )
          }
          return content
        }
      })}
    </FieldContainer>
  )
}
