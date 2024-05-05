import { callApi } from "@maracuja/shared/helpers"
import { Question } from "@maracuja/shared/models"
import { Button, Collapse, Modal, notification, Space, Tabs, TabsProps } from "antd"
import { useState } from "react"
// import tinymce from '@tinymce'
import { useDashboard } from "../../../contexts"
import questionTypes from "@maracuja/shared/constants/questionTypes"
import { useParams } from "react-router-dom"
const { Panel } = Collapse
function CopyMe(TextToCopy) {
  var TempText = document.createElement("input")
  TempText.value = TextToCopy
  document.body.appendChild(TempText)
  TempText.select()

  document.execCommand("copy")
  document.body.removeChild(TempText)
  notification.success({ message: "Contenu copié !" })
}

interface AIGeneratorProps {
  currentQuestion: Question
  themeId: string
  onNeedReload: () => void
}

const AIGenerator = ({ currentQuestion, themeId, onNeedReload }: AIGeneratorProps) => {
  return (
    <>
      <div>
        <Collapse>
          <Panel header="IA - Générer le texte" key="1">
            <TextGenerator currentQuestion={currentQuestion} />
          </Panel>
        </Collapse>
        <Collapse collapsible={currentQuestion.content ? undefined : "disabled"}>
          <Panel header="IA - Générer les QCM" key="2">
            <QCMGenerator currentQuestion={currentQuestion} themeId={themeId} onMCQAdded={onNeedReload} />
          </Panel>
        </Collapse>
      </div>
    </>
  )
}

export default AIGenerator

const TextGenerator = ({ currentQuestion }) => {
  const [generatedContent, setGeneratedContent] = useState<string>(undefined)

  const { setLoading } = useDashboard()

  const generateCardFromTheme = async () => {
    const theme = window.prompt(
      "Rédiger en une dizaine de mot le sujet que vous souhaitez developper dans cette carte, notre IA s'en chargera.",
      currentQuestion.text
    )
    if (!theme) return
    setLoading(true)

    const response = await callApi("apiAuthorToolGenerateMemoCard", {
      mode: "theme",
      theme,
    })
    setLoading(false)
    setGeneratedContent(response.result)
  }

  const generateCardFromText = async () => {
    const text = window.prompt("Copie le texte à partir duquel la carte doit être générée", currentQuestion.content)
    if (!text) return
    setLoading(true)

    const response = await callApi("apiAuthorToolGenerateMemoCard", {
      text,
      mode: "text",
      system:
        "Tu es un journaliste doit rédiger des articles sur le sujet précisé par l'utilisateur en respectant toutes les consignes ci-dessous : - Le contenu doit être divertissant tout en restant instructif.  - Le texte doit commencer par une phrase accroche intrigante et humouristique. - Utilise entre 2 et 5 smileys dans tout l'article pour rendre visuel certaines phrases.  - Tres important : Le texte doit faire 80 mots au maximum. ",
    })
    setLoading(false)
    setGeneratedContent(response.result)
  }

  return (
    <>
      <Button onClick={() => generateCardFromTheme()}>À partir d'un theme </Button>
      <Button onClick={() => generateCardFromText()}>À partir d'un texte</Button>
      <div style={{ whiteSpace: "pre-wrap" }}>{generatedContent}</div>
    </>
  )
}

const QCMGenerator = ({ currentQuestion, themeId, onMCQAdded }) => {
  const { setLoading } = useDashboard()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [questions, setQuestions] = useState<Array<any>>(undefined)
  const { organisationId } = useParams<any>()

  const generateQCM = async () => {
    const text = window.prompt(
      "Les QCM seront générés à partir du texte entré (le contenu de la carte par défaut)",
      currentQuestion.content
    )
    if (!text) return
    setLoading(true)

    const response = await callApi("apiAuthorToolGenerateQuiz", {
      text,
      // system:
      // "Tu es un générateur de QCM pédagogique à partir du texte entré par l’utilisateur. Génere un maximum de QCM contenant 3 solutions avec une seule bonne réponse. Indique laquelle est bonne. La position de la bonne réponse doit être aléatoire pour ne pas toujours être à la même place.",
    })
    setLoading(false)
    // CopyMe(response.result)
    setQuestions(response.result)
    setIsModalOpen(true)
  }

  const generateQuestions = async () => {
    setLoading(true)
    const params = {
      themeId,
      organisationId,
      questions,
    }
    await callApi("apiAuthorToolAddGeneratedQuestions", params)
    setLoading(false)
    onMCQAdded()
  }

  return (
    <>
      <Button onClick={() => generateQCM()}>À partir du contenu</Button>

      <ul style={{ whiteSpace: "pre-wrap" }}>
        {questions?.map((question, index) => (
          <li key={index}>
            <strong>{question.text}</strong>
            {question.choices.map((choice, index) => (
              <p key={index}>
                {index + 1} - {choice}
              </p>
            ))}
            <p>Bonne réponse : {question.solution + 1}</p>
            --
          </li>
        ))}
      </ul>

      <Button onClick={generateQuestions} disabled={!questions}>
        Ajouter les QCM à la liste
      </Button>
    </>
  )
}
