# The project is implemented using the ```JavaScript``` and the ```Webpack``` compiler.

## Description

The project is a web application for managing bank accounts.

### The main functionality of the application:
+ Authorization
+ Managing user accounts: creating a new account, displaying a list of accounts, displaying the balance, viewing transaction history
+ Transfers to accounts or cards of other users
+ Ability to make currency exchanges
+ Displaying ATMs on the map

### Main sections of the web application:
+ User login form
+ User account list
+ View information about an existing card
+ Form for transferring funds
+ Detailed balance history for cards
Exchange rate monitoring and currency transfers
+ Page displaying bank points on the map

## Usage

To run the application, you must first run the backend server (the instructions for running the backend server are in the folder backend > readme.md file).

To run in development mode, you must enter the command ```npm run dev```.

For product assembly, you need to enter the command ```npm run build```. The assembled project will be located in the repository in the folder dist.

Then, using the live server, or install the serve extension using the command ```npm install --global serve```, then write the command ```serve -s .\frontend\dist\```