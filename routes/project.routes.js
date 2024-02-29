const express = require("express");
const path = require('path');
const router = express.Router();
const ProjectsController = require(path.resolve('controllers', 'project.controller'));

router.get('/', ProjectsController.getProjects);
router.get('/:id', ProjectsController.getProject);

router.post('/', ProjectsController.createProject);

router.put('/:id', ProjectsController.updateProject);

router.get('/:id/comments', ProjectsController.getCommentsByProject);

module.exports = router;