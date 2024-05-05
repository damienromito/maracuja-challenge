describe('Login to the sopna challenge', () => {
  before(() => {
    cy.visit('/clean')
    // cy.visit('/')
  })

  it('select the challenge', () => {
    cy.selectChallenge('AQUITEL')
  })

  const params = {
    tribeName: 'Equitation',
    clubName: 'FFE',
    username: 'Damien',
    role: 'captain',
    email: 'tom@maracuja.ac'
  }

  it('Login', () => {
    cy.getBySel('button-join').click()
    cy.getBySel('button-signup').click()
  })

  it('Signup League Picker', () => {
    cy.getBySel('input-league').type(params.tribeName)
    cy.getBySel('item-league-0').click()
  })

  it('Signup Club Picker', () => {
    cy.getBySel('input-club').type(params.clubName)
    cy.getBySel('item-club-0').click()
  })

  it('Signup Club ', () => {
    cy.getBySel('input-username').type(params.username)
    cy.get(`[data-test=radio-role] input[value=${params.role}]`).click()
    cy.getBySel('button-submit').click()
  })

  it('Signup Email Password ', () => {
    cy.signupEmailPassword(params.email)
  })
})
