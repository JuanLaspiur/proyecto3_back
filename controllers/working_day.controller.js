const path = require('path');
const { WorkingDay, User } = require(path.join(__dirname, '..', 'models', 'index'));
const jwt = require('jsonwebtoken');
const { getTokenData } = require(path.join(__dirname, '..', 'config', 'jwt.config'));

const workingDayController = {};

const calculeTotalOfDay = async (day) => {
    const firstEntry = [day.entry1, day.exit1];
    const secondEntry = [day.entry2, day.exit2];
    const thirdEntry = [day.entry3, day.exit3];

    const entries = [firstEntry, secondEntry, thirdEntry];

    let total = 0;

    for (let i = 0; i < entries.length; i++) {
        if (entries[i][0] !== '' && entries[i][1] !== '') {
            const entry = entries[i][0].split(':');
            const exit = entries[i][1].split(':');

            const hoursMinutes = (parseInt(exit[0]) - parseInt(entry[0])) * 60;
            const minutes = parseInt(exit[1]) - parseInt(entry[1]);

            total += hoursMinutes + minutes;
        }
    }

    return `${total}`;
}

// Para calcular los minutos de entrada y salida si el usuario no pone los minutos
const calculeTotalOfEntryAndExit = (entry, exit) => {

    let total = 0;

    try {
        const entryHours = entry.split(':')[0];
        const entryMinutes = entry.split(':')[1];
        const exitHours = exit.split(':')[0];
        const exitMinutes = exit.split(':')[1];
    
        const hoursMinutes = (parseInt(exitHours) - parseInt(entryHours)) * 60;
        const minutes = parseInt(exitMinutes) - parseInt(entryMinutes);
    
        total += hoursMinutes + minutes;
    } catch (error) {
        return `${total}`   
    }

    return `${total}`;
}

workingDayController.getWorkingDays = async (req, res) => {
    try {
        const authorization = req.get('authorization');
        let token = null;
        if (authorization && authorization.toLowerCase().startsWith('bearer')) {
            token = authorization.substring(7);
        }
        const decodedToken = getTokenData(token);

        if (!decodedToken) {
            return res.status(401).send({ success: false, msg: 'No autorizado' });
        }

        const user = await User.findOne({
            $and: [
                { email: decodedToken.data.email },
                { company_id: decodedToken.data.company_id }
            ]
        });

        if (!user) {
            return res.status(401).send({ success: false, msg: 'No se encontró el usuario, intente relogear.' });
        }

        const workingDays = await WorkingDay.find({
            user: user._id,
            year: parseInt(req.query.year),
            month: parseInt(req.query.month),
        }).deepPopulate(['data1.project', 'data2.project', 'data3.project']);

        res.status(200).send({ success: true, data: workingDays.sort((a, b) => a.day - b.day), salary: user.salaryPerHour });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, msg: 'Error en el servidor' });
    }
}

workingDayController.createMark = async (req, res) => {
    try {
        const { mark } = req.body;
        const authorization = req.get('authorization');
        let token = null;

        if (authorization && authorization.toLowerCase().startsWith('bearer')) {
            token = authorization.substring(7);
        }

        const decodedToken = getTokenData(token);

        if (!decodedToken) return res.status(401).send({ success: false, msg: 'No autorizado' });

        const user = await User.findOne({
            $and: [
                { email: decodedToken.data.email },
                { company_id: decodedToken.data.company_id }
            ]
        });

        if (!user) {
            return res.status(401).send({ success: false, msg: 'No se encontró el usuario, intente relogear.' });
        }

        const workingDay = await WorkingDay.findOne({
            $and: [
                { user: user._id },
                { day: mark.day },
                { month: mark.month },
                { year: mark.year }
            ]
        }); // * Buscamos si existe un documento con el día, mes y año actual que contenga al usuario.

        if (!workingDay) {
            const newWorkingDay = new WorkingDay({
                day: mark.day,
                month: mark.month,
                year: mark.year,
                entry1: mark.hour,
                user: user._id
            });
            await newWorkingDay.save();

            const WorkingDaysToSend = await WorkingDay.find({
                user: user._id,
                year: mark.year,
                month: mark.month,
            }); // * Buscamos todos los documentos del usuario para enviarlos al front.

            return res.status(201).send({ success: true, msg: '¡Se ha marcado el inicio del día, feliz jornada! 😀', data: WorkingDaysToSend.sort((a, b) => a.day - b.day) });
        }  // * Si no existe el documento, lo creamos y guardamos con la primera entrada como la hora actual.

        const marks = ['exit1', 'entry2', 'exit2', 'entry3', 'exit3'];

        for (let i = 0; i < marks.length; i++) {
            if (workingDay[marks[i]] === '') { // * si el registro tiene vacio la entrada o salida se procede a crearse la marca de la jornada
                workingDay[marks[i]] = mark.hour;

                if(marks[i] === 'exit1') {
                    workingDay.data1 = mark.message;
                    workingDay.data2 = {
                        message: '',
                        minutes: '',
                    }
                    workingDay.data3 = {
                        message: '',
                        minutes: '',
                    }
                }

                if(marks[i] === 'exit2') {
                    workingDay.data2 = mark.message;
                }

                if(marks[i] === 'exit3') {
                    workingDay.data3 = mark.message;
                }

                workingDay.totalMinutes = await calculeTotalOfDay(workingDay);

                console.log(workingDay);

                await workingDay.save();

                const WorkingDaysToSend = await WorkingDay.find({
                    user: user._id,
                    year: mark.year,
                    month: mark.month,
                }).deepPopulate(['data1.project', 'data2.project', 'data3.project']); // * Buscamos todos los documentos del usuario para enviarlos al front.

                if (marks[i].includes('exit')) {
                    return res.status(201).send({ success: true, msg: '¡Se ha marcado la salida!', data: WorkingDaysToSend.sort((a, b) => a.day - b.day) });
                } else {
                    return res.status(201).send({ success: true, msg: '¡Se ha marcado la entrada!', data: WorkingDaysToSend.sort((a, b) => a.day - b.day) });
                }
            }
        } // * Vamos recorriendo los campos de la base de datos, si alguno está vacío, lo llenamos con la hora actual y guardamos el documento.

        const WorkingDaysToSend = await WorkingDay.find({
            user: user._id,
            year: mark.year,
            month: mark.month,
        }); // * Buscamos todos los documentos del usuario para enviarlos al front.

        res.status(400).send({ success: true, msg: 'Este día ya se ha finalizado!', data: WorkingDaysToSend.sort((a, b) => a.day - b.day) });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, msg: 'Error en el servidor' });
    }
}

workingDayController.getByEmployeerId = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, month } = req.query;

        const user = await User.findById(id);

        if (!user) {
            return res.status(401).send({ success: false, msg: 'No se encontró el usuario, intente relogear.' });
        }

        const workingDays = await WorkingDay.find({
            $and: [
                { user: id },
                { year: parseInt(year) },
                { month: parseInt(month) }
            ]
        }).deepPopulate(['data1.project', 'data2.project', 'data3.project']);


        res.status(200).send({ success: true, data: workingDays.sort((a, b) => a.day - b.day), salary: user.salaryPerHour });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, msg: 'Error en el servidor' });
    }
}

workingDayController.getADayOfEmployee = async (req, res) => {
    try {
        const { day, month, year, idUser } = req.params;

        const workingDay = await WorkingDay.findOne({
            $and: [
                { user: idUser },
                { day: parseInt(day) },
                { month: parseInt(month) },
                { year: parseInt(year) }
            ]
        }).deepPopulate(['data1.project', 'data2.project', 'data3.project']);

        res.status(200).send({ success: true, data: workingDay });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, msg: 'Error en el servidor' });
    }
}

workingDayController.getSalaryOfEmployee = async (req, res) => {
    try {
        const {id, year, month} = req.params;
        
        const user = await User.findById(id);

        if(!user) {
            return res.status(401).send({ success: false, msg: 'No se encontró el usuario, intente relogear.' });
        }

        const workingDays = await WorkingDay.find({
            $and: [
                { user: id },
                { year: parseInt(year) },
                { month: parseInt(month) }
            ]  
        });

        let totalSalary = 0;
        let workedHours = 0;

        for (let i = 0; i < workingDays.length; i++) {
            console.log(workingDays[i].totalMinutes); 
            console.log(user.salaryPerHour);
            totalSalary += workingDays[i].totalMinutes/60 * user.salaryPerHour;
            workedHours += workingDays[i].totalMinutes/60;
        }

        res.status(200).send({ success: true, salary: totalSalary.toFixed(2), workedHours: workedHours.toFixed(2) });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, msg: 'Error en el servidor' });
    }
}

workingDayController.getSalaryOfAllEmployees = async (req, res) => {
    try {
        const { idCompany, year, month } = req.params;

        const company = await User.findById(idCompany);  

        if (!company) return res.status(401).send({ success: false, msg: 'No se encontró la empresa, intente relogear.' });

        const employees = await User.find({ company: idCompany });

        let totalSalary = 0;
        let workedHours = 0;

        for (let i = 0; i < employees.length; i++) {
            employees[i].salaryPerHour = employees[i].salaryPerHour || 0;

            const workingDays = await WorkingDay.find({
                $and: [
                    { user: employees[i]._id },
                    { year: parseInt(year) },
                    { month: parseInt(month) }
                ]
            });

            for (let j = 0; j < workingDays.length; j++) {
                workedHours += workingDays[j].totalMinutes / 60;
                totalSalary += workingDays[j].totalMinutes / 60 * employees[i].salaryPerHour;
            }
        }

        res.status(200).send({ success: true, salary: totalSalary.toFixed(2), workedHours: workedHours.toFixed(2) });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, msg: 'Error en el servidor' });
    }
}

module.exports = workingDayController;