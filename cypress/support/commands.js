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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//Visit to rental calculator menu
  Cypress.Commands.add('navigateToCalculator', () => {
    cy.visit(`${Cypress.env('baseURL')}/l/${Cypress.env('tenantId')}#overview`);
      cy.wait(1100)
      cy.contains('h3', "Find out if you're prequalified").click();
      cy.wait(300)
  });
  
  /*
   * Get the current Price
   * for the rental & saved in the cypress environment file
   */
  Cypress.Commands.add('getCurrentPrice', () => {
    cy.get("span[class='current_price']").then(function($price) {
      const get_price = $price.text().split('$');  // need to split by '$' since the raw data is like this $2,500.00$2,500.00
      Cypress.env('current_price', get_price[1].replace(',', '')); // do clean up by replace '
    });
  });

  /*
   * To check if most of the text display found 
   * in the calculator menu should be intact and correct
   */
  Cypress.Commands.add('verifyTextLabelCalculator', () => {
       // Text validation
       cy.get("div.btn-individual > button").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('Just Me')
      });
      cy.get("div:nth-child(1) > label").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('Monthly Income');
      });
      cy.get("div:nth-child(1) > label").eq(1).invoke('text').then((text) => {
          expect(text.trim()).equal('Credit Score');
      });
      cy.get("div.tab-pages > div.actions").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('Find Out');
    });
  });
  /*
   * Typing input fields
   * for monthly income and credit score
   */
  Cypress.Commands.add('typeFieldsInCalculator', (income, score) => {
    cy.get("input[placeholder='Enter Monthly Income']")
      .eq(0)
      .clear()
      .type(income.toString(), {force: true});
  
    cy.get("input[placeholder='Enter Credit Score']")
      .eq(0)
      .clear()
      .type(score.toString(), {force: true});
  });
  /*
   * Typing input fields
   * for monthly income and credit score
   */
  Cypress.Commands.add('verifyResponseInCalculator', (status, incomePercentage, creditScore, incomeResult = null, creditScoreResult = null) => {
    cy.get('p').contains(status).invoke('text').then((text) => {
      expect(text.trim()).equal(status)
    });
    cy.get('p').contains(incomePercentage.toString())
    cy.get('p').contains("x the monthly rent")
    cy.get('p').contains(creditScore.toString())
    cy.get('p').contains(" Credit Score")
    if ( incomeResult && creditScore) { 
      cy.get("img[alt='Passed']").should('have.attr', 'src', `//static-assets.onerent.co/img/qualification-calculator/${incomeResult}.png`)
      cy.get("img[alt='Not Passed']").should('have.attr', 'src', `//static-assets.onerent.co/img/qualification-calculator/${creditScoreResult}.png`)
    }
    
  });

  Cypress.Commands.add('verifySubmitButtonCalculator', (buttonLabel, statusButton = 'enabled', clk = false) => {
    
    cy.get("button[type='button']").eq(9).should(`be.${statusButton}`).then(() => {
      //click button
      if (clk) {
       cy.get("button").contains(buttonLabel).click()
      }
    })
  });

  Cypress.Commands.add('verifyButtonDisabled', () => {
    
    cy.get("button[type='button']").eq(11).should("be.disabled")
  });




  
  
