const router = require('express').Router();
let Project = require('../models/project.model');

router.route('/').get((req, res) => {
  Project.find()
    .then(projects => res.json(projects))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/createProject/:id').post((req, res) => {
  const userId = req.params.id;
  const nameProject = req.body.nameProject;
  const description = req.body.description;

  const newProject = new Project({
    userId,
    nameProject,
    description
  });

  newProject.save()
    .then(() => res.json('Project create!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:id').get((req, res) => {
  Project.find({ userId: req.params.id })
    .then(projects => res.json(projects))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id/:nameProject').get((req, res) => {
  Project.findOne({ userId: req.params.id, nameProject: req.params.nameProject })
    .then(projects => res.json(projects))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(() => res.json('Project deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Project.findById(req.params.id)
    .then(projects => res.json(projects))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {
  Project.findById(req.params.id)
    .then(project => {
      project.nameProject = req.body.nameProject;
      project.description = req.body.description;


      project.save()
        .then(() => res.json('Project update!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;