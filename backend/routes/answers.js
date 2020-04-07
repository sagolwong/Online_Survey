const router = require('express').Router();
let Answer = require('../models/answer.model');

router.route('/').get((req, res) => {
  Answer.find()
    .then(answers => res.json(answers))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
  const surveyId = req.body.surveyId;
  const amountUser = 1;
  const amountAnswer = 1;
  const userIds = req.body.userIds;
  const answerUsers = req.body.answerUsers;

  const newAnswer = new Answer({
    surveyId,
    amountUser,
    amountAnswer,
    userIds,
    answerUsers
  });

  newAnswer.save()
    .then(() => res.json('Answer create!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Answer.find({ userIds: req.params.id })
    .then(answers => res.json(answers))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:id').get((req, res) => {
  Answer.find({ surveyId: req.params.id })
    .then(answers => res.json(answers))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Answer.findByIdAndDelete(req.params.id)
    .then(() => res.json('Answer deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {
  Answer.findById(req.params.id)
    .then(answer => {
     // answer.amountUser = req.body.amountUser;
      answer.amountAnswer = req.body.amountAnswer;
      answer.answerUsers = req.body.answerUsers;


      answer.save()
        .then(() => res.json('Answer update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/deleteAnswer/:id').post((req, res) => {
  Answer.findById(req.params.id)
    .then(answer => {
      answer.amountUser = req.body.amountUser;
      answer.amountAnswer = req.body.amountAnswer;
      answer.answerUsers = req.body.answerUsers;


      answer.save()
        .then(() => res.json('Answer update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/decryption/:id').post((req, res) => {
  Answer.findById(req.params.id)
    .then(answer => {
      answer.answerUsers = req.body.answerUsers;

      answer.save()
        .then(() => res.json('Answer update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;