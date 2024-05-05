import { CheckboxField } from "@maracuja/shared/components"
import "firebase/firestore"
import { useFormikContext } from "formik"
// import { updateExpression } from '@babel/types';
import FieldContainer from "../../../components/FormikFieldContainer"
import NotificationTemplatePicker from "./../NotificationTemplatePicker"

export default () => {
  const { values, setFieldValue } = useFormikContext<any>()

  const handlePickNotificationTemplate = (template, setFieldValue) => {
    setFieldValue("template.title", template.title)
    setFieldValue("template.message", template.message)
  }

  return (
    <>
      <NotificationTemplatePicker onPicked={(template) => handlePickNotificationTemplate(template, setFieldValue)} />
      <FieldContainer name="template.title" type="text" label="Titre *" />
      <FieldContainer
        name="template.message"
        component="textarea"
        label="Message *"
        rows={5}
        cols={30}
        style={{ width: "100%", height: "100px" }}
      />

      <CheckboxField name="redirectionPersonalized" label="Personaliser la redirection" />

      {values.redirectionPersonalized ? (
        <FieldContainer name="template.redirect" type="text" label="Redirection à l'ouverture de la notification" />
      ) : (
        <FieldContainer
          component="select"
          className="browser-default"
          name="template.redirect"
          label="Redirection à l'ouverture de la notification"
        >
          <option value="/">Vestiaire</option>
          <option value="/challenge/ranking">Classement</option>
          <option value="/challenge/club">Club</option>
          <option value="/rules">Règles</option>
          <option value="/challenge/phases">Calendrier</option>
        </FieldContainer>
      )}
    </>
  )
}
