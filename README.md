# QA Automation

Welcome to QA Poplar Homes Automation.

## Folder Structure

- fixtures - contains the test data. for the current setup, the current location is in the drive 

- integration - contains the API, Backend and Functional test cases 

- plugins - deals with operations outside the application under tests (i.e, database connections)

- support - contains the custom commands and function libraries to support the automation

## Installation

- from the command(windows)/shell(linux), send the command "npm install". This will install all dependencies including the cypress. for references of the needed items to install are mentioned in package.json

## Requirements

As for those who wishes to use this automation, the IDE that we are using is Visual Studio Code.

- [GIT] - a free and open source distributed version control system. you need to install and configure to connect to github

- [Visual Studio] - A text editor suitable for any javascript coding
  Link : https://code.visualstudio.com/
  Installer: https://code.visualstudio.com/

++ [Extensions] - Once you have installed the VS Code, from the left navigation bar, open the extension icon (box icon) and it will show the list of the extensions. Please install the following
Beautify - This is to beautify the code
GitHub - Connects to GitHub repository
TODO Highlight - This will help you to comment the codes that are yet to be done

++ [VS Code Settings] - To change the settings on the VS Code, I would recommend to change the following settings
From File > Preferences > Settings, Navigate to Text Editor > Formatting and check the following options
_ Format on Paste - automatically formats once you paste the code copied from other scripts
_ Format on Save - automatically formats the code once you save the file

## Post-Requisite

After the cloning of this repository, please run "npm install" on windows and "sudo npm install" on linux / mac to install the dependencies.


## Running

To run the application, there are few ways to perform.

For UI view, just send the command 
"npm run cy:open". 
For details on the script, please check the package.json on script section.

## Test Case Creation

1. Verify the renter is qualified for a monthly income with 250 percent based on the monthly rent
2. Verify the renter is not qualified to have a monthly income at most 249 percent based on the monthly rent
3. Verify the renter is qualified or not with monthly income and credit score on randomly selected data
4. Verify banner messages and cross|check mark icons are correct
5. Verify the renter is qualified having a credit score between 650 to 999
6. Verify the text labels are correct
7. Verify submit button will be enabled if monthly income and credit score are valid inputs
8. Verify monthly income input field should accept maximum of 12 characters

