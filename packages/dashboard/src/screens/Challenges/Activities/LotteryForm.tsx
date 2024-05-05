import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { useFormikContext } from "formik"
import { Link } from "react-router-dom"
import { FormButton, FormGroup } from "../../../components"
import CropImageField from "../../../components/CropImageField"
import FieldContainer from "../../../components/FormikFieldContainer"
import { useDashboard } from "../../../contexts"
import DescriptionEditor from "./DescriptionEditor"
import DisplayDatePicker from "./DisplayDatePicker"

export default ({ currentId, activity }) => {
  const { currentChallenge } = useCurrentChallenge()
  const formik = useFormikContext<any>()
  const { setLoading } = useDashboard()

  const handleClickDrawWinners = async () => {
    setLoading(true)
    await activity.drawWinners()
    setLoading(false)
    window.location.reload()
  }

  const WinnersDetails = () => {
    if (!activity) return null
    const winnersArray = activity.winners
    return winnersArray.map((winner, index) => {
      return (
        <p key={index + "winner"}>
          --- GAGNANT {index + 1}--- <br />
          <Link to={`/challenges/${currentChallenge.id}/players/${winner.id}`}>{winner.username}</Link> <br />
          Equipe : {winner.teamName} <br />
          Numéro : {winner.subscriptionNumber} <br />
          Id : {winner.id} <br />
          <br />
        </p>
      )
    })
  }

  return (
    <>
      <h5>{activity.subscriptionCount} inscriptions</h5>
      <DescriptionEditor label="Information sur le tirage" />
      <FieldContainer label="Url de l'annonce du tirage (optionel)" name="link" type="text" />
      <FieldContainer label="Information sur les lots" name="prizesInfo" type="text" />
      <FieldContainer label="Nombre de gagnants" name="winnerCount" type="number" />
      <CropImageField
        label="Image de l'activité"
        showUrl
        name="image"
        imageName="image"
        folderName={`challenges/${currentChallenge.id}/lotteries/${currentId}`}
        size={{ width: 800, height: 800 }}
      />
      <DisplayDatePicker name="drawDate" label="Date du tirage" />
      {!activity.winners ? (
        <FormButton type="button" onClick={handleClickDrawWinners} disabled={formik.values.endDate > new Date()}>
          Tirer les {activity.winnerCount} gagnants
        </FormButton>
      ) : (
        <FormGroup>
          <WinnersDetails />
        </FormGroup>
      )}
    </>
  )
}
