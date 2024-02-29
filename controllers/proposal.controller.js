const { Proposal } = require("../models");
const ObjectId = require("mongodb").ObjectID;

const proposalController = {
  createProposal: async (req, res) => {
    const { __company_id } = req;
    const { data } = req.body;
    try {
      const totalDocuments = await Proposal.count();
      const newProposal = await Proposal.create({
        ...data,
        company_id: __company_id,
        formNumber: totalDocuments + 1,
      });
      res.status(200).send({
        success: true,
        newProposal,
        msg: "Propuesta creada con éxito",
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send({ success: false, error, msg: "Error al crear propuesta" });
    }
  },

  editProposal: async (req, res) => {
    const { __company_id } = req;

    const body = req.body;
    const id = req.params;
    try {
      Proposal.updateOne(
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

  deactivateProposal: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      Proposal.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res
              .status(200)
              .send({ success: true, msg: "Propuesta eliminada con éxito" });
          } else {
            res.status(404).send({
              success: false,
              error,
              msg: "No se encontro la propuesta!",
            });
          }
        }
      );
    } catch (error) {
      res
        .status(400)
        .send({ success: false, error, msg: "Error al eliminar propuesta" });
    }
  },

  getAll: async (req, res) => {
    const { __company_id } = req;

    try {
      const proposals = await Proposal.find({
        deleted: false,
        company_id: __company_id,
      }).populate(["prospectOrClient", "plannings"]);
      res.status(200).send({ success: true, proposals });
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
      const totalDocuments = await Proposal.count({
        deleted: false,
        company_id: __company_id,
      });
      const totalPages = Math.ceil(totalDocuments / limit);
      const proposals = await Proposal.find({
        $and: [
          { deleted: false, company_id: __company_id },
          keyword ? filter : {},
        ],
      })
        .skip(skip)
        .limit(limit)
        .populate(["prospectOrClient", "plannings"]);

      res.status(200).send({ success: true, proposals, totalPages });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  findById: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      const proposal = await Proposal.findOne({
        _id: ObjectId(id),
        company_id: __company_id,
      }).populate(["prospectOrClient"]);
      if (proposal) {
        res.status(200).send({ success: true, proposal });
      } else {
        res.status(404).send({ success: false });
      }
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
};

module.exports = proposalController;
