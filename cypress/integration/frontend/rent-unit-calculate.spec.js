/*
 * @LastEditors: Joseph Ocero
 * @DateCreated: 2022-05-04 14:32:26
 * @LastEditTime: 2022-05-06 22:43:32
 * @Description: Adding more use scenarious for PoplarHomes Calculator App
 **/

/// <reference types="cypress" />
import { Message } from "../../support/config";

context("Calculator App", () => {
  describe('Basic features for house rental calculator', () => {
    var current_price;
    var monthly_income;
    // const clk = true
    var credit_score = 650;
    var income_decimal = 2.5;
    const clk = true;

    before(() => {
      cy.getCurrentPrice()
      cy.navToCalculator()
      monthly_income = income_decimal * Cypress.env('current_price')
    });
    // afterEach(() => {
    //   cy.submitButtonCalculator("Start Over", 'enabled', clk);
    // })
  
    it('Verify the renter is qualified for a monthly income  with 250 percent higher based on the monthly rent', () => {
      monthly_income = income_decimal * Cypress.env('current_price')
      cy.typeFieldsInCalculator(monthly_income, credit_score); //250% = 2.5 in decimal given credit_score is qualified
      cy.submitButtonCalculator("Find Out", 'enabled', clk)
      cy.verifyResponseInCalculator(Message["status"].qualified, income_decimal, credit_score, 'check-mark', 'check-mark')
      cy.verifyButton('enabled', 9)

      cy.submitButtonCalculator("Start Over", 'enabled', clk);
    });

    it('Verify the renter is not qualified to have a monthly income at most 249 percent based on the monthly rent', () => {
      income_decimal = 2.49
      monthly_income = income_decimal * Cypress.env('current_price')
      cy.typeFieldsInCalculator(monthly_income, credit_score)
      cy.submitButtonCalculator("Find Out", 'enabled', clk); //check if submit button "Find Out" is enabled or not, if enabled click the button
      cy.verifyResponseInCalculator(Message["status"].disqualified, income_decimal.toFixed(1), credit_score, 'cross-mark', 'check-mark')

      cy.submitButtonCalculator("Start Over", 'enabled', clk);
    });

    it('Verify renter is qualified or not with monthly income and credit score randomly selected data', () => {
      const maxLimit = 999,
        total_random_data = 6;
      var income_status, 
        rand_credit_score,
        rand_income_decimal;
  
      for (const cnt of Array(total_random_data).keys()) {
        rand_credit_score = Math.floor(Math.random() * maxLimit)
        rand_income_decimal = getRandomFloat(1.5, 3.5, 2).toFixed(1); // round up to one decimal place
        income_status = Message["status"].disqualified;
        if (rand_credit_score >= credit_score && rand_income_decimal >= 2.5){
            income_status = Message["status"].qualified;
        }
        monthly_income = rand_income_decimal * Cypress.env('current_price')
        cy.typeFieldsInCalculator(monthly_income, rand_credit_score)
        cy.submitButtonCalculator("Find Out", 'enabled', clk)
        cy.verifyResponseInCalculator(income_status, rand_income_decimal, rand_credit_score)

        cy.submitButtonCalculator("Start Over", 'enabled', clk)
      }
    });

    it('Verify banner messages and cross-check mark logo are correct', () => {

      var dataIncome_status = [
        [2.5, 650], //income = passed, credit_score = passed
        [2.6, 649], //income = passed, credit_score = failed
        [2.4, 650], //income = failed, credit_score = passed
        [2.3, 649]  //income = failed, credit_score = failed
      ];
      var income_status;
      var passed;
      var notpassed;
      var income_decimal;

      dataIncome_status.forEach(function (data) {
        credit_score = data[1];
        income_decimal = data[0];
        income_status = Message["status"].disqualified;
        passed = "cross-mark";
        notpassed = "cross-mark";
        if (credit_score >= 650 && income_decimal >= 2.5){
          income_status = Message["status"].qualified;
          passed = "check-mark"
          notpassed = "check-mark"
        }else if (credit_score <= 649 && income_decimal >= 2.5){
          passed = "check-mark"
        }else if (credit_score >= 650 && income_decimal <= 2.49){
          notpassed = "check-mark"
        }else {}
       
        monthly_income = income_decimal * Cypress.env('current_price')
        cy.typeFieldsInCalculator(monthly_income, credit_score)
        cy.submitButtonCalculator("Find Out", 'enabled', clk)
        cy.verifyResponseInCalculator(income_status, income_decimal, credit_score, passed, notpassed)
        
        cy.submitButtonCalculator("Start Over", 'enabled', clk)
      });
    });

    it('Verify the qualified renter have at least 650 credit score up to 999', () => {

      var dataIncome_status = [
        [2.5, 649], //income = failed, credit_score = failed, Status = disqualified
        [2.5, 650], //income = passed, credit_score = passed, Status = qualified
        [2.5, 800], //income = passed, credit_score = passed, Status = qualified
        [2.5, 999]  //income = passed, credit_score = passed, Status = qualified
      ];
      var income_status;
      var passed;
      var notpassed;
      var income_decimal;
    
      dataIncome_status.forEach(function (data) {
        credit_score = data[1];
        income_decimal = data[0];
        income_status = Message["status"].disqualified;
        passed = "cross-mark";
        notpassed = "cross-mark";
        if (credit_score >= 650 && income_decimal >= 2.5){
          income_status = Message["status"].qualified;
          passed = "check-mark"
          notpassed = "check-mark"
        }else if (credit_score <= 649 && income_decimal >= 2.5){
          passed = "check-mark"
        }else if (credit_score >= 650 && income_decimal <= 2.49){
          notpassed = "check-mark"
        }else {}
       
        monthly_income = income_decimal * Cypress.env('current_price')
        cy.typeFieldsInCalculator(monthly_income, credit_score)
        cy.submitButtonCalculator("Find Out", 'enabled', clk)
        cy.verifyResponseInCalculator(income_status, income_decimal, credit_score, passed, notpassed)
        
        cy.submitButtonCalculator("Start Over", 'enabled', clk)
      });
    });
    
    it('Verify the text labels are correct', () => {
      cy.verifyTextLabelCalculator() 
    });

    it('Verify submit button will be enabled if monthly income and credit score are valid inputs', () => {
          
      var dataIncome_status = [
        [6000, 650], //button = enabled;  [monthly_income, credit_score]
        [6000, 100.00], //button = enabled
        [-1, 650],    //button = disabled
        [0, 650],     //button = disabled
        ['-10-10', 650], //button = disabled
        [6000, '-10-10'], //button = disabled
        [-1, -1],     //button = disabled
        [6000, -1],   //button = disabled
        [0, 0],       //button = disabled
        [6000, 0]   //button = disabled
      ];

      var monthly_income;
    
      dataIncome_status.forEach(function (data) {
        credit_score = data[1];
        monthly_income = data[0];

        cy.typeFieldsInCalculator(monthly_income, credit_score);

        if ((checkNumber(credit_score) && credit_score > 0) && (checkNumber(monthly_income) && monthly_income > 0)){
          cy.verifyButton('enabled', 9)
        }else {
          cy.verifyButton('disabled', 11);
        }
      });
    });

    it('Verify monthly income input field should only accept maximum of 12 characters', () => {
          
      var data_income_status = [
          [123456789012, 650], //button = enabled
          [123456789.01, 650], //button = enabled
          [1234567890.12, 650], //button = disabled
          [1234567890123, 650], //button = disabled
      ];
    
      var monthly_income;
      var credit_score;
      
      data_income_status.forEach(function (data) {
          credit_score = data[1];
          monthly_income = data[0];

        cy.typeFieldsInCalculator(monthly_income, credit_score);
        cy.get("input[placeholder='Enter Monthly Income']").eq(0).invoke('val').then((text) => {
          if (text.length > 12) {
            cy.verifyButton('disabled', 11)
          }
        })
      })
    });
  });
});

  /*
   * generate random float
   */
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

  /*
   * validation if its a number or not
   */
function checkNumber(x) {
  var isNum = false;
  if(typeof x == 'number' && !isNaN(x)){
      isNum = true;
  }
  return isNum;
}