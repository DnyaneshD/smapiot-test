The purpose of this project is to prepare prototype of Billing Engine for Sampiot test.

## Available Scripts

In the project directory, you can run:

### `npm install`

To install all required packages.

### `npm run compile`

This command is required to run because ES6 has been for development and ES5 is required to run application on NodeJs.<br>

### `npm start` Or `f5` (For VS code)

To run the application.

It has been configured to run the app on [http://localhost:3000](http://localhost:3000) to access API. If not in use already.

Things covered:

1. RESTful API is developed for getting the report.
2. Report contains all the fields mentioned in requirement
3. Estimations based on usage for current month are calaculated
4. Used Helemt for security purpose

Things I missed due to time limit:

1. Due to time crunt I chose to used JS over TS
2. Unit and contract test could be added
3. Reporting based on JSON
