const { Movement } = require("../models");
const ObjectId = require("mongodb").ObjectID;

const movementsController = {
  createMovement: async (req, res) => {
    const { __company_id } = req;
    const { data } = req.body;
    try {
      const newMovement = await Movement.create({
        ...data,
        company_id: __company_id,
      });
      res.status(200).send({
        success: true,
        newMovement,
        msg: "Movimiento creado con éxito",
      });
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al crear movimiento" });
    }
  },

  getAll: async (req, res) => {
    const { __company_id } = req;

    try {
      const movements = await Movement.find({
        deleted: false,
        company_id: __company_id,
      }).populate(["contract"]);
      res.status(200).send({ success: true, movements });
    } catch (error) {
      res.status(400).send({ success: false, error });
      console.log(error);
    }
  },

  getAllByPages: async (req, res) => {
    const { __company_id } = req;

    try {
      const page = req.params.page;
      const keyword = req.query.keyword || null;
      const filter = {
        type: {
          $regex: keyword,
          $options: "i",
        },
      };
      const pageNumber = parseInt(page);
      const limit = 20;
      const skip = (pageNumber - 1) * limit;
      const totalDocuments = await Movement.count({
        deleted: false,
        company_id: __company_id,
      });
      const totalPages = Math.ceil(totalDocuments / limit);
      const movements = await Movement.find({
        $and: [
          { deleted: false, company_id: __company_id },
          keyword ? filter : {},
        ],
      })
        .skip(skip)
        .limit(limit)
        .populate(["contract"]);

      res.status(200).send({ success: true, movements, totalPages });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  deactivateMovement: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      Movement.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res
              .status(200)
              .send({ success: true, msg: "Movimiento eliminado con éxito" });
          } else {
            res.status(404).send({
              success: false,
              error,
              msg: "No se encontro el movimiento!",
            });
          }
        }
      );
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al eliminar movimiento" });
    }
  },

  getByMonths: async (req, res) => {
    const { __company_id } = req;
    const mes = req.params.mes;
    const anio = req.params.anio;

    try {
      const movements = await Movement.find({
        deleted: false,
        company_id: __company_id,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, mes] },
            { $eq: [{ $year: "$createdAt" }, anio] },
          ],
        },
      });
      res.status(200).send({ success: true, movements });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error });
    }
  },

  getBalanceByYear: async (req, res) => {
    const { __company_id } = req;
    const anio = req.params.anio;

    try {
      let data = [];
      for (let index = 1; index < 13; index++) {
        let movement = await Movement.find({
          deleted: false,
          company_id: __company_id,
          $expr: {
            $and: [
              { $eq: [{ $month: "$createdAt" }, index] },
              { $eq: [{ $year: "$createdAt" }, anio] },
            ],
          },
        });
        let balance = 0;
        movement &&
          movement[0] &&
          movement.map((item) => {
            if (item.type === "income") {
              balance = balance + item.amount;
            } else if (item.type === "cost") {
              balance = balance - item.amount;
            }
          });

        data.push(balance);
      }
      res.status(200).send({ success: true, data });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error });
    }
  },
};

module.exports = movementsController;
