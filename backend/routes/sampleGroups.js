const router = require('express').Router();
let SampleGroup = require('../models/sampleGroup.model');

router.route('/').get((req, res) => {
    SampleGroup.find()
        .then(sampleGroup => res.json(sampleGroup))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/createSampleGroup/:id').post((req, res) => {
    const projectId = req.params.id;
    const nameSampleGroup = req.body.nameSampleGroup;

    const newSampleGroup = new SampleGroup({
        projectId,
        nameSampleGroup
    });

    newSampleGroup.save()
        .then(() => res.json('SampleGroup create!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    SampleGroup.findByIdAndDelete(req.params.id)
        .then(() => res.json('SampleGroup deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    SampleGroup.find({ projectId: req.params.id })
        .then(sampleGroup => res.json(sampleGroup))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:id').get((req, res) => {
    SampleGroup.findById(req.params.id)
        .then(sampleGroup => res.json(sampleGroup))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/findSG/:projectId/:name').get((req, res) => {
    SampleGroup.find({ projectId: req.params.projectId,nameSampleGroup: req.params.name })
        .then(sampleGroup => res.json(sampleGroup))
        .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/edit/:id').post((req, res) => {
    SampleGroup.findById(req.params.id)
        .then(sampleGroup => {
            sampleGroup.listSurveys = req.body.listSurveys;


            sampleGroup.save()
                .then(() => res.json('SampleGroup update!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;