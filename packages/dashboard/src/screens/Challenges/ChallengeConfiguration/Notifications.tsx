import { CheckboxField } from "@maracuja/shared/components"
import { GENERATED_NOTIFICATION_TYPES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { useFormikContext } from "formik"
import React from "react"
import { FormGroup } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const formik = useFormikContext<any>()
  return (
    <>
      <FormGroup>
        <h4>📣Délais (en heure) des notifications générées (par défaut à la création des quiz)</h4>
        <FieldContainer
          name={`notifications.generated.${GENERATED_NOTIFICATION_TYPES.START}.delay`}
          type="number"
          label="Délai des notifications envoyées au lancement d'un quiz (ex : '2' pour 2h apres le debut)"
        />
        <FieldContainer
          name={`notifications.generated.${GENERATED_NOTIFICATION_TYPES.WAKE_UP}.delay`}
          type="number"
          label="Délai des notifications envoyées aux joueurs endormis (ex : '-2' pour -2h avant la fin du quiz)"
        />
        <FieldContainer
          name={`notifications.generated.${GENERATED_NOTIFICATION_TYPES.CAPTAIN}.delay`}
          type="number"
          label="Délai des notifications envoyées aux joueurs capitaines (ex : '7' pour 7h apres le début du quiz)"
        />
        <FieldContainer
          name={`notifications.generated.${GENERATED_NOTIFICATION_TYPES.DEBRIEFING}.delay`}
          type="number"
          label="Délai des notifications envoyées lorsque le debriefing est disponible (ex : '2' pour 2h apres la fin d'une épreuve)"
        />
      </FormGroup>

      <FormGroup>
        <h4>🍭 Astuces et Actu du challenge</h4>
        <p>Les utilisateurs devront accepter de souscrire à cette liste dans les suggestions du vestiaire</p>
        <p>
          <CheckboxField name="emails.mailingListEnabled" label="Activer la creation d'une liste d'email sur Mailjet" />{" "}
        </p>
        <p>
          <CheckboxField
            name="emails.optinMandatory"
            label="Ne pas ajouter les utilisateurs à la liste sans l'autorisation"
          />{" "}
        </p>
        {formik.values.emails.mailingListEnabled && (
          <>
            <p>
              Une liste de contact "{currentChallenge.name}" ({currentChallenge.mailjetListId}) est auto-alimentée sur
              mailjet →{" "}
              <a href="https://app.mailjet.com/contacts" target="_blank" rel="noreferrer">
                aller aux listes
              </a>{" "}
            </p>
            <p>
              Pour créer un email de bienvenue dupliquez l'automation "Bienvenue sur le Challenge Maracuja" →{" "}
              <a href="https://app.mailjet.com/workflow" target="_blank" rel="noreferrer">
                aller aux automations
              </a>{" "}
            </p>
          </>
        )}
      </FormGroup>
    </>
  )
}
