import "firebase/firestore"
import FieldContainer from "../../../components/FormikFieldContainer"

export default () => {
  return (
    <>
      <FieldContainer component="select" className="browser-default" name="template.emailId" label="Template Email">
        <option value="newPhase">Participants déjà inscrits (contenu defini dans onboarding)</option>
        <option value="subscriptionDME">Inscription DME</option>
        <optgroup label="Formation SST 1704">
          <option value="training-onboarding-day-1">Onboarding Jour 1</option>
          <option value="training-onboarding-day-2">Onboarding Jour 2</option>
          <option value="training-onboarding-day-3">Onboarding Jour 3</option>
          <option value="training-onboarding-day-4">Onboarding Jour 4</option>
          <option value="training-onboarding-day-5">Onboarding Jour 5</option>
          <option value="training-onboarding-day-6">Onboarding Jour 6 (Jour 2 challenge)</option>
        </optgroup>
      </FieldContainer>
      <FieldContainer name="template.title" type="text" label="Libellé de la notification" />
    </>
  )
}
