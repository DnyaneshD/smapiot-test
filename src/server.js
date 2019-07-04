import express from "express";
import bodyParser from "body-parser";
import nconf from "nconf";
import helmet from "helmet";
import { isValid } from "./services/validationService.js";
import { prepareReport } from "./services/billingService.js";

const app = express();

//nconf to load values from config json
nconf
  .argv()
  .env()
  .file({ file: "./config.json" });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(helmet());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Report route
app.route("/api/report/:year/:month").get((req, res) => {
  //Validate the key
  if (isValid(req.params.id)) {
    prepareReport(req.params.year, req.params.month, nconf.get("token")).then(
      report => {
        res.send(report);
        res.status(200);
      }
    );
  } else {
    res.send("Invalid request");
    res.status(400);
  }
});

app.listen(3000);

process.on("uncaughtException", function(err) {
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});

module.exports = app;
