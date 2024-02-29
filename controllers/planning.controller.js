const { Planning } = require("../models");
const ObjectId = require("mongodb").ObjectID;

const planningController = {
  createPlanning: async (req, res) => {
    const { __company_id } = req;
    const { data } = req.body;
    try {
      const newPlanning = await Planning.create({
        ...data,
        company_id: __company_id,
      });
      res.status(200).send({
        success: true,
        newPlanning,
        msg: "Planificación creado con éxito!",
      });
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al crear planificación" });
    }
  },

  editPlanning: async (req, res) => {
    const { __company_id } = req;
    const body = req.body;
    const id = req.params;
    try {
      Planning.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        body,
        (error, docs) => {
          if (!error) {
            res.status(200).send({ success: true, docs });
          } else {
            res.status(404).send({ success: false, error });
          }
        }
      );
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  

  deactivatePlanning: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      Planning.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res
              .status(200)
              .send({
                success: true,
                msg: "Planificación eliminada con éxito",
              });
          } else {
            res
              .status(404)
              .send({
                success: false,
                error,
                msg: "Error al eliminar planificación",
              });
          }
        }
      );
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  getAll: async (req, res) => {
    const { __company_id } = req;

    try {
      const plannings = await Planning.find({
        deleted: false,
        company_id: __company_id,
      });
      res.status(200).send({ success: true, plannings });
    } catch (error) {
      res.status(400).send({ success: false, error });
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
      const totalDocuments = await Planning.count({
        deleted: false,
        company_id: __company_id,
      });
      const totalPages = Math.ceil(totalDocuments / limit);
      const plannings = await Planning.find({
        $and: [
          { deleted: false, company_id: __company_id },
          keyword ? filter : {},
        ],
      })
        .skip(skip)
        .limit(limit);

      res.status(200).send({ success: true, plannings, totalPages });
    } catch (error) {
      console.log("error", error);
      res.status(400).send({ success: false, error });
    }
  },

  findById: async (req, res) => {
    const { __company_id } = req;
    const id = req.params;
    try {
      const planning = await Planning.findOne({
        _id: ObjectId(id),
        company_id: __company_id,
      }).populate("positions");

      if (planning) {
        res.status(200).send({ success: true, planning });
      } else {
        res.status(404).send({ success: false });
      }
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
};

module.exports = planningController;
