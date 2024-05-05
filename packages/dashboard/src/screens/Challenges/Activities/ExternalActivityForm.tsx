import { useCurrentChallenge } from "@maracuja/shared/contexts"

import { FormButton } from "../../../components"
import CropImageField from "../../../components/CropImageField"
import FieldContainer from "../../../components/FormikFieldContainer"
import { useDashboard } from "../../../contexts"
import DescriptionEditor from "./DescriptionEditor"

export default ({ activity, currentId }) => {
  const { setLoading } = useDashboard()
  const { currentChallenge } = useCurrentChallenge()

  const handleClickInitialize = async () => {
    setLoading(true)
    if (window.confirm("⚠️ Si des scores ont déjà été entrés, ils seront écrasés !") === true) {
      await activity.initializePlayerList()
    }

    setLoading(false)
  }
  const handleClickImportScores = async () => {
    setLoading(true)
    if (
      window.confirm(
        "⚠️ Les scores ne pourront pas être ni modifié ni supprimé ! Verifiez bien le fichier avant l'import"
      ) === true
    ) {
      await activity.importScores()
    }

    setLoading(false)
  }

  return (
    <>
      <FieldContainer
        name="preview"
        type="text"
        component="textarea"
        label="Aperçu de la description de l'activité (Afficher sur la suggestion regle)"
      />

      <h4>Detail</h4>

      <DescriptionEditor name="description" />

      <CropImageField
        label="Image de l'activité"
        showUrl
        name="image"
        imageName="image"
        folderName={`challenges/${currentChallenge.id}/externalActivities/${currentId}`}
      />

      <FieldContainer label="Lien Google Spreadsheet" name="spreadsheetUrl" type="text" />
      <FormButton type="button" onClick={handleClickInitialize}>
        Initialiser la liste de joueurs
      </FormButton>
      <br />
      <br />
      <FormButton type="button" onClick={handleClickImportScores} red>
        Importer les scores
      </FormButton>
    </>
  )
}
