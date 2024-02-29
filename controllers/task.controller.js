const { Task, User, Milestone } = require('../models');
const path = require('path');
const DiscordClient = require(path.join(__dirname, '..', 'config', 'discord'));

const orderByDates = (registers) => {
    const registersByDate = [];
    let currentDate = null;
    let currentGroup = null;

    registers.forEach(task => {
        const taskDate = task.date;

        if (taskDate !== currentDate) {
            if (currentGroup) {
                registersByDate.push(currentGroup);
            }
            currentGroup = { date: taskDate, tasks: [] };
            currentDate = taskDate;
        }

        currentGroup.tasks.push(task);
    }); // * Las ordenamos por fecha para el renderizado

    if (currentGroup) {
        registersByDate.push(currentGroup);
    }

    registersByDate.sort((a, b) => {
        if (a.date && b.date) {
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            return dateA - dateB;
        }
    });

    return registersByDate;
};

const taskController = {
    create: async (req, res) => {
        try {
            const { __company_id } = req;
            const data = req.body;

            for (const idEmployee of data.employees) {
                const employee = await User.findById(idEmployee);

                if (employee && employee.discordId) {
                    const message = `Hola, ${employee.name}! Te han asignado una tarea para el día ${data.date}. 🤗
Nombre: ${data.activity}
Descripción: ${data.description}

Puedes ver tus tareas en el siguiente link si estás conectado a Quercu: https://quercu.eichechile.com/#/empleado/tareas ✨
Si tienes alguna duda, puedes contactar con la persona que te envió la tarea.
¡Mucha suerte! ❤`;

                    const user = await DiscordClient.users.fetch(employee.discordId)
                        .then(user => {
                            user.createDM()
                                .then(channel => {
                                    channel.send(message);
                                })
                                .catch(console.error);
                        })
                        .catch(console.error);
                };
            }

            const newRegister = new Task({ ...data, company_id: __company_id });
            await newRegister.save();

            const registers = await Task.find({
                company_id: __company_id,
                disabled: false,
                finished: false
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);

            res.status(201).json({
                status: true,
                message: 'Task creado correctamente!',
                data: orderByDates(registers)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Error al crear task',
                status: false,
                data: error
            });
        }
    },

    getAll: async (req, res) => {
        const { __company_id } = req;
        try {
            const registers = await Task.find({
                $or: [
                    { company_id: __company_id, disabled: false, finished: false },
                    { company_id: __company_id, disabled: false, finished: false, review: true },
                    { company_id: __company_id, disabled: false, finished: false, stopper: true }
                ]
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);

            res.status(200).json({
                status: true,
                message: 'Task obtenidos correctamente!',
                data: orderByDates(registers)
            });
        }
        catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Error al obtener los tasks!',
                data: error,
                status: false
            });
        }
    },

    getAllFinished: async (req, res) => {
        const { __company_id } = req;
        try {
            const registers = await Task.find({
                company_id: __company_id,
                disabled: false,
                finished: true
            }).populate(['employee', 'employees', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);
            res.status(200).json({
                status: true,
                message: 'Task obtenidos correctamente!',
                data: registers
            });
        }
        catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Error al obtener los tasks!',
                data: error,
                status: false
            });
        }
    },

    getAllFinishedByArea: async (req, res) => {
        try {
            const { userId } = req.params;


        } catch (error) {

        }
    },

    get: async (req, res) => {
        try {
            const { id } = req.params;
            const register = await Task.findById(id);
            res.status(200).json({
                status: true,
                message: 'Task obtenido correctamente!',
                data: register
            });
        }
        catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error al obtener el task!',
                data: error
            });
        }
    },

    getByEmployee: async (req, res) => {
        try {
            const { userId } = req.params;

            const registers = await Task.find({
                $or: [
                    { employee: userId, disabled: false, finished: false },
                    { employee: userId, disabled: false, finished: false, review: true },
                    { employees: { $in: [userId] }, disabled: false, finished: false },
                    { employees: { $in: [userId] }, disabled: false, finished: false, review: true }
                ],
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}
            ]);

            res.status(200).json({
                status: true,
                message: 'Task obtenido correctamente!',
                data: orderByDates(registers)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al obtener el task!',
                data: error
            });
        }
    },

    getAllWithoutEmployee: async (req, res) => {
        try {
            const { __company_id } = req;

            const registers = await Task.find({
                $or: [
                    { company_id: __company_id, disabled: false, finished: false, employee: null, employees: [] },
                    { company_id: __company_id, disabled: false, finished: false, review: true, employee: null, employees: [] },
                    { company_id: __company_id, disabled: false, finished: false, stopper: true, employee: null, employees: [] },
                ]
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);

            res.status(200).json({
                status: true,
                message: 'Task obtenido correctamente!',
                data: orderByDates(registers)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,

                message: 'Error al obtener el task!',
                data: error
            });
        }
    },

    getAllByContract: async (req, res) => {
        try {
            const { contractId } = req.params;

            const registers = await Task.find({
                contract: contractId,
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);

            res.status(200).json({
                status: true,
                message: 'Task obtenido correctamente!',
                data: orderByDates(registers)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al obtener el task!',
                data: error
            });
        }
    },

    update: async (req, res) => {
        try {
            const { __company_id } = req;
            const { id } = req.params;
            const data = req.body;

            const registerUpdated = await Task.findByIdAndUpdate(id, data, { new: true });

            const registers = await Task.find({
                company_id: __company_id,
                disabled: false,
                finished: false
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);

            res.status(200).json({
                status: true,
                message: 'Task actualizado correctamente!',
                data: registerUpdated,
                registersActualized: orderByDates(registers)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al actualizar el task!',
                data: error
            });
        }
    },

    disable: async (req, res) => {
        try {
            const { id } = req.params;
            const { __company_id } = req;

            await Task.findByIdAndUpdate(id, {
                disabled: true
            });

            const registers = await Task.find({
                company_id: __company_id,
                disabled: false,
                finished: false
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);

            res.status(200).json({
                status: true,
                message: 'Task eliminado correctamente!',
                data: orderByDates(registers)
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error al eliminar el Task!',
                data: error,
            });
        }
    },

    finish: async (req, res) => {
        try {
            const { id } = req.params;
            const { __company_id } = req;
            await Task.findByIdAndUpdate(id, {
                finished: true
            });

            const registers = await Task.find({
                company_id: __company_id,
                disabled: false,
                finished: false
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);
            console.log(registers)

            res.status(200).json({
                status: true,
                message: 'Task terminada correctamente!',
                data: orderByDates(registers)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al terminar la Task!',
                data: error,
            });
        }
    },

    review: async (req, res) => {
        try {
            const { id } = req.params;
            const { __company_id } = req;
            const task = await Task.findById(id);
            await Task.findByIdAndUpdate(id, {
                review: !task.review
            });

            const registers = await Task.find({
                company_id: __company_id,
                disabled: false,
                finished: false
            }).sort({ date: 'asc' }).populate(['employee', 'contract', {
                    path : 'project',
                    populate : {
                        path : 'client',
                        model: 'prospect'
                    }}]);

            res.status(200).json({
                status: true,
                message: task.review ? 'La Task ya no se encuentra en revisión' : 'Task agregada a revisión!',
                data: orderByDates(registers)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al terminar la Task!',
                data: error,
            });
        }
    },

    // * HITOS

    getMilestonesOfTask: async (req, res) => {
        try {
            const { taskId } = req.params;

            const milestones = await Milestone.find({
                task: taskId
            }).populate(['user', 'task']);

            res.status(200).json({
                status: true,
                message: 'Milestones obtenidos correctamente!',
                data: milestones
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al obtener los milestones!',
                data: error
            });
        }
    },

    createMilestone: async (req, res) => {
        try {
            const { userId, task, message } = req.body;

            const user = await User.findById(userId);

            if (!user) return res.status(404).json({
                status: false,
                message: 'Usuario no encontrado!',
                data: null
            });

            const taskFound = await Task.findById(task);

            if (!taskFound) return res.status(404).json({
                status: false,
                message: 'Task no encontrado!',
                data: null
            });

            const date = new Date();

            // * Transform date to dd/mm/yyyy

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const milestone = {
                date: `${day}/${month}/${year}`,
                message,
                user: user._id,
                task: taskFound._id
            }

            const register = new Milestone(milestone);

            await register.save();

            const populatedRegister = await Milestone.findById(register._id).populate(['user', 'task']);

            const updatedTask = await Task.findByIdAndUpdate(task, {
                $push: {
                    milestones: register._id
                }
            }, { new: true });

            res.status(200).json({
                status: true,
                message: 'Milestone creado correctamente!',
                data: populatedRegister,
                taskUpdated: updatedTask
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al crear el milestone!',
                data: error
            });
        }
    },

    updateMilestone: async (req, res) => {
        try {
            const { milestoneId } = req.params;
            const { userId, comment } = req.body;

            const user = await User.findById(userId);

            if (!user) return res.status(404).json({
                status: false,
                message: 'Usuario no encontrado!',
                data: null
            });

            const milestone = await Milestone.findByIdAndUpdate(milestoneId, {
                comment
            }, { new: true });

            if (!milestone) return res.status(404).json({
                status: false,
                message: 'Hito no encontrado!',
                data: null
            });

            res.status(200).json({
                status: true,
                message: 'Hito actualizado correctamente!',
                data: milestone
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al actualizar el hito!',
                data: error
            });
        }
    },

    deleteMilestone: async (req, res) => {
        try {
            const { milestoneId } = req.params;
            const { userId } = req.body;

            console.log(milestoneId)
            const user = await User.findById(userId);

            if (!user) return res.status(404).json({
                status: false,
                message: 'Usuario no encontrado!',
                data: null
            });

            const milestone = await Milestone.findByIdAndDelete(milestoneId);

            console.log(milestone)
            if (!milestone) return res.status(404).json({
                status: false,
                message: 'Hito no encontrado!',
                data: null
            });

            console.log(3)

            const taskUpdated = await Task.findByIdAndUpdate(milestone.task, {
                $pull: {
                    milestones: milestone._id
                }
            }, { new: true });

            res.status(200).json({
                status: true,
                message: 'Hito eliminado correctamente!',
                data: taskUpdated
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                message: 'Error al eliminar el hito!',
                data: error
            });
        }
    },


};


module.exports = taskController;