const params = {
  tribeName: "Equitation",
  clubName: "FFE",
  username: "Damien",
  role: "CAPTAIN",
  email: "tom@maracuja.ac",
  password: "azertu",
  challengeCode: "TEST",
}

describe("Login to the AQUITEL challenge", () => {
  before(() => {
    cy.clean()
    cy.callFirestore("delete", "users", { where: ["email", "==", "tom@maracuja.ac"] })
    cy.wait(3000)
  })

  it("select the challenge", () => {
    cy.selectChallenge(params.challengeCode)
  })

  // it("Demande de s'incrire au challenge", () => {
  //   cy.getBySel("button-join").click()
  //   cy.getBySel("button-signup").click()
  // })

  // it("Passe la liste blanche", () => {
  //   cy.getBySel("input-whitelist-email").type(params.email)
  //   cy.getBySel("button-submit").click()
  // })

  // it("S'enregistre dans le club", () => {
  //   cy.getBySel("input-username").type(params.username)
  //   cy.getBySel("button-submit").click()
  // })

  // it("Signup Email Password ", () => {
  //   cy.getBySel("input-password").type(params.password)
  //   cy.getBySel("button-submit").click()
  // })

  // it("Join the team ", () => {
  //   cy.get("[data-test=button-join]", {
  //     timeout: 20000,
  //   }).should("be.visible")
  //   cy.getBySel("button-join").click()
  // })
})
