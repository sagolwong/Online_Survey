const router = require('express').Router();
let Template = require('../models/template.model');

router.route('/').get((req, res) => {
    Template.find()
        .then(templates => res.json(templates))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
    const userId = req.body.userId;
    const nameSurvey = req.body.nameSurvey;
    const description = req.body.description;
    const shareTo = req.body.shareTo;
    const wantName = req.body.wantName;
    const haveGroup = req.body.haveGroup;
    const frequency = req.body.frequency;
    const doOnce = req.body.doOnce;
    const openAndCloseTimes = req.body.openAndCloseTimes;
    const builtIns = req.body.builtIns;
    const data = req.body.data;

    const newTemplate = new Template({
        userId,
        nameSurvey,
        description,
        shareTo,
        wantName,
        haveGroup,
        frequency,
        doOnce,
        openAndCloseTimes,
        builtIns,
        data
    });

    newTemplate.save()
        .then(() => res.json('Template create!'))
        .catch(err => res.json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Template.find({ userId: req.params.id })
        .then(templates => res.json(templates))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:id').get((req, res) => {
    Template.findById( req.params.id )
        .then(templates => res.json(templates))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Template.findByIdAndDelete(req.params.id)
        .then(() => res.json('Template deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {
    Template.findById(req.params.id)
        .then(template => {
            template.nameSurvey = req.body.nameSurvey;
            template.description = req.body.description;
            template.shareTo = req.body.shareTo;
            template.wantName = req.body.wantName;
            template.haveGroup = req.body.haveGroup;
            template.frequency = req.body.frequency;
            template.doOnce = req.body.doOnce;
            template.openAndCloseTimes = req.body.openAndCloseTimes;
            template.builtIns = req.body.builtIns;
            template.data = req.body.data;


            template.save()
                .then(() => res.json('Template update!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;