const router = require('express').Router();
let Survey = require('../models/survey.model');

router.route('/').get((req, res) => {
    Survey.find()
        .then(surveys => res.json(surveys))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
    const projectId = req.body.projectId;
    const userId = req.body.userId;
    const sampleGroupId = req.body.sampleGroupId;
    const nameSurvey = req.body.nameSurvey;
    const description = req.body.description;
    const shareTo = req.body.shareTo;
    const wantName = req.body.wantName;
    const haveGroup = req.body.haveGroup;
    const names = req.body.names;
    const frequency = req.body.frequency;
    const doOnce = req.body.doOnce;
    const openAndCloseTimes = req.body.openAndCloseTimes;
    const builtIns = req.body.builtIns;
    const data = req.body.data;
    const status = req.body.status;

    const newSurvey = new Survey({
        projectId,
        userId,
        sampleGroupId,
        nameSurvey,
        description,
        shareTo,
        wantName,
        haveGroup,
        names,
        frequency,
        doOnce,
        openAndCloseTimes,
        builtIns,
        data,
        status
    });

    newSurvey.save()
        .then(() => res.json('Survey create!'))
        .catch(err => res.json('Error: ' + err));
});

/*router.route('/:id').get((req, res) => {
    Survey.findById(req.params.id)
        .then(surveys => res.json(surveys))
        .catch(err => res.status(400).json('Error: ' + err));
});*/

router.route('/:id').get((req, res) => {
    Survey.find({ projectId: req.params.id })
        .then(surveys => res.json(surveys))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:id').get((req, res) => {
    Survey.findById(req.params.id)
        .then(surveys => res.json(surveys))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/count/:id').get((req, res) => {
    Survey.find({ userId: req.params.id }).count()
        .then(surveys => res.json(surveys))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/group/:id').get((req, res) => {
    Survey.find({ sampleGroupId: req.params.id })
        .then(surveys => res.json(surveys))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id/:nameSurvey').get((req, res) => {
    Survey.find({ projectId: req.params.id, nameSurvey: req.params.nameSurvey })
        .then(surveys => res.json(surveys))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Survey.findByIdAndDelete(req.params.id)
        .then(() => res.json('Survey deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {
    Survey.findById(req.params.id)
        .then(survey => {
            survey.nameSample = req.body.nameSample;
            survey.nameSurvey = req.body.nameSurvey;
            survey.description = req.body.description;
            survey.shareTo = req.body.shareTo;
            survey.wantName = req.body.wantName;
            survey.haveGroup = req.body.haveGroup;
            survey.names = req.body.names;
            survey.frequency = req.body.frequency;
            survey.doOnce = req.body.doOnce;
            survey.openAndCloseTimes = req.body.openAndCloseTimes;
            survey.data = req.body.data;
            


            survey.save()
                .then(() => res.json('Survey update!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/member/:id').post((req, res) => {
    Survey.findById(req.params.id)
        .then(survey => {
            survey.names = req.body.names;

            survey.save()
                .then(() => res.json('Survey update!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/status/:id').post((req, res) => {
    Survey.findById(req.params.id)
        .then(survey => {
            survey.status = req.body.status;

            survey.save()
                .then(() => res.json('Status Survey update!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/editSurvey/:id').post((req, res) => {
    Survey.findById(req.params.id)
        .then(survey => {
            survey.nameSurvey = req.body.nameSurvey;
            survey.description = req.body.description;
            survey.shareTo = req.body.shareTo;
            survey.wantName = req.body.wantName;
            survey.haveGroup = req.body.haveGroup;
            survey.names = req.body.names;
            survey.frequency = req.body.frequency;
            survey.doOnce = req.body.doOnce;
            survey.openAndCloseTimes = req.body.openAndCloseTimes;
            survey.data = req.body.data;
            survey.builtIns = req.body.builtIns;
            survey.status = req.body.status;


            survey.save()
                .then(() => res.json('Survey update!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;