import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { useFormikContext } from "formik"
import { FormGroup } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"
import { Challenge } from "@maracuja/shared/models"
import { ChallengePreview } from "@maracuja/shared/models/Challenge"
import { objectSubset } from "@maracuja/shared/helpers"

const NextChallengeField = () => {
  const formik = useFormikContext<any>()

  const { getChallengesHistory, currentChallenge } = useCurrentChallenge()
  const challengesHistory = getChallengesHistory()

  const onChange = async (e) => {
    const selectedChallengeId = e.target.value
    if (!selectedChallengeId) {
      formik.setFieldValue("nextChallenge", null)
      return
    }

    const seletedChallenge = await Challenge.fetch({ id: selectedChallengeId })
    const challengePreview: ChallengePreview = objectSubset(seletedChallenge, ["id", "name", "startDate", "endDate"])
    formik.setFieldValue("nextChallenge", challengePreview)
  }

  return (
    <FormGroup>
      <h5>Challenge suivant</h5>
      <p>
        Un challenge peut etre connecté à celui ci. Ainsi il sera poussé aux utilisateurs lorsque celui ci sera terminé
      </p>
      <FieldContainer
        className="browser-default"
        component="select"
        label="Challenge connecté"
        value={formik.values.nextChallenge?.id}
        onChange={onChange}
      >
        <option value="">Aucun</option>
        {challengesHistory?.map((item) => {
          if (item.id === currentChallenge.id) return null
          return (
            <option key={item.id} value={item.id}>
              {item.name} ({item.code})
            </option>
          )
        })}
      </FieldContainer>
    </FormGroup>
  )
}

export default NextChallengeField
