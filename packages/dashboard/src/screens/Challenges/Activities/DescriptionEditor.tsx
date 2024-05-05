import { Editor } from "@tinymce/tinymce-react"
import { useFormikContext } from "formik"
import React from "react"

export default ({ label = "Description", name = "description", value = undefined, height = 200 }) => {
  const formik = useFormikContext<any>()
  return (
    <div style={{ margin: "15px 0 40px 0" }}>
      <p className="active">{label}</p>
      {/* @ts-ignore */}
      <Editor
        textareaName="#myTextarea"
        value={value || formik.values[name]}
        apiKey="api_key"
        init={{
          height,
          browser_spellcheck: true,
          contextmenu: false,
          menubar: false,
          force_br_newlines: false,
          language: "fr_FR",
          plugins: [
            "emoticons advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "textpattern",
            "paste",
          ],
          paste_as_text: true,
          toolbar: "bold | italic | emoticons |",
        }}
        onEditorChange={(content) => {
          formik.setFieldValue(name, content)
        }}
      />
    </div>
  )
}
