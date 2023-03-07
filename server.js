require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const PORT = process.env.PORT || 3500;
const verifyJwt = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/crendentials");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = require("./config/dbConn");

// connectDB();

//* Custom Middleware logger
app.use(logger);

//* Handle options credential check - before CORS
//* and fetch cookies credential requirement
app.use(credentials);

//* Cross Origin Resource Sharing
app.use(cors(corsOptions));

//* built-in middleware to handle urlencoded data
//* in other words, form data:
//* content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// *built-in middleware for json
app.use(express.json());

//* middleware for cookie parser
app.use(cookieParser());

//* server static files
app.use("/", express.static(path.join(__dirname, "/public")));
// app.use("/subdir", express.static(path.join(__dirname, "/public")));

//* routing
app.use("/", require("./routes/root")); //* root routing
app.use("/auth", require("./routes/auth")); //* register routing api
app.use("/register", require("./routes/register")); //* register routing api
app.use("/refresh", require("./routes/refresh")); //* register routing api
app.use("/logout", require("./routes/logout"));

app.use(verifyJwt); //! verfiy token below routes
app.use("/employees", require("./routes/api/employees")); //* employees routing api

app.all("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({
      error: "404 not Found",
    });
  } else {
    res.type("txt").send("404 not found");
  }
});

//* Custom error
app.use(errorHandler);

connectDB().then(() => {
  mongoose.connection.once("open", () => {
    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
  console.log("connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.log("error-ConnectDB", err)
})
