const { Debt } = require("../models");
const ObjectId = require("mongodb").ObjectID;

const debtsController = {
  createDebt: async (req, res) => {
    const { __company_id } = req;
    const { data } = req.body;
    try {
      const newDebt = await Debt.create({
        ...data,
        company_id: __company_id,
      });
      res
        .status(200)
        .send({ success: true, newDebt, msg: "Deuda creada con éxito" });
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al crear deuda" });
    }
  },

  getAll: async (req, res) => {
    const { __company_id } = req;

    try {
      const debts = await Debt.find({
        deleted: false,
        company_id: __company_id,
      });
      res.status(200).send({ success: true, debts });
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
        name: {
          $regex: keyword,
          $options: "i",
        },
      };
      const pageNumber = parseInt(page);
      const limit = 20;
      const skip = (pageNumber - 1) * limit;
      const totalDocuments = await Debt.count({
        deleted: false,
        company_id: __company_id,
      });
      const totalPages = Math.ceil(totalDocuments / limit);
      const debts = await Debt.find({
        $and: [
          { deleted: false, company_id: __company_id },
          keyword ? filter : {},
        ],
      })
        .skip(skip)
        .limit(limit);

      res.status(200).send({ success: true, debts, totalPages });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  deactivateDebt: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      Debt.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res
              .status(200)
              .send({ success: true, msg: "Deuda eliminada con éxito" });
          } else {
            res.status(404).send({
              success: false,
              error,
              msg: "No se encontro la deuda!",
            });
          }
        }
      );
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al eliminar deuda" });
    }
  },

  totalDebts: async (req, res) => {
    const { __company_id } = req;

    try {
      const debts = await Debt.find({
        deleted: false,
        company_id: __company_id,
      });

      const total = debts.reduce((acc, debt) => {
        return acc + debt.amount;
      }, 0);

      res.status(200).send({ success: true, total });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  }
};

module.exports = debtsController;
