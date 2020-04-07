const router = require('express').Router();
let ListSurvey = require('../models/listSurvey.model');

router.route('/').get((req, res) => {
    ListSurvey.find()
    .then(listSurvey => res.json(listSurvey))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
  const userId = req.body.userId;
  const listSurvey = req.body.listSurvey;

  const newListSurvey = new ListSurvey({
    userId,
    listSurvey
  });

  newListSurvey.save()
    .then(() => res.json('ListSurvey create!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:id').get((req, res) => {
    ListSurvey.find({ userId: req.params.id })
    .then(listSurvey => res.json(listSurvey))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    ListSurvey.findByIdAndDelete(req.params.id)
    .then(() => res.json('ListSurvey deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {
    ListSurvey.findById(req.params.id)
    .then(listSurvey => {
     listSurvey.listSurvey = req.body.listSurvey;

     listSurvey.save()
        .then(() => res.json('ListSurvey update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;