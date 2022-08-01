export const getNonDisabled = (cypressQuery: string) => cy.get(cypressQuery).not('[aria-disabled="true"]')
