import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Module } from "@maracuja/shared/models"
import { Button, Select } from "antd"
import { useFormikContext } from "formik"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import { generatePath, useHistory } from "react-router-dom"
import { CheckboxField, FormGroup } from "../../../components"
import CropImageField from "../../../components/CropImageField"
import FieldContainer from "../../../components/FormikFieldContainer"
import { ROUTES } from "../../../constants"
import { useDashboard } from "../../../contexts"
import NextChallengeField from "./NewChallengeField"
import TrainingActionsFieldset from "./TrainingActionsFieldset"

export default () => {
  const formik = useFormikContext<any>()
  const { currentOrganisation } = useCurrentOrganisation()
  const { currentChallenge } = useCurrentChallenge()
  const { setLoading } = useDashboard()
  const history = useHistory()
  const [modules, setModules] = useState(null)

  useEffect(() => {
    const unsubModules = loadModules()
    return () => {
      unsubModules()
    }
  }, [])

  const loadModules = () => {
    return Module.fetchAll(
      { organisationId: currentOrganisation.id },
      {
        listener: (objects) => {
          if (objects) setModules(objects)
        },
      }
    )
  }

  function handleChangeModules(value, options) {
    const modules = {}
    options.forEach((option) => {
      modules[option.value] = {
        name: option.label,
        organisationId: currentOrganisation.id,
      }
    })
    formik.setFieldValue("modules", modules)
  }

  const handleChallengeDelete = async () => {
    const response = window.prompt(
      "Entrez le code du challenge pour confirmer la suppression : " + currentChallenge.code
    )
    if (response === currentChallenge.code) {
      setLoading(true)
      currentChallenge.delete()
      setLoading(false)
      history.push(generatePath(ROUTES.ORGANISATION, { organisationId: currentOrganisation.id }))
    }
  }

  return (
    <>
      <h4>Affichage</h4>
      <FieldContainer name="name" type="text" label="Nom du Challenge" />
      <p>
        <CheckboxField
          name="isTemplate"
          label="Utiliser ce challenge en tant que template (ce challenge servira de modèle pour créer d'autres challenges)"
        />
      </p>
      <FieldContainer name="editionName" type="text" label="Nom de l'edition (laisser vide si challenge unique)" />
      <FieldContainer name="code" type="text" label="Code pour acceder au challenge (EN MAJUSCULE)" />
      <div>
        <p>Date d'ouverture du challenge : </p>
        <DatePicker
          dateFormat="d MMMM yyyy H:mm"
          locale="fr"
          name="startDate"
          onChange={(val) => formik.setFieldValue("startDate", val)}
          selected={formik.values.startDate}
          showTimeSelect
          value={formik.values.startDate}
        />

        <DatePicker
          dateFormat="d MMMM yyyy H:mm"
          locale="fr"
          name="endDate"
          onChange={(val) => formik.setFieldValue("endDate", val)}
          selected={formik.values.endDate}
          showTimeSelect
          value={formik.values.endDate}
        />
      </div>

      <FieldContainer className="browser-default" component="select" name="scenarioType" label="Type de Scénario">
        <option value={""}>Personnalisé</option>
        <option value="trainingAction">Formation</option>
      </FieldContainer>
      {formik.values.scenarioType === "trainingAction" && <TrainingActionsFieldset />}

      <FieldContainer name="periodString" type="text" label='Status (ex : "13-15 JANVIER" ou "Terminé")' />
      <FieldContainer
        name="description"
        type="text"
        component="textarea"
        label="Description affichée sur la landing page du challenge"
      />

      <CropImageField
        label="Logo du challenge"
        name="image"
        imageName="image"
        value={formik.values.image}
        folderName={`challenges/${currentOrganisation.id}/${currentChallenge.id}`}
        size={{ width: 800, height: 800 }}
        displayUrl
      />
      <p>
        <CheckboxField name="highlighted" label="Afficher le challenge sur la landing page" />{" "}
      </p>
      <p>
        <CheckboxField name="hidden" label="Cacher sur la page de l'organisation" />{" "}
      </p>
      <FieldContainer name="theme" type="text" label="Theme visuel (default, edf, cros)" />
      <p>
        <CheckboxField name="webAppEnabled" label="Permettre l'acces à l'app depuis un navigateur " />
      </p>
      <FormGroup>
        <h5>Couleurs</h5>
        <FieldContainer name="colors.primary" type="text" label="Couleur principale (fond)" />
        <FieldContainer name="colors.secondary" type="text" label="Couleur secondaire (bouton)" />
      </FormGroup>

      <FormGroup>
        <h5>Contenus</h5>
        <Select
          mode="multiple"
          placeholder="Choisissez les modules à inclure dans le challenge"
          style={{ width: "100%" }}
          defaultValue={currentChallenge.modules?.map((m) => {
            return { value: m.id, label: m.name }
          })}
          onChange={handleChangeModules}
          options={modules?.map((m) => {
            return { value: m.id, label: m.name }
          })}
        />
        <FieldContainer name="calendar.spreadsheetUrl" type="text" label="Url Google Spread Sheet" />
        {formik.values.calendar.spreadsheetUrl && (
          <p>
            <a
              href={`https://docs.google.com/spreadsheets/d/${formik.values.googleSpreadSheetId}/edit#gid=${formik.values.sheetId}`}
              target="_blank"
              rel="noreferrer"
            >
              Aller au SpreadSheet
            </a>
          </p>
        )}
        <span>
          ℹ️ Ajouter cet email aux personnes pouvant editer le document :
          google-sheets-maracuja@maracuja-english-challenge.iam.gserviceaccount.com
        </span>
      </FormGroup>
      <FormGroup>
        <h5>Coach</h5>
        <p>
          <CheckboxField name="coachEnabled" label="Ajouter un coach au challenge" />{" "}
        </p>
        {formik.values.coachEnabled && (
          <>
            <FieldContainer name="coach.firstName" type="text" label="Prénom du coach" />
            <FieldContainer name="coach.lastName" type="text" label="Nom du coach" />
            <FieldContainer name="coach.userId" type="text" label="ID de l'utilisateur (pour envoyer un email)" />
            <FieldContainer name="coach.bio" type="textarea" label="Qui est ce coach ?" />
          </>
        )}
      </FormGroup>

      {/* <p><CheckboxField name="checkLicense" label="Vérifier numéro de licence"  /></p> */}
      {/* <p><CheckboxField name="referral" label="Parainnage"  /> </p> */}
      <h4>Fonctionnalités supplementaires</h4>
      <p>
        <CheckboxField
          name="captainCanMotivate"
          label={`Le ${currentChallenge.wording?.captain} peut envoyer un message quotidien personnalisé à l'ensemble de l'équipe`}
        />{" "}
      </p>
      <p>
        <CheckboxField name="playersAvatarWithoutBackground" label="Supprimer l'arrière plan des avatars des joueurs" />{" "}
      </p>
      <p>
        <CheckboxField name="ranking.displayActivities" label="Afficher les activités sur la page du classement" />{" "}
      </p>
      <p>
        <CheckboxField
          name="ranking.displayMaracujaTeam"
          label="Afficher la Maracuja Team sur la page du classement (pour les autres clubs) "
        />{" "}
      </p>
      <p>
        <CheckboxField
          name="team.displayColorLogo"
          label="Afficher la couleur principale de l'équipe autour du logo "
        />{" "}
      </p>
      <p>
        <CheckboxField
          name="team.displayOnlyCurrentWeek"
          label="Afficher uniquement les quiz de la semaine dans la page équipe (sinon ceux de la phase)"
        />{" "}
      </p>

      <NextChallengeField />

      <Button danger onClick={handleChallengeDelete}>
        Supprimer le challenge
      </Button>
    </>
  )
}
