const router = require('express').Router();
let Frequency = require('../models/frequency.model');

router.route('/').get((req, res) => {
    Frequency.find()
    .then(frequencies => res.json(frequencies))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
  const surveyId = req.body.surveyId;
  const listTimeToDo = req.body.listTimeToDo;

  const newFrequency = new Frequency({
    surveyId,
    listTimeToDo
  });

  newFrequency.save()
    .then(() => res.json('Frequency create!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Frequency.findById(req.params.id)
    .then(frequencies => res.json(frequencies))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:id').get((req, res) => {
    Frequency.find({ surveyId: req.params.id })
    .then(frequencies => res.json(frequencies))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Frequency.findByIdAndDelete(req.params.id)
    .then(() => res.json('Frequency deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});
/*
router.route('/edit/:id').post((req, res) => {
    Frequency.findById(req.params.id)
    .then(frequency => {
     // answer.amountUser = req.body.amountUser;
     frequency.amountAnswer = req.body.amountAnswer;
     frequency.answerUsers = req.body.answerUsers;


      frequency.save()
        .then(() => res.json('Frequency update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});*/

module.exports = router;