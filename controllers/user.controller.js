require("colors");
const { User, Area, Position } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { getToken, getTokenData } = require("../config/jwt.config");
const nodeMailer = require("nodemailer");
const { registerMessage } = require("../utilities/registerMessage");
require("dotenv").config();

const userController = {
  test: async (req, res) => {
    res.send({ hello: "world" });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const result = await user.comparePassword(password);
      if (result) {
        let token = null;
        if (user.role[0] === 0) {
          token = getToken({ email: user.email, role: user.role });
        } else {
          token = getToken({
            email: user.email,
            role: user.role,
            company_id: user.company_id,
          });
        }
        return res.send({
          success: true,
          msg: "Inicio de sesión exitoso!",
          token,
        });
      }
      return res.status(400).send({
        success: false,
        msg: "Contraseña incorrecta!",
      });
    } else {
      res.status(404).send({
        success: false,
        msg: "Usuario no registrado!",
      });
    }
  },

  register: async (req, res) => {
    try {
      const { data } = req.body;
      const filename = req.file ? req.file.filename : false;
      let user = (await User.findOne({ email: data.email })) || null;

      if (user) {
        return res.status(400).send({
          success: false,
          msg: "El usuario ya existe",
        });
      }

      const newUser = await User(data);

      if (!newUser) {
        res.status(404).send({
          success: false,
          msg: "Error al registrar usuario",
        });
      } else {
        const token = getToken({ email: data.email, role: data.role });
        await newUser.setProfileImage(filename);
        const userStored = await newUser.save();
        res.status(200).send({
          success: true,
          msg: "Usuario Registrado!",
          token,
          newUser: userStored,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(409).send({
        success: false,
        msg: "Error al registrar",
        error: error,
      });
    }
  },

  getAll: async (req, res) => {
    const data = await User.find({});
    res.send({ success: true, users: data });
  },

  getById: async (req, res) => {
    try {
      let { id } = req.params;
      const data = await User.findById(id);
      res.send({ success: true, user: data, msg: "Usuario obtenido exitosamente" });
    } catch (error) {
      res.send({ success: false, error, msg: "Error al obtener usuario" });
    }
  },

  info: async (req, res) => {
    const authorization = req.get("authorization");
    let token = null;
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      token = authorization.substring(7);
    }
    const decodedToken = getTokenData(token);
    if (decodedToken) {
      const user = await User.findOne({
        email: decodedToken.data.email,
      }).populate(["company_id", "area", "position", "employees"]);

      if (user) {
        res.status(200).send({ success: true, user });
      } else {
        res.status(404).send({ succes: false, auth: "no auth, no user" });
      }
    } else {
      res.status(400).send({ succes: false, auth: "no auth" });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { email } = req.params;
      const { newPassword } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        const password = await User.encryptPassword(newPassword);
        await User.findByIdAndUpdate(id, { password }, { new: true });
      }

      res.status(200).send({
        success: true,
        message: "Contraseña cambiada con éxito.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: true,
        message: "Error al cambiar contraseña.",
        error,
      });
    }
  },

  // * Empleados
  inviteEmployee: async (req, res) => {
    try {
      const { email, area, cargo, departamento } = req.body.form;
      const authorization = req.get("authorization");
      let token = null;
      if (authorization && authorization.toLowerCase().startsWith("bearer")) {
        token = authorization.substring(7);
      }
      const decodedToken = getTokenData(token);

      if (!decodedToken) {
        return res.status(400).send({
          success: false,
          message: "No autorizado.",
        });
      }

      const enterprise = await User.findOne({
        $and: [{ email: decodedToken.data.email }, { role: { $in: [1] } }],
      });

      if (!enterprise) {
        return res.status(400).send({
          success: false,
          message: "No autorizado.",
        });
      }

      const transporter = await nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

        const title = `Invitación a la plataforma de gestión de empleados`
        const contain = `Estimado usuario, le invitamos a que se registre en Quercu a nombre de la empresa: ${enterprise.name}. Para ello, haga click en el siguiente enlace:`
        const link = `${process.env.FRONTEND_URL}#/empleado/registrar?email=${email}&num=2&enterprise=${enterprise._id}&area=${area}&position=${cargo}&department=${departamento}`
        const contain2 = `Si no ha solicitado esta invitación, por favor ignore este correo.`
      

      const info = await transporter.sendMail({
        from: `"Quercu" <${process.env.MAIL_USERNAME}>`,
        to: email,
        subject: "Invitación a empresa",
        html: registerMessage(title, contain, link, contain2),
      });

      res.status(200).send({
        success: true,
        message: "Empleado invitado con éxito.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error al invitar empleado.",
        error,
      });
    }
  },

  registerEmployee: async (req, res) => {
    try {
      const { email, enterprise, area, position, department } = req.body;

      const enterpriseFinded = await User.findOneAndUpdate({
        $and: [{ _id: enterprise }, { role: { $in: [1] } }],
      });

      const areaFinded = await Area.findOne({
        $and: [{ _id: area }, { company_id: enterprise }],
      });

      const positionFinded = await Position.findOne({
        $and: [{ _id: position }, { company_id: enterprise }],
      });

      if (!enterpriseFinded || !areaFinded || !positionFinded) {
        return res.status(400).send({
          success: false,
          message: "No autorizado.",
        });
      } // * Verificamos que la empresa, el área y el cargo existan

      const userExist = await User.findOne({
        $or: [
          { email: req.body.email },
          { identificationNumber: req.body.identificationNumber },
        ],
      });

      if (userExist) {
        return res.status(400).send({
          success: false,
          message: "El empleado ya existe.",
        });
      } // * Verificamos que el empleado no exista

      const user = new User({
        ...req.body,
        role: [2],
        company_id: enterprise,
        salaryPerHour: 2,
        workingDays: [],
      });

      const actualizedEnterprise = await User.findByIdAndUpdate(
        enterprise,
        {
          $push: { employees: user._id },
        },
        { new: true }
      );

      console.log(user);

      const userSaved = await user.save();

      console.log(userSaved);

      res.status(200).send({
        success: true,
        message: "Empleado registrado con éxito.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error al registrar empleado.",
        error,
      });
    }
  },

  getAllEmployeesByPages: async (req, res) => {
    const { __company_id } = req;

    try {
      const page = req.params.page;
      const keyword = req.query.keyword || null;
      const filter = {
        name: {
          $regex: keyword,
          $options: "i",
        },
      };

      const pageNumber = parseInt(page);
      const limit = 20;
      const skip = (pageNumber - 1) * limit;
      const totalDocuments = await User.count({
        company_id: __company_id,
        role: {
          $in: [2]
        },
      });
      const totalPages = Math.ceil(totalDocuments / limit);

      const employees = await User.find({
        $and: [
          { 
            company_id: __company_id, role: {
            $in: [2]
          }},
          keyword ? filter : {},
        ],
      })
        .skip(skip)
        .limit(limit);

      res.status(200).send({ success: true, data: employees, totalPages });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  getAllEmployees: async (req, res) => { // * Obtiene todos los empleados de la empresa
    const { __company_id } = req;
    const data = await User.find({
      $and: [
        {
          company_id: __company_id, role: {
          $in: [2]
        }},
      ]
    });

    res.send({ users: data });
  },

  editEmployee: async (req, res) => {
    const { __company_id } = req;

    const body = req.body;
    const { id } = req.params;
    try {
      User.updateOne(
        { _id: id, company_id: __company_id },
        body,
        (error, docs) => {
          if (!error) {
            res.status(200).send({ success: true, docs, msg: "Usuario editado con éxito" });
          } else {
            res.status(404).send({ success: false, error, msg: "Error al editar usuario" });
          }
        }
      );
    } catch (error) {
      console.log(error)
      res.status(400).send({ success: false, error });
    }
  },

  deactivateEmployee: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      User.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res
              .status(200)
              .send({ success: true, msg: "Empleado eliminado con éxito" });
          } else {
            res.status(404).send({
              success: false,
              error,
              msg: "No se ha encontrado el empleado!",
            });
          }
        }
      );
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al eliminar empleado" });
    }
  },

  // * Links

  linkDiscord: async (req, res) => {
    try {
      const { discordId } = req.body;
      const { id } = req.params;
      
      const user = await User.findByIdAndUpdate(id, { discordId });

      res.status(200).send({ success: true, user, message: 'Cuenta enlazada correctamente!' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error });
    }
  },
};

module.exports = userController;
