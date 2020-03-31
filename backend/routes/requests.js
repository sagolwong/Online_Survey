const router = require('express').Router();
let Request = require('../models/request.model');

router.route('/').get((req, res) => {
    Request.find()
    .then(requests => res.json(requests))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
  const userId = req.body.userId;
  const typeRequest = req.body.typeRequest;
  const data = req.body.data;

  const newRequest = new Request({
    userId,
    typeRequest,
    data
  });

  newRequest.save()
    .then(() => res.json('Request create!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Request.find({ userId: req.params.id })
    .then(requests => res.json(requests))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:id').get((req, res) => {
    Request.find({ surveyId: req.params.id })
    .then(requests => res.json(requests))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Request.findByIdAndDelete(req.params.id)
    .then(() => res.json('Request deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});
/*
router.route('/edit/:id').post((req, res) => {
    Request.findById(req.params.id)
    .then(request => {
     // answer.amountUser = req.body.amountUser;
     request.amountAnswer = req.body.amountAnswer;
     request.answerUsers = req.body.answerUsers;


      request.save()
        .then(() => res.json('Request update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});*/

module.exports = router;