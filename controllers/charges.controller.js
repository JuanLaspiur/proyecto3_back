const moment = require("moment/moment");
const { Charge, Prospect, Planning } = require("../models");
const ObjectId = require("mongodb").ObjectID;
const nodemailer = require("nodemailer");
require("dotenv").config();
const { billingEmail } = require("../utilities/billingEmail");

const chargesController = {
  createCharge: async (req, res) => {
    const { __company_id } = req;
    const { data } = req.body;
    try {
      console.log(data);
      const newCharge = await Charge.create({
        ...data,
        company_id: __company_id,
      });
      res.status(200).send({
        success: true,
        newCharge,
        msg: "Cobro programado creado con éxito",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error,
        msg: "Error al crear cobro programado",
      });
    }
  },

  editCharge: async (req, res) => {
    try {
      const { id } = req.params;

      const charge = await Charge.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).send({
        success: true,
        charge,
        message: "Cobro programado editado con éxito",
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        success: false,
        error,
        message: "Error al editar cobro programado",
      });
    }
  },

  getAll: async (req, res) => {
    const { __company_id } = req;

    try {
      const charges = await Charge.find({
        deleted: false,
        company_id: __company_id,
      }).populate(["contract", "project"]);

      for (let index = 0; index < charges.length; index++) {
        charges[index].contract.prospectOrClient = await Prospect.findById(
          charges[index].contract.prospectOrClient
        );
      }
      res.status(200).send({ success: true, charges });
    } catch (error) {
      res.status(400).send({ success: false, error });
      console.log(error);
    }
  },

  deactivateCharge: async (req, res) => {
    const { __company_id } = req;
    const id = req.params;
    try {
      Charge.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res.status(200).send({
              success: true,
              msg: "Cobro programado eliminado con éxito",
            });
          } else {
            res.status(404).send({
              success: false,
              error,
              msg: "No se encontro el cobro programado!",
            });
          }
        }
      );
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
        msg: "Error al eliminar cobro programado",
      });
    }
  },

  getByMonths: async (req, res) => {
    const { __company_id } = req;
    const mes = req.params.mes;
    const anio = req.params.anio;

    try {
      const charges = await Charge.find({
        deleted: false,
        company_id: __company_id,
        $expr: {
          $and: [
            { $eq: [{ $month: "$date" }, mes] },
            { $eq: [{ $year: "$date" }, anio] },
          ],
        },
      }).populate({ path: "project", populate: { path: "client" }});

      // console.log(charges[0].project);

      res.status(200).send({ success: true, charges });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error });
    }
  },

  notify: async (req, res) => {
    const { __company_id } = req;
    const id = req.params;
    try {
      const charge = await Charge.findOne({
        _id: ObjectId(id),
        company_id: __company_id,
      }).populate(["contract"]);
      charge.contract.prospectOrClient = await Prospect.findById(
        charge.contract.prospectOrClient
      );

      const title = charge.contract.name;
      const planning = await Planning.findById(charge.contract.plannings[0]);
      const clientEmail = charge.contract.prospectOrClient.email;
      const detalleComercial = {
        comentarios: charge.description,
        costo: {
          currency: charge.alternative_currency,
          amount: charge.alternative_amount || charge.amount,
        },
        fecha: moment(charge.date).format("DD/MM/YYYY"),
      };

      const transporter = nodemailer.createTransport({
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

      const mailOptions = {
        from: `"Quercu" <${process.env.MAIL_USERNAME}>`,
        to: clientEmail,
        subject: "Recordatorio de pago",
        html: billingEmail(title, detalleComercial, planning),
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      Charge.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { notify: true },
        (error, docs) => {
          if (!error) {
            res.status(200).send({
              success: true,
              msg: "Cliente avisado con éxito",
            });
          } else {
            console.log(error);
            res.status(404).send({
              success: false,
              error,
              msg: "No se pudo avisar al cliente!",
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error,
        msg: "Error al avisar al cliente",
      });
    }
  },

  sendEmail: async (req, res) => {
    try {
      const { __company_id } = req;
      const charges = await Charge.find({
        deleted: false,
        company_id: __company_id,
        notify: true,
        last_notify: { $ne: new Date().getMonth() + 1 },
      }).populate(["contract"]);

      for (let index = 0; index < charges.length; index++) {
        charges[index].contract.prospectOrClient = await Prospect.findById(
          charges[index].contract.prospectOrClient
        );
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: "",
        subject: "Recordatorio de pago",
        html: ` <h1>Recordatorio de pago</h1>
        <p>Estimado cliente, le recordamos que tiene un pago pendiente por el monto de $${charges[index].amount} por el servicio de ${charges[index].contract.service.name}.</p>
        <p>Por favor, realice el pago correspondiente a la brevedad.</p>
        <p>Saludos cordiales.</p>
        <p>Equipo de ${charges[index].contract.company.name}.</p>`,
      };

      for (let index = 0; index < charges.length; index++) {
        mailOptions.to = charges[index].contract.prospectOrClient.email;
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }

      res.status(200).send({ success: true, charges });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error });
    }
  },
};

module.exports = chargesController;
