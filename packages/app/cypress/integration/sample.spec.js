describe('My first Test', () => {
  it('Fin elem', () => {
    // expect(true).to.equal(true)
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()
    cy.pause()
    cy.url()
      .should('include', 'commands/actions')

    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
