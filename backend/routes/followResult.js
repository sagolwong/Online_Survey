const router = require('express').Router();
let FollowResult = require('../models/followResult.model');

router.route('/').get((req, res) => {
    FollowResult.find()
    .then(followResults => res.json(followResults))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
  const surveyId = req.body.surveyId;
  const userId = req.body.userId;
  const frequencyId = req.body.frequencyId;
  const follow = [];

  const newFollowResult = new FollowResult({
    surveyId,
    userId,
    frequencyId,
    follow
  });

  newFollowResult.save()
    .then(() => res.json('FollowResult create!'))
    .catch(err => res.json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    FollowResult.findById(req.params.id)
    .then(followResults => res.json(followResults))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:surveyId/:userId').get((req, res) => {
    FollowResult.find({ surveyId: req.params.surveyId,userId: req.params.userId })
    .then(followResults => res.json(followResults))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/findS/:surveyId').get((req, res) => {
    FollowResult.find({ surveyId: req.params.surveyId })
    .then(followResults => res.json(followResults))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    FollowResult.findByIdAndDelete(req.params.id)
    .then(() => res.json('FollowResult deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {
    FollowResult.findById(req.params.id)
    .then(followResult => {
     followResult.follow = req.body.follow;

     followResult.save()
        .then(() => res.json('FollowResult update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;