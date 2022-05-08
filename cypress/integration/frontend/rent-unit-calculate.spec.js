/*
 * @LastEditors: Joseph Ocero
 * @DateCreated: 2022-05-04 14:32:26
 * @LastEditTime: 2022-05-08 12:43:32
 * @Description: Adding more use scenarious for PoplarHomes Calculator App
 **/

/// <reference types="cypress" />
import { Message } from "../../support/config";
import { getRandomFloat, checkNumber } from "../../support/helper";

context("Calculator App", () => {
  describe('Calculate monthly income for renter', () => {
    var monthly_income,
      data_credit_score,
      data_income_decimal,
      data_income,
      income_status,
      icon_pass,
      icon_notpass;
    const qualified_credit_score = 650,
        qualified_income_decimal = 2.5;

    before(() => {
      cy.getCurrentPrice()
      cy.navToCalculator()
      monthly_income = qualified_income_decimal * Cypress.env('current_price')
    });

    it('Verify the renter is qualified for a monthly income  with 250 percent higher based on the monthly rent', () => {
      monthly_income = qualified_income_decimal * Cypress.env('current_price')
      cy.typeFieldsInCalculator(monthly_income, qualified_credit_score); //250% = 2.5 in decimal given credit_score is qualified
      cy.clickButton("Find Out")
      cy.verifyResponseInCalculator(Message["status"].qualified, qualified_income_decimal, qualified_credit_score, 'check-mark', 'check-mark')
      cy.verifyButton('enabled', 9)

      cy.clickButton("Start Over");
    });

    it('Verify the renter is not qualified to have a monthly income at most 249 percent based on the monthly rent', () => {
      data_income_decimal = 2.49
      monthly_income = data_income_decimal * Cypress.env('current_price')
      cy.typeFieldsInCalculator(monthly_income, qualified_credit_score)
      cy.clickButton("Find Out"); //check if submit button "Find Out" is enabled or not, if enabled click the button
      cy.verifyResponseInCalculator(Message["status"].disqualified, data_income_decimal.toFixed(1), qualified_credit_score, 'cross-mark', 'check-mark')

      cy.clickButton("Start Over");
    });

    it('Verify renter is qualified or not with monthly income and credit score on randomly selected data', () => {
      const maxLimit = 999,
        total_random_data = 6;
      var income_status;
  
      for (const cnt of Array(total_random_data).keys()) {
        data_credit_score = Math.floor(Math.random() * maxLimit)
        data_income_decimal = getRandomFloat(1.5, 3.5, 2).toFixed(1); // round up to one decimal place
        income_status = Message["status"].disqualified;
        if (data_credit_score >= qualified_credit_score && data_income_decimal >= 2.5){
            income_status = Message["status"].qualified;
        }
        monthly_income = data_income_decimal * Cypress.env('current_price');

        cy.typeFieldsInCalculator(monthly_income, data_credit_score)
        cy.clickButton("Find Out")
        cy.verifyResponseInCalculator(income_status, data_income_decimal, data_credit_score)

        cy.clickButton("Start Over")
      }
    });

    it('Verify banner messages and cross|check mark icons are correct', () => {

      data_income = [
        [2.6, 649], //income = passed, credit_score = failed
        [2.5, 650], //income = passed, credit_score = passed
        [2.4, 650], //income = failed, credit_score = passed
        [2.3, 649]  //income = failed, credit_score = failed
      ];

      data_income.forEach(function (data) {
        data_credit_score = data[1];
        data_income_decimal = data[0];
        income_status = Message["status"].disqualified;
        icon_pass = "cross-mark";
        icon_notpass = "cross-mark";
        if (data_credit_score >= 650 && data_income_decimal >= 2.5){
          income_status = Message["status"].qualified;
          icon_pass = "check-mark"
          icon_notpass = "check-mark"
        }else if (data_credit_score <= 649 && data_income_decimal >= 2.5){
          icon_pass = "check-mark"
          icon_notpass = "cross-mark";

        }else if (data_credit_score >= 650 && data_income_decimal <= 2.49){
          icon_pass = "cross-mark"
          icon_notpass = "check-mark";

        }else {}
       
        monthly_income = data_income_decimal * Cypress.env('current_price')
        cy.typeFieldsInCalculator(monthly_income, data_credit_score)
        cy.clickButton("Find Out")
        cy.verifyResponseInCalculator(income_status, data_income_decimal, data_credit_score, icon_pass, icon_notpass)
        
        cy.clickButton("Start Over")
      });
    });

    it('Verify the renter is qualified having a credit score between 650 to 999', () => {

      var credit_scores = [1, 99, 400, 500, 649, 650, 651, 800, 900, 999 ];
      
      credit_scores.forEach(function (score) {
        income_status = Message["status"].disqualified;
        icon_pass = "check-mark";
        icon_notpass = "cross-mark";
        monthly_income = qualified_income_decimal * Cypress.env('current_price');

        if (score >= qualified_credit_score){
          income_status = Message["status"].qualified;
          icon_notpass = "check-mark"
        }else {}
        
        cy.typeFieldsInCalculator(monthly_income, score)
        cy.clickButton("Find Out")
        cy.verifyResponseInCalculator(income_status, qualified_income_decimal, score, icon_pass, icon_notpass)
        
        cy.clickButton("Start Over")
      });
    });
    
    it('Verify the text labels are correct', () => {
      cy.verifyTextLabelCalculator() 
    });

    it('Verify submit button will be enabled if monthly income and credit score are valid inputs', () => {
          
      data_income = [
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

    
      data_income.forEach(function (data) {
        data_credit_score = data[1];
        monthly_income = data[0];

        cy.typeFieldsInCalculator(monthly_income, data_credit_score);
        //valid inputs are monthly income & credit score are numbers greater than 0
        if ((checkNumber(data_credit_score) && data_credit_score > 0) && (checkNumber(monthly_income) && monthly_income > 0)){
          cy.verifyButton('enabled', 9)
        }else {
          cy.verifyButton('disabled', 11);
        }
      });
    });

    it('Verify monthly income input field should only accept maximum of 12 characters', () => {
          
      data_income = [
          [123456789012, 650], //button = enabled
          [123456789.01, 650], //button = enabled
          [1234567890.12, 650], //button = disabled
          [1234567890123, 650], //button = disabled
      ];
  
      data_income.forEach(function (data) {
          data_credit_score = data[1];
          monthly_income = data[0];

        cy.typeFieldsInCalculator(monthly_income, data_credit_score);
        cy.get("input[placeholder='Enter Monthly Income']").eq(0).invoke('val').then((text) => {
          if (text.length > 12) {
            cy.verifyButton('disabled', 11)
          }
        })
      })
    });
  });
});