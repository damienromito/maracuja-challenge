import { Tag } from "antd"

export const QuestionSetRecommandations = ({ questionSet, hideIfCompliant = false }) => {
  return (
    <>
      {questionSet.recommendations?.cards.min || questionSet.recommendations?.questions.min ? (
        <Tag color="green" style={{ fontSize: 10 }}>
          Reco :{" "}
          {!!questionSet.recommendations.cards.min &&
            `${questionSet.recommendations.cards.min} 
            ${
              questionSet.recommendations.cards.max
                ? `à ${questionSet.recommendations.cards.max} cartes mémo - `
                : "cartes mémo min"
            }`}
          {!!questionSet.recommendations.questions.min &&
            `${questionSet.recommendations.questions.min} 
      ${
        questionSet.recommendations.questions.max
          ? `à ${questionSet.recommendations.questions.max} questions`
          : "questions min"
      } `}
        </Tag>
      ) : null}{" "}
    </>
  )
}
