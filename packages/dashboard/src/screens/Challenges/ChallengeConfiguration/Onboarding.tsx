import { PLAYER_ROLES, ROLES, WHITELIST_TYPES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { FieldArray, useFormikContext } from "formik"
import { CheckboxField, FormGroup } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"
import DescriptionEditor from "../Activities/DescriptionEditor"

export default (props) => {
  // const { values } = props
  const { currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()
  const formik = useFormikContext<any>()

  return (
    <>
      {formik.values.referralEnabled && (
        <FormGroup>
          <h5>Popup pour rejoindre le challenge</h5>

          <FieldContainer
            name="onboarding.joinPopup.buttonText"
            type="text"
            label="Text du bouton commencer s'inscrire au challenge"
          />
          <FieldContainer
            name="onboarding.joinPopup.buttonDescriptionText"
            type="text"
            label="Description (optionel)"
          />
          <br />
          <FieldContainer
            name="referral.onboarding.joinPopup.buttonText"
            type="text"
            label="Text du bouton pour entrer son code"
          />
          <FieldContainer name="referral.onboarding.joinPopup.buttonDescriptionText" type="text" label="Description" />
        </FormGroup>
      )}

      {currentChallenge.audience?.whitelist === WHITELIST_TYPES.MAILING_LIST && (
        <FormGroup>
          <h5>Communication Email</h5>
          {formik.values.audience.whitelistWithPhoneNumber && (
            <>
              <h5>SMS d'inscription</h5>
              <div
                style={{
                  backgroundColor: "white",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <i>Hello {authUser.username}, ...</i>
                <FieldContainer
                  name="onboarding.subscriptionSms.message"
                  type="text"
                  label="Contenu 1er sms (ex : Avant ton intégration Aquitel, découvre ta future entreprise et tes futurs collègues dès maintenant !)"
                />
                <FieldContainer
                  name="onboarding.subscriptionSms.messageRetry"
                  type="text"
                  label="Contenu Relance sms (ex : ton intégration Aquitel commence bientôt, rejoins tes futurs collègues qui découvrent déjà ta future entreprise !)"
                />
                <i>
                  ...RDV ici {currentChallenge.dynamicLink?.link} pour télécharger l'app et entre le code{" "}
                  {currentChallenge.code} pour rejoindre ton équipe !
                </i>
              </div>
            </>
          )}
          <br />
          <h5>Email d'inscription</h5>
          <FieldContainer
            label="Titre"
            type="text"
            name="onboarding.subscriptionEmail.title"
            value={formik.values.onboarding?.subscriptionEmail?.title}
          />
          <FieldContainer
            label="Titre (relance)"
            type="text"
            name="onboarding.subscriptionEmail.titleRetry"
            value={formik.values.onboarding?.subscriptionEmail?.titleRetry}
          />
          <DescriptionEditor
            label="Introduction"
            name="onboarding.subscriptionEmail.introduction"
            value={formik.values.onboarding?.subscriptionEmail?.introduction}
            height={150}
          />
          <DescriptionEditor
            label="Le principe"
            name="onboarding.subscriptionEmail.description"
            value={formik.values.onboarding?.subscriptionEmail?.description}
            height={150}
          />
          <DescriptionEditor
            label="Le programme"
            name="onboarding.subscriptionEmail.planning"
            value={formik.values.onboarding?.subscriptionEmail?.planning}
            height={200}
          />

          <br />
        </FormGroup>
      )}

      {formik.values.audience.whitelist === WHITELIST_TYPES.NONE && <RoleFields />}

      <p>
        <CheckboxField name="verifyEmail" label="Envoyer un email de vérification" />{" "}
      </p>

      <FieldContainer name="cguLink" type="text" label="Lien des CGU (commencer par https://)" />
      <FieldContainer name="privacyLink" type="text" label="Lien de la politique de confidentialité" />
      <p>
        <CheckboxField name="playerInfos.birthday" label="Le joueur doit entrer sa date de naissance" />{" "}
      </p>
      <p>
        <CheckboxField
          name="playersAvatarInOnboarding"
          label="Pousser la creation de la carte joueur durant l'onboarding"
        />{" "}
      </p>
      <p>
        <CheckboxField name="onboarding.needCaptain" label="Pousser l'invitation d'un captaine s'il n'y en a pas" />{" "}
      </p>

      <FieldContainer
        name="onboarding.playerCountMinimum"
        label="Inscrire l'équipe à partir d'un minimum de joueur (ex : 5)"
        type="number"
      />

      <OptinsField />
    </>
  )
}

const OptinsField = () => {
  const formik = useFormikContext<any>()

  return (
    <>
      <h5>Champs supplémentaires à remplir dans le formulaire d'inscription :</h5>
      {/* @ts-ignore */}
      <FieldArray
        name="optins"
        render={(arrayHelpers) => (
          <div>
            {formik.values.optins && formik.values.optins.length > 0 ? (
              <>
                {formik.values.optins.map((optin, index1) => (
                  <FormGroup key={index1}>
                    <FieldContainer
                      name={`optins.${index1}.label`}
                      type="text"
                      label="Label"
                      placeholder="Entrez le label"
                    />
                    <FieldContainer
                      className="browser-default"
                      component="select"
                      name={`optins.${index1}.type`}
                      label="Type"
                    >
                      <option value={undefined}> -- Selectionnez -- </option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                      <option value="text">Champs Texte</option>
                    </FieldContainer>
                    <FieldContainer
                      className="browser-default"
                      component="select"
                      name={`optins.${index1}.role`}
                      label="Audience"
                    >
                      <option value={undefined}> -- Tout le monde -- </option>
                      <option value={PLAYER_ROLES.CAPTAIN}>Captain</option>
                      <option value={PLAYER_ROLES.REFEREE}>Recrue</option>
                    </FieldContainer>
                    <p>
                      <CheckboxField name={`optins.${index1}.required`} label="L'optin doit être complété" />{" "}
                    </p>
                    {optin?.required && (
                      <FieldContainer
                        name={`optins.${index1}.requiredLabel`}
                        type="text"
                        label="Message d'erreur si l'optin n'est pas complété"
                        placeholder="Entrez le message d'erreur"
                      />
                    )}
                    <FieldContainer
                      name={`optins.${index1}.id`}
                      type="text"
                      label="Id (exemple : 'optinName')"
                      placeholder="Entrez l'id de l'optin"
                    />
                    {optin?.type === "radio" && (
                      <>
                        <div>
                          {/* @ts-ignore */}
                          <FieldArray
                            name={`optins.${index1}.buttons`}
                            render={(arrayHelpers) => (
                              <>
                                {formik.values.optins[index1].buttons &&
                                formik.values.optins[index1].buttons.length > 0 ? (
                                  <>
                                    {formik.values.optins[index1].buttons.map((label, index2) => (
                                      <div
                                        key={index2}
                                        style={{
                                          background: "white",
                                          padding: 15,
                                          marginBottom: 10,
                                        }}
                                      >
                                        <h6>Option {index2 + 1}</h6>
                                        <FieldContainer
                                          name={`optins.${index1}.buttons.${index2}.label`}
                                          type="text"
                                          label="Label"
                                          placeholder="Entrez le label du bouton radio"
                                        />
                                        <FieldContainer
                                          name={`optins.${index1}.buttons.${index2}.value`}
                                          type="text"
                                          label="Id (exemple : 'name)"
                                          placeholder="Entrez la value du bouton radio"
                                        />
                                        <button
                                          type="button"
                                          style={{ marginTop: "5px" }}
                                          onClick={() => arrayHelpers.remove(index2)}
                                        >
                                          Supprimer
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      style={{ marginTop: "5px" }}
                                      onClick={() =>
                                        arrayHelpers.insert(formik.values.optins[index1].buttons.length, "")
                                      }
                                    >
                                      Ajouter une option
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      style={{ marginTop: "5px" }}
                                      onClick={() => arrayHelpers.push("")}
                                    >
                                      Ajouter une option
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </>
                    )}
                    <button
                      type="button"
                      style={{ marginTop: "15px", display: "block" }}
                      onClick={() => arrayHelpers.remove(index1)}
                    >
                      Supprimer
                    </button>
                  </FormGroup>
                ))}
                <button
                  type="button"
                  style={{ marginTop: "30px" }}
                  onClick={() => {
                    arrayHelpers.insert(formik.values.optins.length, "")
                  }}
                >
                  Ajouter un optin
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  style={{ marginTop: "30px" }}
                  onClick={() => {
                    arrayHelpers.insert(formik.values.optins.length, "")
                  }}
                >
                  Créer un optin
                </button>
              </>
            )}
          </div>
        )}
      />
    </>
  )
}

const RoleFields = () => {
  const formik = useFormikContext<any>()

  return (
    <FormGroup>
      <h5>Qualification des utilisateurs</h5>
      <p>Ces choix sont affichés sous le champs pour entrer son nom d'utilisateur</p>
      {/* @ts-ignore */}
      <FieldArray
        name="optinRoles"
        render={(arrayHelpers) => (
          <div>
            {formik.values.optinRoles && formik.values.optinRoles.length > 0 ? (
              <>
                {formik.values.optinRoles.map((optin, index) => (
                  <div key={`key${index}`} style={{ borderTop: "1px solid white" }}>
                    <FieldContainer
                      name={`optinRoles.${index}.label`}
                      type="text"
                      label="Nom"
                      placeholder="Entrez le nom qui sera affiché"
                    />
                    <FieldContainer
                      className="browser-default"
                      component="select"
                      name={`optinRoles.${index}.value`}
                      label="Type"
                      defaultValue="licensee"
                    >
                      <option value="licensee">Licencié</option>
                      <option value={ROLES.CAPTAIN}>Captain</option>
                      <option value="supporter">Supporter {formik.values.referralEnabled ? "(recrue)" : ""}</option>
                      <option value="president ">Dirigeant</option>
                    </FieldContainer>

                    <button
                      type="button"
                      style={{ marginTop: "15px", display: "block" }}
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  style={{ marginTop: "30px" }}
                  onClick={() => {
                    arrayHelpers.insert(formik.values.optinRoles.length, "")
                  }}
                >
                  Ajouter{" "}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  style={{ marginTop: "30px" }}
                  onClick={() => {
                    arrayHelpers.insert(formik.values.optinRoles.length, "")
                  }}
                >
                  Créer un optin
                </button>
              </>
            )}
          </div>
        )}
      />
    </FormGroup>
  )
}
