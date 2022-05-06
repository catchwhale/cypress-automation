/*
 * @LastEditors: Joseph Ocero
 * @DateCreated: 2022-05-04 14:32:26
 * @LastEditTime: 2022-05-06 22:43:32
 * @Description: Adding more use scenarious for PoplarHomes Calculator App
 **/

/// <reference types="cypress" />


context("Calculator App", () => {
  describe('Basic features for house rental calculation', () => {
    var current_price;
    const clk = true
    var credit_score = 650;
    var income_decimal = 2.5;

    beforeEach(() => {
      cy.navigateToCalculator()
      cy.getCurrentPrice()
      current_price = Number(Cypress.env('current_price'))
    });
  
    it('Verify the renter is qualified for a monthly income  with 250 percent higher based on the monthly rent', () => {

      cy.typeFieldsInCalculator(current_price * income_decimal, credit_score); //250% = 2.5 in decimal given credit_score is qualified
      cy.submitButtonCalculator("Find Out", 'enabled', clk)
      cy.verifyResponseInCalculator("Yes you're prequalified!", income_decimal, credit_score, 'check-mark', 'check-mark')
      cy.submitButtonCalculator("Start Over")
    });

    it('Verify renter is not qualified to have a monthly income 249 percent or less based on the monthly rent', () => {
      cy.typeFieldsInCalculator(current_price * 2.49, credit_score)
      cy.submitButtonCalculator("Find Out", 'enabled', clk); //check if submit button "Find Out" is enabled or not, if enabled click the button
      cy.verifyResponseInCalculator("Oops, you're not prequalified... yet", income_decimal, credit_score, 'cross-mark', 'check-mark')
      cy.submitButtonCalculator("Start Over")
     
    });

    it('Verify to check if qualified or not by supplying random data for both monthly income and credit score', () => {

      var monthly_income_decimal;
      const maxLimit = 999;
      var income_status;

      const total_number_data = 6
      for (const x of Array(total_number_data).keys()) {
        credit_score = Math.floor(Math.random() * maxLimit)
        monthly_income_decimal = getRandomFloat(1.5, 3.5, 2).toFixed(1); // round up to one decimal place
      
        if (credit_score <= 649 && monthly_income_decimal <= 2.49){
          income_status = "Oops, you're not prequalified... yet";
        }else if (credit_score <= 649 && monthly_income_decimal >= 2.5){
          income_status = "Oops, you're not prequalified... yet";

        }else if (credit_score >= 650 && monthly_income_decimal <= 2.49){
          income_status = "Oops, you're not prequalified... yet";

        } else{
          income_status = "Yes you're prequalified!";
        }
        cy.typeFieldsInCalculator(current_price * monthly_income_decimal, credit_score)
        cy.submitButtonCalculator("Find Out", 'enabled', clk)
        cy.verifyResponseInCalculator(income_status, monthly_income_decimal, credit_score)
        cy.submitButtonCalculator("Start Over", 'enabled', clk)
        cy.wait(100);
      }
    });

    it('Verify banner messages and mark logo for each monthly income and credit score', () => {

      var dataIncome_status = [
        [2.5, 651], //monthly_income_decimal = passed, credit_score = passed
        [2.4, 650], //monthly_income_decimal = failed, credit_score = passed
        [2.6, 649], //monthly_income_decimal = passed, credit_score = failed
        [2.3, 648]  //monthly_income_decimal = failed, credit_score = failed
      ];
      var income_status;
      var passed;
      var notpassed;
      var monthly_income_decimal;

      dataIncome_status.forEach(function (key) {
        credit_score = key[1];
        monthly_income_decimal = key[0];
        if (credit_score <= 649 && monthly_income_decimal <= 2.49){
          income_status = "Oops, you're not prequalified... yet";
          passed = "cross-mark"
          notpassed = "cross-mark"
        }
        else if (credit_score <= 649 && monthly_income_decimal >= 2.5){
          income_status = "Oops, you're not prequalified... yet";
          passed = "check-mark"
          notpassed = "cross-mark"
        }
        else if (credit_score >= 650 && monthly_income_decimal <= 2.49){
          income_status = "Oops, you're not prequalified... yet";
          passed = "cross-mark"
          notpassed = "check-mark"
        } else{
          income_status = "Yes you're prequalified!";
          passed = "check-mark"
          notpassed = "check-mark"
        }

        cy.typeFieldsInCalculator(current_price * monthly_income_decimal, credit_score)
        cy.submitButtonCalculator("Find Out", 'enabled', clk)
        cy.verifyResponseInCalculator(income_status, monthly_income_decimal, credit_score, passed, notpassed)
        cy.submitButtonCalculator("Start Over", 'enabled', clk)
        cy.wait(100)
      });
    });

    it('Verify the qualified renter have at least 650 credit score up to 999', () => {

      var dataIncome_status = [
        [2.5, 649], //monthly_income_decimal = failed, credit_score = failed, Status = disqualified
        [2.5, 650], //monthly_income_decimal = passed, credit_score = passed, Status = qualified
        [2.5, 800], //monthly_income_decimal = passed, credit_score = passed, Status = qualified
        [2.5, 999]  //monthly_income_decimal = passed, credit_score = passed, Status = qualified
      ];
      var income_status;
      var passed;
      var notpassed;
      var monthly_income_decimal;
    
      dataIncome_status.forEach(function (key) {
        credit_score = key[1];
        monthly_income_decimal = key[0];
        if (credit_score <= 649 && monthly_income_decimal <= 2.49){
          income_status = "Oops, you're not prequalified... yet";
          passed = "cross-mark"
          notpassed = "cross-mark"
        }
        else if (credit_score <= 649 && monthly_income_decimal >= 2.5){
          income_status = "Oops, you're not prequalified... yet";
          passed = "check-mark"
          notpassed = "cross-mark"
        }
        else if (credit_score >= 650 && monthly_income_decimal <= 2.49){
          income_status = "Oops, you're not prequalified... yet";
          passed = "cross-mark"
          notpassed = "check-mark"
        } else{
          income_status = "Yes you're prequalified!";
          passed = "check-mark"
          notpassed = "check-mark"
        }
    
        cy.typeFieldsInCalculator(current_price * monthly_income_decimal, credit_score)
        cy.submitButtonCalculator("Find Out", 'enabled', clk)
        cy.verifyResponseInCalculator(income_status, monthly_income_decimal, credit_score, passed, notpassed)
        cy.submitButtonCalculator("Start Over", 'enabled', clk)
        cy.wait(100)
      });
    });
    
    it('Verify the text labels are correct', () => {
      cy.verifyTextLabelCalculator() //Check all text labels should properly match
    });

    it('Verify the submit button should be enabled automatically if valid inputs are fill in for both monthly income and credit score', () => {
          
      var dataIncome_status = [
        [6000, 650], //button = enabled;  [monthly_income, credit_score]
        [-1, 650],    //button = disabled
        [0, 650],     //button = disabled
        ['-10-10', 650], //button = disabled
        [-1, -1],     //button = disabled
        [0, 0],       //button = disabled
        [6000, -1],   //button = disabled
        [6000, 0],    //button = disabled
        [6000, 100.00], //button = enabled
        [6000, '-10-10'] //button = disabled
      ];

      var monthly_income;
    
      dataIncome_status.forEach(function (key) {
        credit_score = key[1];
        monthly_income = key[0];

        cy.typeFieldsInCalculator(monthly_income, credit_score);
        cy.wait(200);
    
        if ((checkNumber(credit_score) && credit_score > 0) && (checkNumber(monthly_income) && monthly_income > 0)){
          cy.log(`${credit_score} is valid and ${monthly_income} is valid!`);
          cy.submitButtonCalculator("Find Out", 'enabled');
        }else if ((checkNumber(credit_score) && credit_score < 1) && (checkNumber(monthly_income) && monthly_income < 1)){
          cy.log(`${credit_score} is invalid and ${monthly_income} is invalid!`);
          cy.verifyButtonDisabled();
        } else if ((!checkNumber(credit_score) || credit_score < 1)  && (checkNumber(monthly_income) && monthly_income > 0)) { 
          cy.log(`${credit_score} is invalid and ${monthly_income} is valid!`);
          cy.verifyButtonDisabled();
        }else if ((checkNumber(credit_score) && credit_score > 0) && (!checkNumber(monthly_income) || monthly_income < 1)) {
          cy.log(`${credit_score} is valid and ${monthly_income} is invalid!`);
          cy.verifyButtonDisabled();
        } else {}
      });
    });

    it('Verify monthly income input field should accept maximum of 12 characters', () => {
          
      var data_income_status = [
          [123456789012, 650], //button = enabled
          [123456789.01, 650], //button = enabled
          [1234567890.12, 650], //button = disabled
          [1234567890123, 650], //button = disabled
      ];
    
      var monthly_income;
      var credit_score;
      
      data_income_status.forEach(function (income) {
          credit_score = income[1];
          monthly_income = income[0];

        cy.typeFieldsInCalculator(monthly_income, credit_score);
        cy.wait(200);
        cy.get("input[placeholder='Enter Monthly Income']", {
          timeout: 15000
        }).eq(0).invoke('val').then((text) => {
          if (text.length > 12) {
            cy.verifyButtonDisabled();
          }
        })
      })
    });
  });
});

// generate random float
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

// check if its a number or not
function checkNumber(x) {
  var isNum = false
  // check if the passed value is a number
  if(typeof x == 'number' && !isNaN(x)){
      isNum = true
  }
  return isNum
}