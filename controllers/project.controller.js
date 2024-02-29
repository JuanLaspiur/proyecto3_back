const path = require('path');
const { Project, User, WorkingDay } = require(path.join(__dirname, '..', 'models', 'index'));
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;

const projectController = {}

projectController.getProjects = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const id = decoded.data.company_id;

        const projects = await Project.find({
            company: id
        })

        res.status(200).send({
            success: true,
            message: 'Projects found',
            data: projects
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

projectController.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).deepPopulate(['client.company_id', 'contracts.prospectOrClient', 'contracts.plannings']);

        res.status(200).send({
            status: true,
            message: 'Project found',
            data: project
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

projectController.getProjectByUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        let projects = [];

        if(user.role[0] === 1) {
            projects = await Project.find({ client: user.company_id }).deepPopulate(['client.company_id', 'contracts.prospectOrClient', 'contracts.plannings']);
        } else if(user.role[0] === 2) {
            projects = await Project.find({ 'contracts.prospectOrClient': user._id }).deepPopulate(['client.company_id', 'contracts.prospectOrClient', 'contracts.plannings']);
        } 

        res.status(200).send({
            status: true,
            message: 'Projects found',
            data: projects
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}


projectController.createProject = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const id = decoded.data.company_id;
        req.body.company = id;

        const project = new Project(req.body);
        await project.save();

        console.log(project);

        res.status(200).send({
            status: true,
            message: 'Project created',
            data: project
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

projectController.updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndUpdate(id, req.body, {new: true});

        if(!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.status(200).send({
            status: true,
            message: 'Project updated',
            data: project
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

projectController.closeProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndUpdate(id, { state: 'closed' });

        if(!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.status(200).send({
            status: true,
            message: 'Project closed',
            data: project
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

projectController.suspendProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndUpdate(id, { state: 'suspended' });

        if(!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.status(200).send({
            status: true,
            message: 'Project suspended',
            data: project
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

projectController.getCommentsByProject = async (req, res) => {
    try {
        const { id } = req.params;

        const workingDays = await WorkingDay.aggregate([
            {"$match": { 
                "$or": [
                    {"data1.project": new ObjectId(id)},
                    {"data2.project": new ObjectId(id)},
                    {"data3.project": new ObjectId(id)},
                ]
            }},
            {"$unwind": "$data1"},
            {"$lookup": { 
                "from": "users",
                "localField": "user",
                "foreignField": "_id",
                "as": "user"
            }}
        ]);


        for (let index = 0; index < workingDays.length; index++) {
            const workingDay = workingDays[index];

            for (let index = 0; index < workingDay.data1.length; index++) {
                const data1 = workingDay.data1[index];
                
                if (!data1.project || data1.project && data1.project.toString() !== id){
                    workingDay.data1.slice(index, index + 1)
                }

            }
            for (let index = 0; index < workingDay.data2.length; index++) {
                const data2 = workingDay.data2[index];
                
                if (!data2.project || data2.project && data2.project.toString() !== id){
                    workingDay.data2.slice(index, index + 1)
                }

            }
            for (let index = 0; index < workingDay.data3.length; index++) {
                const data3 = workingDay.data3[index];
                
                if (!data3.project || data3.project && data3.project.toString() !== id){
                    workingDay.data3.slice(index, index + 1)
                }

            }

        }

        res.status(200).send({
            status: true,
            message: 'Comments loaded',
            data: workingDays
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}



module.exports = projectController;