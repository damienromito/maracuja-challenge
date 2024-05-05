import firebase from 'firebase/app'
import 'firebase/firestore'
import contestData from '../../fixtures/questionSets/contest.json'
import { Game } from '@maracuja/shared/models'
import { ROUTES } from '../../../src/constants'
import 'cypress-localstorage-commands'

const challengeId = '4xsecurite-aquitelgroupea'
const contestId = 'test-contest'
const phaseId = 'trainings_L'
const questions = contestData.questions.map(q => Game.buildQuestion(q))

describe('Login to the sopna challenge', () => {
  before(() => {
    // Supprimer les quiz au jour d'aujourdui
    cy.callFirestore('delete', `challenges/${challengeId}/questionSets/${contestId}`)
    cy.callFirestore('delete', `challenges/${challengeId}/games`, { where: ['questionSet.id', '==', contestId] })

    // Créer un quiz au jour d'aujourdhui
    const startDate = new Date()
    startDate.setHours(startDate.getHours() - 2)
    const endDate = new Date()
    endDate.setHours(endDate.getHours() + 2)
    contestData.startDate = firebase.firestore.Timestamp.fromDate(startDate)
    contestData.createdAt = firebase.firestore.Timestamp.fromDate(startDate)
    contestData.editedAt = firebase.firestore.Timestamp.fromDate(startDate)
    contestData.endDate = firebase.firestore.Timestamp.fromDate(endDate)
    cy.callFirestore('set', `challenges/${challengeId}/questionSets/${contestId}`, contestData)
    cy.callFirestore('update', `challenges/${challengeId}/phases/${phaseId}`, { endDate: contestData.endDate })

    cy.clean()
    window.localStorage.removeItem('challengeId')
    window.localStorage.removeItem('organisationId')
    // cy.login() //dont work
  })

  it('Select Challenge', () => {
    // cy.setLocalStorage('challengeId', '4xsecurite-aquitelgroupea')
    // cy.visit('/')
    cy.selectChallenge('AQUITEL')
  })

  it('Login', () => {
    cy.getBySel('button-join').click()
    cy.getBySel('button-login').click()
    cy.signupEmailPassword()
  })

  it('Launch game', () => {
    cy.getBySel('button-play').click({ force: true })
    cy.getBySel('button-play').click({ force: true })
    cy.getBySel('button-play').click({ force: true })
    cy.wait(5000)
  })
})

for (let i = 0; i < questions.length; i++) {
  describe('Answer to question ' + i, function () {
    it('finds the Login link in the header', function () {
      cy.get('.question-text').then(elem => {
        const question = questions.find(q => q.text === elem.text())
        cy.get('.game-option').each(($option) => {
          const optionValue = $option.find('span').text()
          if (question.Answers.find(a => a === optionValue)) {
            cy.wrap($option).click()
          }
        })
        cy.getBySel('button-validation').click()
      })
    })
  })
}

describe('Sending game ', function () {
  it('Validate congrats page', function () {
    cy.getBySel('button-ok').click()
  })

  it('Game saved', function () {
    cy.getBySel('button-play').should('not.exist')
  })
})
