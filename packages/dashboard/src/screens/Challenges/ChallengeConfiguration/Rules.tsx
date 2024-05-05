import { Editor } from "@tinymce/tinymce-react"
import { useFormikContext } from "formik"
import React from "react"
import { CheckboxField, FormGroup } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"

export default () => {
  const formik = useFormikContext<any>()

  const handleTextChange = (content, setFieldValue) => {
    setFieldValue("faq", content)
  }

  return (
    <>
      <h4>Règles générales</h4>
      <FieldContainer name="rules" label="Règles générales" component="textarea" />

      <TopPlayersField values={formik.values} />
      <p>
        <CheckboxField
          name="quiz.questionsHaveNegativeVersion"
          label="Activer l'ajout de réponses inversées pour les QCM"
        />{" "}
      </p>
      <p>
        <CheckboxField
          name="quiz.displayAMaxOfChoices"
          label="Afficher aleatoirement un nombre maximum de réponses par question (ex : 3 réponses afficher sur 6 enregistrée)"
        />{" "}
      </p>

      <FormGroup>
        <h5>Capitaines</h5>
        <FieldContainer name="captains.maxPerTeam" type="number" label="Nombre maximum de capitaine par équipe" />
      </FormGroup>

      <FormGroup>
        <h5>Debriefing</h5>
        <p>
          <CheckboxField
            name="debriefing.enabledDuringContest"
            label="Autoriser le debriefing lorsque l'épreuve n'est pas terminée"
          />{" "}
        </p>
      </FormGroup>

      <FormGroup>
        <h5>Recrutement</h5>
        <p>
          <CheckboxField name="referralEnabled" label="Activer le parrainage" />{" "}
        </p>
        <p>
          <CheckboxField name="recruitment.email" label="Autoriser le recrutement par email" />{" "}
        </p>
        {formik.values.recruitment.email && (
          <>
            <FieldContainer name="recruitment.emailSubject" type="text" label="Titre de l'email" />
            <FieldContainer
              name="recruitment.emailBody"
              type="text"
              label="Corps de l'email (Commence par : C'est [Nom du captain], ton coéquipier...) "
            />
            <p>
              <CheckboxField
                name="recruitment.onlyForCaptain"
                label="Recrutement possible pour les captains uniquement"
              />{" "}
            </p>
          </>
        )}
      </FormGroup>
      <h4>FAQ</h4>
      {/* @ts-ignore */}
      <Editor
        textareaName="#myTextarea"
        // outputFormat='text'
        value={formik.values.faq}
        apiKey="api_key"
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "emoticons advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          language: "fr_FR",
          toolbar: "| bold italic | emoticons | h2 | h3 |",
        }}
        onEditorChange={(content) => handleTextChange(content, formik.setFieldValue)}
      />
    </>
  )
}

const TopPlayersField = ({ values }) => {
  return (
    <>
      <h4>Top Player</h4>

      <p>
        <CheckboxField name="topPlayersEnabled" label="Le score des X meilleurs joueurs comptent pour le club" />{" "}
      </p>
      {values.topPlayersEnabled && (
        <>
          <p>
            ⚠️ Si votre challenge est en cours, relancez la mise à jour du classement pour qu'il soit pris en compte
          </p>
          <FieldContainer
            name="topPlayers.members"
            type="number"
            label="les X meilleurs membres = ? (tout le monde sauf les filleuls)"
          />
          {values.referralEnabled && (
            <FieldContainer name="topPlayers.referees" type="number" label="les X meilleurs filleuls = ? " />
          )}
        </>
      )}

      {/* <FieldContainer name="topReferees" type="text" label="Le score des X meilleurs filleuls comptent pour le club ; X = ? " /> */}
    </>
  )
}
