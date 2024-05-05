import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Editor } from "@tinymce/tinymce-react"
import { useFormikContext } from "formik"
import React from "react"
import { CheckboxField, FormGroup } from "../../../components"
import CropImageField from "../../../components/CropImageField"
import FieldContainer from "../../../components/FormikFieldContainer"

export default () => {
  const formik = useFormikContext<any>()
  const { currentOrganisation } = useCurrentOrganisation()
  const { currentChallenge } = useCurrentChallenge()
  return (
    <>
      <FormGroup>
        <h4>Invitation</h4>

        <p>
          Lien dynamique pour partager le challenge : <strong>{currentChallenge.dynamicLink?.link}</strong>
        </p>
        <FieldContainer name="dynamicLink.title" type="text" label="Titre du message d'invitation" />
        <FieldContainer name="dynamicLink.message" type="text" label="Message d'invitation" />
        <CropImageField
          label="Image patagée"
          name="dynamicLink.image"
          imageName="image"
          value={formik.values.sharing.image}
          folderName={`challenges/${currentOrganisation.id}/${currentChallenge.id}/sharing`}
          size={{ width: 1200, height: 1200 }}
          showUrl
        />
      </FormGroup>

      <p>
        <CheckboxField name="sharingEnabled" label="Possibilité d'inviter des joueurs (hors recrutement)" />{" "}
      </p>
      {formik.values.sharingEnabled && (
        <>
          <h4>Popup pour inviter un joueur</h4>
          <FieldContainer name="sharing.intro" type="text" label="Texte d'intro de la popup" />
          <FieldContainer name="sharing.title" type="text" label="Titre de la popup" />
          <FieldContainer name="sharing.description" type="text" label="Texte de description" />
          {/* <FieldContainer name='sharing.buttonText' type='text' label='Texte du bouton' /> */}

          <h4>Popup pour inviter un captain</h4>
          <FieldContainer name="sharing.captain.title" type="text" label="Titre de la popup" />
          <FieldContainer name="sharing.captain.description" type="text" label="Texte de description" />
        </>
      )}
      {formik.values.referralEnabled && (
        <FormGroup>
          <>
            <h4>Popup pour inviter un filleul</h4>
            {formik.values.sharingEnabled && (
              <>
                <h6>Ecran de choix : Inviter un licencié ou parrainer ?</h6>
                <FieldContainer name="referral.sharing.choiceIntro" type="text" label="Texte d'intro de la popup" />
                <FieldContainer name="referral.sharing.choiceButton" type="text" label="Titre de la popup" />
              </>
            )}
            <FieldContainer name="referral.sharing.title" type="text" label="Titre de la popup" />
            <FieldContainer name="referral.sharing.intro" type="text" label="Texte d'intro de la popup" />
            <FieldContainer name="referral.sharing.inviteAReferee" type="text" label="Texte (Invite une recrue)" />
          </>

          <h4>Invitation de filleuls</h4>

          <p>
            Lien dynamique pour partager le challenge à un filleuil :{" "}
            <strong>{currentChallenge.dynamicLinkReferral?.link}</strong>
          </p>
          <FieldContainer name="dynamicLinkReferral.title" type="text" label="Titre du message d'invitation" />
          <FieldContainer name="dynamicLinkReferral.message" type="text" label="Message d'invitation" />
          {/* <FieldContainer name='sharing.info' type='text' label="Informations ajoutées à la popup d'invitation" /> */}
          <CropImageField
            label="Image patagée"
            name="dynamicLinkReferral.image"
            imageName="image"
            value={formik.values.sharing.image}
            folderName={`challenges/${currentOrganisation.id}/${currentChallenge.id}/referralSharing`}
            size={{ width: 1200, height: 1200 }}
            showUrl
          />
        </FormGroup>
      )}
    </>
  )
}
