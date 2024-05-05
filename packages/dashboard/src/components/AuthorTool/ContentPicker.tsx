import { ACTIVITY_TYPES, QUESTION_TYPES, QUESTION_TYPES_NAMES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { mapToArray, objectSubset } from "@maracuja/shared/helpers"
import { QuestionSet, Theme } from "@maracuja/shared/models"
import { Table, Tag } from "antd"
import { useEffect, useMemo, useState } from "react"
import styled from "styled-components"

export default ({ onSelect, selectedIds = [] }) => {
  const { currentChallenge } = useCurrentChallenge()
  const [themes, setThemes] = useState<any>([])
  const [contents, setContents] = useState<any>([])
  const [questionSets, setQuestionSets] = useState<any>([])

  useEffect(() => {
    loadThemes()
    const unsubQuestionSets = loadAllQuestionSets()
    return () => {
      unsubQuestionSets()
    }
  }, [])

  const loadAllQuestionSets = () => {
    return QuestionSet.fetchAll(
      { challengeId: currentChallenge.id },
      {
        listener: (objects) => {
          setQuestionSets(objects)
        },
      }
    )
  }

  const loadThemes = async () => {
    const themes = await Theme.fetchAllFromModules({ modules: currentChallenge.modules })
    setThemes(themes)

    const contentsData = []
    themes.forEach((theme) => {
      theme.questions?.forEach((question) => {
        question.theme = objectSubset(theme, ["id", "name"])
        contentsData.push(question)
      })
    })
    setContents(contentsData)
  }

  const columns = useMemo(() => {
    const typeFilters = [
      { text: QUESTION_TYPES_NAMES[QUESTION_TYPES.CARD], value: QUESTION_TYPES_NAMES[QUESTION_TYPES.CARD] },
      { text: QUESTION_TYPES_NAMES[QUESTION_TYPES.MCQIMAGES], value: QUESTION_TYPES_NAMES[QUESTION_TYPES.MCQIMAGES] },
      { text: QUESTION_TYPES_NAMES[QUESTION_TYPES.MCQTEXT], value: QUESTION_TYPES_NAMES[QUESTION_TYPES.MCQTEXT] },
      { text: QUESTION_TYPES_NAMES[QUESTION_TYPES.PAIRING], value: QUESTION_TYPES_NAMES[QUESTION_TYPES.PAIRING] },
      { text: QUESTION_TYPES_NAMES[QUESTION_TYPES.SEQUENCING], value: QUESTION_TYPES_NAMES[QUESTION_TYPES.SEQUENCING] },
    ]
    const levelFilters = [
      { text: "Non défini", value: "0" },
      { text: "Niveau 1", value: "1" },
      { text: "Niveau 2", value: "2" },
      { text: "Niveau 3", value: "3" },
    ]

    const themeFilters = themes.map((theme) => {
      return { text: theme.name, value: theme.id }
    })

    const questionSetsFilters = mapToArray(currentChallenge.questionSets, {
      initializer: (qs) => {
        return { text: qs.name, value: qs.id, startDate: qs.startDate.toDate() }
      },
      sortedByProp: "startDate",
    })

    return [
      { title: "Texte", dataIndex: "text", key: "text" },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        filters: typeFilters,
        onFilter: (value, record) => record.type === value,
        width: 75,
      },
      {
        title: "Niv.",
        dataIndex: "level",
        key: "level",
        filters: levelFilters,
        onFilter: (value, record) => record.level === value,
        width: 50,
      },
      {
        title: "Déjà dans",
        dataIndex: "questionSets",
        key: "questionSets",
        filters: questionSetsFilters,
        onFilter: (value, record) => record.questionSetsIds?.includes(value),
      },
      {
        title: "Theme",
        dataIndex: "theme",
        key: "theme",
        filters: themeFilters,
        onFilter: (value, record) => record.themeId === value,
      },
    ]
  }, [themes])

  const rowSelection = {
    onSelect: (record, selected) => {
      onSelect({ selected, content: contents.find((content) => content.id === record.key) })
    },

    selectedRowKeys: selectedIds,
    hideSelectAll: true,
  }

  const dataSource = contents.map((content) => {
    const questionSetAlreadyContains = questionSets.filter((qs) => {
      return qs.questions?.find((q) => q.id === content.id)
    })
    const QuestionSetsTags = (
      <>
        {questionSetAlreadyContains.map((qs) => {
          return (
            <Tag key={qs.id} color={qs.type === ACTIVITY_TYPES.CONTEST ? "orange" : "green"}>
              {qs.name}
            </Tag>
          )
        })}
      </>
    )
    return {
      key: content.id,
      text: content.text,
      type: QUESTION_TYPES_NAMES[content.type],
      level: content.level,
      questionSets: QuestionSetsTags,
      questionSetsIds: questionSetAlreadyContains.map((qs) => qs.id),
      theme: content.theme.name,
      themeId: content.theme.id,
    }
  })

  return (
    <Wrapper>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowSelection={{ ...rowSelection }}
        scroll={{ y: window.innerHeight - 150 }}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: white;
  /* overflow-y: scroll; */
  /* max-height: calc(100vh - 100px); */
  [type="checkbox"] + span:not(.lever) {
    padding-left: 17px;
    height: 22px;
  }
`
