import { ErrorLabel } from "@maracuja/shared/components"
import CheckboxField from "@maracuja/shared/components/CheckboxField"
import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Editor } from "@tinymce/tinymce-react"
// import tinymce from '@tinymce'
import { useMemo, useState } from "react"
import Showdown from "showdown"
import CropImageField from "../../CropImageField"
import FieldContainer from "../../FormikFieldContainer"
import QuestionForm from "./QuestionForm"

export default ({ onEditQuestion, currentQuestion }) => {
  const [editorErrorsMessage, setEditorErrorsMessage] = useState<any>()
  const { currentOrganisation } = useCurrentOrganisation()
  // const converter = new Showdown.Converter({ simpleLineBreaks: true })
  const converter = new Showdown.Converter({})
  const onSubmit = (values) => {
    const newValues = { ...values }
    onEditQuestion(newValues)
  }

  const handleChangeTextEditor = (content, editor, setFieldValue) => {
    const wordcount = editor.plugins.wordcount.body.getWordCount()
    if (wordcount > 120) {
      setEditorErrorsMessage(`⚠️  Vous devez supprimer ${wordcount - 120} mots minimum`)
    } else {
      setEditorErrorsMessage("")
    }

    const myContent = converter
      .makeMarkdown(content)
      // .replaceAll(/<strong>(.*)<\/strong>/gm, '').replaceAll('<!-- -->', '') // TODO Remove space
      .replaceAll("<br>", "")
      .replaceAll("<!-- -->", "")
    setFieldValue("content", myContent)
  }

  const initValues = useMemo(() => {
    const values = {
      text: currentQuestion.text || "",
      image: currentQuestion.image || "",
      video: currentQuestion.video || "",
      content: currentQuestion.content || "",
      mediaIsVideo: currentQuestion.mediaIsVideo || false,
    }
    return values
  }, [currentQuestion])

  const yupRules = {
    // solutions: Yup.array().min(1, 'Au moins une bonne réponse')
  }

  return (
    <QuestionForm
      onSubmit={onSubmit}
      currentQuestion={currentQuestion}
      yupRules={yupRules}
      hideQuestionTitle
      initialValues={initValues}
    >
      {(props) => {
        return (
          <>
            <FieldContainer
              errors={props.errors}
              touched={props.touched}
              name="text"
              type="text"
              label="Titre de la carte"
              spellCheck
            />
            {props.values.mediaIsVideo ? (
              <FieldContainer
                errors={props.errors}
                touched={props.touched}
                name="video"
                type="url"
                label="ID de la vidéo YouTube (ex : 96SjOVlbQT8)"
                placeholder="ex : g7OM1Lvcv1g"
              />
            ) : (
              <CropImageField
                {...props}
                name="image"
                label="Image (format carré)"
                imageName={`${currentQuestion.id}`}
                folderName={`organisations/${currentOrganisation.id}/content`}
                sizePreview={{ width: 50, height: 50 }}
              // size={{ width: 500, height: 300 }}
              />
            )}

            <CheckboxField name="mediaIsVideo" label="Afficher une vidéo à la place de l'image ?" />

            <div style={{ margin: "15px 0 40px 0" }}>
              <p className="active">Texte (Entre 80 et 120 mots) </p>
              {editorErrorsMessage && <ErrorLabel style={{ marginTop: "-10px" }}>{editorErrorsMessage}</ErrorLabel>}
              {/* @ts-ignore */}
              <Editor
                textareaName="#myTextarea"
                initialValue={converter.makeHtml(currentQuestion.content)}
                // value={converter.makeHtml(currentQuestion.content)}
                apiKey="api_key"
                init={{
                  height: 200,
                  browser_spellcheck: true,
                  contextmenu: false,
                  menubar: false,
                  language: "fr_FR",
                  plugins: ["emoticons", "wordcount", "textpattern", "paste", "lists"],
                  paste_as_text: true,
                  toolbar: "bold | italic | emoticons | blockquote | bullist ",
                }}
                onEditorChange={(content, editor) => handleChangeTextEditor(content, editor, props.setFieldValue)}
              />
            </div>
          </>
        )
      }}
    </QuestionForm>
  )
}

// const TinyEditor : any = (props) : ant => <Editor {...props} />
