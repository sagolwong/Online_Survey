const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
let User = require('../models/user.model');


router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
      return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
          return res.status(400).json({ email: "Email already exists" });
      } else {
          const newUser = new User({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              password: req.body.password,
              role: "RESPONDER"
          });
          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                      .save()
                      .then(user => res.json(user))
                      .catch(err => console.log(err));
              });
          });
      }
  });
});

router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
      return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
          return res.status(404).json({ emailnotfound: "Email not found" });
      }
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
              // User matched
              // Create JWT Payload
              const payload = {
                  id: user.id,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  role: user.role
              };
              // Sign token
              jwt.sign(
                  payload,
                  keys.secretOrKey,
                  {
                      expiresIn: 31556926 // 1 year in seconds
                  },
                  (err, token) => {
                      res.json({
                          success: true,
                          token: "Bearer " + token
                      });
                  }
              );
          } else {
              return res
                  .status(400)
                  .json({ passwordincorrect: "Password incorrect" });
          }
      });
  });
});

router.route('/create').post((req, res) => {
    /*const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const role = "ADMIN";
  
    const newUser = new User({
      email,
      password,
      firstname,
      lastname,
      role
    });*/

    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role: "ADMIN"
    });
    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        });
    });
  
    /*newUser.save()
      .then(() => res.json('Admin create!'))
      .catch(err => res.status(400).json('Error: ' + err));*/
  });

router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/upgrade/:id').post((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.gender = req.body.gender;
      user.job = req.body.job;
      user.role = "RESEARCHER";


      user.save()
        .then(() => res.json('User upgrade!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.recentProjects = req.body.recentProjects;
      user.recentOtherSurveys = req.body.recentOtherSurveys;


      user.save()
        .then(() => res.json('RecentProject&OtherSurvey update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;