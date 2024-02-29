const { Prospect, Contract } = require("../models");
const ObjectId = require("mongodb").ObjectID;

const prospectController = {
  createProspect: async (req, res) => {
    const { __company_id } = req;

    const { data } = req.body;
    try {
      const newProspect = await Prospect.create({
        ...data,
        company_id: __company_id,
      });
      res
        .status(200)
        .send({
          success: true,
          newProspect,
          msg: "Prospecto creado con éxito",
        });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  editProspect: async (req, res) => {
    const { __company_id } = req;
    const body = req.body;
    const id = req.params;
    try {
      Prospect.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        body.data,
        (error, docs) => {
          if (!error) {
            res.status(200).send({ success: true, docs, msg: "Prospecto editado con éxito"   });
          } else {
            res.status(404).send({ success: false, error });
          }
        }
      );
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  deactivateProspect: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      Prospect.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res
              .status(200)
              .send({ success: true, msg: "Prospecto eliminado con éxito" });
          } else {
            res
              .status(404)
              .send({
                success: false,
                error,
                msg: "No se ha encontrado el prospecto!",
              });
          }
        }
      );
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al eliminar prospecto" });
    }
  },

  getAll: async (req, res) => {
    const { __company_id } = req;

    try {
      const prospects = await Prospect.find({
        deleted: false,
        company_id: __company_id,
      });
      res.status(200).send({ success: true, prospects });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  getAllClients: async (req, res) => {
    const { __company_id } = req;
    try {
      const prospects = await Prospect.find({
        deleted: false,
        company_id: __company_id,
      });

      const clients = [];

      for (const prospect of prospects) {
        const hasContract = await Contract.findOne({
          prospectOrClient: prospect._id,
        });

        if (hasContract) {
          clients.push(prospect);
        }
      }

      // console.log(clients);

      res.status(200).send({ success: true, clients });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error });
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
      const totalDocuments = await Prospect.count({
        deleted: false,
        company_id: __company_id,
      });
      const totalPages = Math.ceil(totalDocuments / limit);
      const prospects = await Prospect.find({
        $and: [
          { deleted: false, company_id: __company_id },
          keyword ? filter : {},
        ],
      })
        .skip(skip)
        .limit(limit);

      res.status(200).send({ success: true, prospects, totalPages });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  findById: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      const prospect = await Prospect.findOne({
        _id: ObjectId(id),
        company_id: __company_id,
      });
      if (prospect) {
        res.status(200).send({ success: true, prospect });
      } else {
        res.status(404).send({ success: false });
      }
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
};

module.exports = prospectController;
