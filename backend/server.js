const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();
// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

const usersRouter = require('./routes/users');
const requestsRouter = require('./routes/requests');
const projectsRouter = require('./routes/projects');
const sampleGroupsRouter = require('./routes/sampleGroups');
const surveysRouter = require('./routes/survey');
const templatesRouter = require('./routes/template');
const frequencyRouter = require('./routes/frequency');
const followResultsRouter = require('./routes/followResult');

app.use('/users', usersRouter);
app.use('/requests', requestsRouter);
app.use('/projects', projectsRouter);
app.use('/sampleGroups', sampleGroupsRouter);
app.use('/surveys', surveysRouter);
app.use('/templates', templatesRouter);
app.use('/frequency', frequencyRouter);
app.use('/followResults', followResultsRouter);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));