
describe('Login to the sopna challenge', () => {
  before(() => {
    cy.clean()
    // cy.visit('/')
  })

  it('select the challenge', () => {
    cy.selectChallenge('AQUITEL')
  })

  it('Login', () => {
    cy.getBySel('button-join').click()
    cy.getBySel('button-login').click()
    cy.signupEmailPassword()
    cy.wait(3000)
  })
})
