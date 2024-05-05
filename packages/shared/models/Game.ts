import "firebase/firestore"
import { QUESTION_TYPES } from "../constants"
import { callApi } from "../helpers"
import FirebaseObject from "./FirebaseObject"

class Game extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/games`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/games`
  }

  static async create(params) {
    return await callApi("apiGamesParticipate", params)
  }

  static fetchAll(collectionParams = { challengeId: null }, options) {
    return super.fetchAll(collectionParams, options)
  }

  static buildQuestion(question, randomizeChoices, canDisplayNegativeChoices) {
    if (question.image) {
      question.image = preloadImage(question.image)
    }

    question.Blocks = []
    let choicesArray
    let choicesCountLimited = false
    if (question.choices) {
      choicesArray = question.choices.split("|")

      if (randomizeChoices) {
        choicesArray = getShuffledArr(choicesArray)
      }

      if (question.choiceCount > 0) {
        if (choicesArray.length > question.choiceCount) {
          choicesCountLimited = true
        }
        choicesArray = choicesArray.slice(0, question.choiceCount)
      }

      const choicesValues =
        question.type !== QUESTION_TYPES.PAIRING
          ? choicesArray
          : choicesArray.map((x) => x.split(";")[0])
      question.Blocks = choicesValues.map((choice, index) => {
        const choiceValue = choice.split(";")
        return {
          index: index,
          id: "b" + choiceValue[0] + index,
          text: choiceValue[0],
          image: choiceValue[1] ? preloadImage(choiceValue[1]) : null,
        }
      })

      if (question.textNegative) {
        const isNegative = canDisplayNegativeChoices
          ? true
          : Math.random() >= 0.5
        if (isNegative) {
          question.isNegative = true
          question.text = question.textNegative
        }
      }
    }

    if (question.type === QUESTION_TYPES.PAIRING) {
      question.solution = ""
      choicesArray?.forEach((peer, index) => {
        peer = peer.split(";")
        question.solution += `<br/><b>"${peer[0]}</b>" ➡️ "${peer[1]}" `
      })
      question.Answers = choicesArray
        ?.map((x) => x.split(";")[1])
        .filter((x, i) => question.Blocks.findIndex((y) => y.index === i) > -1)
        .sort(() => Math.random() - Math.random())
        .map((item, index) => {
          return { text: item, id: "a" + item + index, index: index }
        })
    } else if (question.type === QUESTION_TYPES.SEQUENCING) {
      if (question.solutions) {
        question.solution = question.solutions
        question.Answers = question.solutions
          .split("|")
          .filter((x) => question.Blocks.findIndex((y) => y.text === x) > -1)
      }
    } else if (question.type === QUESTION_TYPES.CARD) {
      question.Answers = [""]
    } else if (
      question.type === QUESTION_TYPES.MCQTEXT ||
      question.type === QUESTION_TYPES.MCQIMAGES
    ) {
      // Add no answer label
      const choices = question.Blocks.map((choice) => choice.text)
      let solutions =
        question.solutions?.split("|").filter((solution) => {
          return choices.find((choice) => choice === solution)
        }) || []

      if (choicesCountLimited) {
        const noAnswerLabel = "Aucune des réponses"
        question.Blocks.push({
          index: question.Blocks.length,
          id: "none" + question.Blocks.length,
          text: noAnswerLabel,
          image: null,
          option: null,
        })
      }

      if (question.isNegative) {
        solutions = choices.filter((el) => !solutions.includes(el))
      }

      // if (solutions.length === 0) {
      //   solutions.push(noAnswerLabel)
      // }
      question.solution = solutions.join("|")
      question.Answers = solutions
    }

    return question
  }
}

export default Game

const preloadImage = (image) => {
  // const imgElem = new Image();
  const url = getGDriveUrl(image)
  if (!url) {
    return image
  } else {
    // imgElem.src = url
    // preloadedImages.push(imgElem)
    return url
  }
}

const getGDriveUrl = (url) => {
  const imageId =
    url.match(/id=(.*)/) ||
    url.match(/https:\/\/drive\.google\.com\/file\/d\/(.*)\/view/) ||
    false
  if (imageId) {
    return `https://drive.google.com/uc?export=view&id=${imageId[1]}`
  } else {
    return false
  }
}

const getShuffledArr = (arr) => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
  }
  return newArr
}
