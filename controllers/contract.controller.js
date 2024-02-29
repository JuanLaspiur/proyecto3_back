const { Contract } = require("../models");
const ObjectId = require("mongodb").ObjectID;

const contractController = {
  createContract: async (req, res) => {
    const { __company_id } = req;
    const { data } = req.body;
    try {
      const newContract = await Contract.create({
        ...data,
        company_id: __company_id,
      });
      res
        .status(200)
        .send({ success: true, newContract, msg: "Contrato creado con éxito" });
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al crear contrato" });
    }
  },

  getAll: async (req, res) => {
    const { __company_id } = req;

    try {
      const contracts = await Contract.find({
        deleted: false,
        company_id: __company_id,
      }).populate(["prospectOrClient", "plannings"]);
      
      res.status(200).send({ success: true, contracts });
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
      const totalDocuments = await Contract.count({
        deleted: false,
        company_id: __company_id,
      });
      const totalPages = Math.ceil(totalDocuments / limit);
      const contracts = await Contract.find({
        $and: [
          { deleted: false, company_id: __company_id },
          keyword ? filter : {},
        ],
      })
        .skip(skip)
        .limit(limit)
        .populate(["prospectOrClient", "plannings"]);

      res.status(200).send({ success: true, contracts, totalPages });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  deactivateContract: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      Contract.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res
              .status(200)
              .send({ success: true, msg: "Contrato eliminado con éxito" });
          } else {
            res.status(404).send({
              success: false,
              error,
              msg: "No se encontro el contrato!",
            });
          }
        }
      );
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al eliminar contrato" });
    }
  },

  getById: async (req, res) => {
    const { __company_id } = req;
    const id = req.params;
    try {
      const contract = await Contract.find({
        _id: ObjectId(id),
        deleted: false,
        company_id: __company_id,
      }).populate(["prospectOrClient", "plannings"]);
      
      res.status(200).send({ success: true, contract });
    } catch (error) {
      res.status(400).send({ success: false, error });
      console.log(error);
    }
  },
  editContract: async (req, res) => {
    const { __company_id } = req;
    const { name } = req.body;
    const id = req.params;
    try {
      const contract = await Contract.findByIdAndUpdate(
        ObjectId(id), { name }
      );
      res.status(200).send({ success: true, contract, msg: "Contrato editado con éxito" });
    } catch (error) {
      res.status(400).send({ success: false, error, msg: "Error al editar contrato" });
      console.log(error);
    }
  },
};

module.exports = contractController;
