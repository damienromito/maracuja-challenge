import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Phase } from "@maracuja/shared/models"
import { fr } from "date-fns/esm/locale"
import { Form, Formik } from "formik"
import M from "materialize-css"
import { useMemo } from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import { CheckboxField, FormGroup } from "../../components"
import FieldContainer from "../../components/FormikFieldContainer"
import { generateId } from "../../helpers"

registerLocale("fr", fr)

interface PhaseFormProps {
  item?: any
  onSubmited: () => void
  onToggleConfigMode?: () => void
}

const PhaseForm = ({ item = {}, onSubmited, onToggleConfigMode }: PhaseFormProps) => {
  const { currentChallenge } = useCurrentChallenge()

  const handleSubmit = async (values, { resetForm }) => {
    values.rankingFilters = values.rankingFilters[0]
      ? typeof values.rankingFilters === "string"
        ? values.rankingFilters.split(",").map((x) => x.trim())
        : values.rankingFilters
      : []
    values.challengeId = currentChallenge.id
    resetForm()

    let objectId = item?.id
    if (!objectId) {
      objectId = generateId(values.name)
      await Phase.create({ challengeId: currentChallenge.id, id: objectId }, values)
    } else {
      await Phase.update({ challengeId: currentChallenge.id, id: objectId }, values)
    }

    M.toast({ html: objectId ? "Phase editée !" : "Phase créée !" })
    onSubmited && onSubmited()
  }

  const initValues = useMemo(() => {
    const values = {
      // topPlayers: item.topPlayers || 0,
      // topReferees :item.topReferees || 0,
      description: item.description || "",
      displayedFilter: item.displayedFilter || "",
      endDate: item.endDate || currentChallenge.endDate,
      name: item.name || currentChallenge.name,
      priceCount: item.priceCount || 0,
      holdAuthorizedClubs: item.holdAuthorizedClubs || false,
      isFinale: item.isFinale || false,
      rankingFilters: item.rankingFilters || "",
      signupDisabled: item.signupDisabled || false,
      startDate: item.startDate || currentChallenge.startDate,
      captainEditTeam: {
        name: item.captainEditTeam?.name || true,
        logo: item.captainEditTeam?.logo || true,
        colors: item.captainEditTeam?.colors || true,
      },
      rankingStats: {
        score: !!item.rankingStats?.score || true,
        progression: !!item.rankingStats?.progression || true,
        playerCount: !!item.rankingStats?.playerCount || false,
        captainCount: !!item.rankingStats?.captainCount || false,
        refereeCount: !!item.rankingStats?.refereeCount || false,
        ideaCount: !!item.rankingStats?.ideaCount || currentChallenge.ideasBoxesEnabled,
      },
      ranking: {
        focusedOnCurrentTeam: !!item.ranking?.focusedOnCurrentTeam || false,
      },
    }

    return values
  }, [])

  return (
    <div>
      {item && <span style={{ color: "lightgray" }}>id : {item.id} </span>}
      <Formik initialValues={initValues} enableReinitialize onSubmit={handleSubmit}>
        {(props) => {
          const { values, setFieldValue } = props
          return (
            <Form style={{ padding: 20 }}>
              <FieldContainer name="name" type="text" label="Nom de la Phase" />

              <div>
                <p>Date de début et de fin : </p>
                <DatePicker
                  dateFormat="d MMMM yyyy H:mm"
                  locale="fr"
                  name="startDate"
                  onChange={(val) => setFieldValue("startDate", val)}
                  selected={values.startDate}
                  showTimeSelect
                  value={values.startDate}
                />

                <DatePicker
                  dateFormat="d MMMM yyyy H:mm"
                  locale="fr"
                  name="endDate"
                  onChange={(val) => setFieldValue("endDate", val)}
                  selected={values.endDate}
                  showTimeSelect
                  value={values.endDate}
                />
              </div>
              <FieldContainer
                name="description"
                type="text"
                component="textarea"
                label="Description de la phase (Afficher sur les regles)"
              />

              <FormGroup>
                <h6>Selection</h6>
                <FieldContainer name="priceCount" type="number" label="Nombre de clubs selectionnés" />
                <p>
                  <CheckboxField name="isFinale" label="Phase finale (podium)" />{" "}
                </p>
                <p>
                  <CheckboxField
                    name="holdAuthorizedClubs"
                    label="Maintenir les clubs selectionnés dans la prochaine phase"
                  />{" "}
                </p>
              </FormGroup>

              <FormGroup>
                <h6>Organisation des audiences</h6>
                <FieldContainer
                  name="rankingFilters"
                  type="text"
                  label='Filtre de classement (ex : "department" ou "tribe" )'
                />
                <FieldContainer
                  name="displayedFilter"
                  type="text"
                  label="Info Club à afficher sur le classement (ex : tribe ou department ou region)"
                />
              </FormGroup>

              <FormGroup>
                <h6>Pouvoir des {currentChallenge.wording?.captains}</h6>
                <p>
                  <CheckboxField
                    name="captainEditTeam.name"
                    label={`Autoriser les ${currentChallenge.wording?.captains} à modifier le nom du club`}
                  />{" "}
                </p>
                <p>
                  <CheckboxField
                    name="captainEditTeam.logo"
                    label="Autoriser les capitaines à modifier le logo du club"
                  />{" "}
                </p>
                <p>
                  <CheckboxField
                    name="captainEditTeam.colors"
                    label="Autoriser les capitaines à modifier la couleur du club"
                  />{" "}
                </p>
              </FormGroup>
              <FormGroup>
                <h6>Affiche des équipes dans le classement</h6>
                <p>
                  <CheckboxField
                    name="ranking.focusedOnCurrentTeam"
                    label="Afficher seulement quelques équipes au dessus et au dessous de son équipe (possibilité de tout afficher)"
                  />{" "}
                </p>
                <p>
                  <CheckboxField name="rankingStats.score" label="Afficher le score" />{" "}
                </p>
                <p>
                  <CheckboxField name="rankingStats.progression" label="Afficher la progression (entrainement)" />{" "}
                </p>
                <p>
                  <CheckboxField name="rankingStats.playerCount" label="Afficher le nombre de joueurs" />{" "}
                </p>
                <p>
                  <CheckboxField
                    name="rankingStats.captainCount"
                    label={`Afficher le nombre de joueurs ${currentChallenge.wording?.captain}`}
                  />{" "}
                </p>
                <p>
                  <CheckboxField name="rankingStats.refereeCount" label="Afficher le nombre de filleuls" />{" "}
                </p>
                <p>
                  <CheckboxField name="rankingStats.ideaCount" label="Afficher le nombre d'idées" />{" "}
                </p>
              </FormGroup>
              <p>
                <CheckboxField name="signupDisabled" label="Interdire l'inscription durant cette phase de jeu" />{" "}
              </p>

              <button type="submit" className="btn pink">
                Enregistrer
              </button>

              {onToggleConfigMode && (
                <button onClick={onToggleConfigMode} className="btn right grey darken-4">
                  Annuler
                </button>
              )}
              <br />
              <br />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default PhaseForm
