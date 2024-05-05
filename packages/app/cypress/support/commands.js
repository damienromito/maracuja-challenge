// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/functions"

import "firebase/firestore"
import { attachCustomCommands } from "cypress-firebase"

const firebaseConfig = {
  apiKey: API_KEY
  projectId: "english-challenge-test",
}

console.log("Cypress.env():", Cypress.env())
console.log("PROC", process.env)
firebase.initializeApp(firebaseConfig)
// firebase.firestore().settings({ experimentalForceLongPolling: true })
firebase.firestore().useEmulator("localhost", 8081)
firebase.firestore().settings({
  experimentalForceLongPolling: true,
  host: "localhost:8081",
  ssl: false,
})

// Emulate Firestore
firebase.auth().useEmulator("http://localhost:9099")
firebase.app().functions("europe-west1").useEmulator("localhost", 5001)
firebase.auth().useDeviceLanguage()
attachCustomCommands({ Cypress, cy, firebase })

// https://github.com/prescottprue/cypress-firebase
Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})

Cypress.Commands.add("selectChallenge", (code = "sopna") => {
  // cy.wait(1000)
  // cy.getBySel('button-show-input-code').click()
  cy.getBySel("input-code").type(code)
  cy.getBySel("button-submit-code").click()
})

Cypress.Commands.add("signupEmailPassword", (email = "admin@maracuja.ac", password = "azertu") => {
  // cy.wait(1000)
  cy.getBySel("input-email").type(email)
  cy.getBySel("input-password").type(password)
  cy.getBySel("button-submit").click()
})

Cypress.Commands.add("clean", () => {
  cy.visit("/clean")
})
