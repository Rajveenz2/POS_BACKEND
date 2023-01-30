require("dotenv").config();

const compression = require("compression");
var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  cors = require("cors"),
  config = require("./config/settings"),
  passport = require("passport");
(expressWs = require("express-ws")(app)),
  require("./config/passport")(passport),
  (redis = require("./config/redis")),
  (upload = require("express-fileupload"));

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

// Overwrite if content-type does not exists
app.use(function (req, res, next) {
  if (!req.headers["content-type"])
    req.headers["content-type"] = "application/json";

  next();
});

app.use(compression());
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: "50mb",
  })
);
app.options("*", cors());

let port = process.env.PORT;
if (port == null || port == "") {
  port = config.express.port;
}

app.listen(port);

app.set("views", __dirname + "/templates");
app.use(upload());
// app.use(cors({ credentials: true, origin: true }))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested, Content-Type, Accept Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE");
    return res.status(200).json({});
  }
  next();
});

var routes = require("./routes/routes").router; //importing route
const LoggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);

  next();
};

app.use(LoggerMiddleware);

if (process.env.NODE_ENV == "development") {
  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

app.use("/", routes);
