const { Area, Departament, Position } = require("../models");
const ObjectId = require("mongodb").ObjectID;

const companyConfigController = {
  createArea: async (req, res) => {
    const { __company_id } = req;

    const { data } = req.body;
    try {
      const newArea = await Area.create({ ...data, company_id: __company_id });
      res
        .status(200)
        .send({ success: true, msg: "Área creada exitosamente", newArea });
    } catch (error) {
      res
        .status(400)
        .send({ success: false, msg: "Error al crear Área", error });
    }
  },
  createDepartament: async (req, res) => {
    const { __company_id } = req;

    const { data } = req.body;
    try {
      const newDepartament = await Departament.create({
        ...data,
        company_id: __company_id,
      });
      res.status(200).send({
        success: true,
        msg: "Departamento creada exitosamente",
        newDepartament,
      });
    } catch (error) {
      res
        .status(400)
        .send({ success: false, msg: "Error al crear Departamento", error });
    }
  },
  createPosition: async (req, res) => {
    const { __company_id } = req;

    const { data } = req.body;
    try {
      const newPosition = await Position.create({
        ...data,
        company_id: __company_id,
      });
      res.status(200).send({
        success: true,
        msg: "Posición creada exitosamente",
        newPosition,
      });
    } catch (error) {
      res
        .status(400)
        .send({ success: false, msg: "Error al crear Posición", error });
    }
  },

  editArea: async (req, res) => {
    const { __company_id } = req;

    const body = req.body;
    const id = req.params;
    try {
      console.log(body);
      Area.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        body,
        (error, docs) => {
          if (!error) {
            res.status(200).send({ success: true, docs });
          } else {
            console.log(error);
            res.status(404).send({ success: false, error });
          }
        }
      );
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  editDepartament: async (req, res) => {
    const { __company_id } = req;

    const body = req.body;
    const id = req.params;
    try {
      Departament.updateOne(
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
  editPosition: async (req, res) => {
    const { __company_id } = req;
    const body = req.body;
    const id = req.params;
    try {
      Position.updateOne(
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

  deactivateArea: async (req, res) => {
    const { __company_id } = req;
    const id = req.params;
    try {
      Area.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        async (error, docs) => {
          if (!error) {
            const response1 = await Departament.updateMany({ area: ObjectId(id), company_id: __company_id }, { deleted: true })
            const response2 = await Position.updateMany({ area: ObjectId(id), company_id: __company_id }, { deleted: true })
            res.status(200).send({ success: true, msg: "Área eliminada exitosamente" });
          } else {
            res.status(404).send({ success: false, error });
          }
        }
      );
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  deactivateDepartament: async (req, res) => {
    const { __company_id } = req;
    const id = req.params;
    try {
      Departament.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        async (error, docs) => {
          if (!error) {
            const response = await Position.updateMany({ departament: ObjectId(id), company_id: __company_id }, { deleted: true })
            res.status(200).send({ success: true, msg: "Departamento eliminado exitosamente" });
          } else {
            res.status(404).send({ success: false, error });
          }
        }
      );
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  deactivatePosition: async (req, res) => {
    const { __company_id } = req;
    const id = req.params;
    try {
      Position.updateOne(
        { _id: ObjectId(id), company_id: __company_id },
        { deleted: true },
        (error, docs) => {
          if (!error) {
            res.status(200).send({ success: true, msg: "Cargo eliminado exitosamente" });
          } else {
            res.status(404).send({ success: false, error });
          }
        }
      );
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  getAllAreas: async (req, res) => {
    const { __company_id } = req;
    try {
      const areas = await Area.find({
        deleted: false,
        company_id: __company_id,
      });

      res.status(200).send({ success: true, areas });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  getAllDepartaments: async (req, res) => {
    const { __company_id } = req;

    try {
      const departaments = await Departament.find({
        deleted: false,
        company_id: __company_id,
      }).populate("area");
      res.status(200).send({ success: true, departaments });
    } catch (error) {
      console.log(error);
      res.status(400).send({ success: false, error });
    }
  },
  getAllPositions: async (req, res) => {
    const { __company_id } = req;

    try {
      const positions = await Position.find({
        deleted: false,
        company_id: __company_id,
      }).populate(["area", "departament", "company_id"]);
      res.status(200).send({ success: true, positions });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },

  getAreasFilter: async (req, res) => {
    const { __company_id } = req;
    const { body } = req;
    try {
      const areas = await Area.find({
        ...body,
        deleted: false,
        company_id: __company_id,
      });
      res.status(200).send({ success: true, areas });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  getDepartamentsFilter: async (req, res) => {
    const { __company_id } = req;
    const { body } = req;
    try {
      const departaments = await Departament.find({
        ...body,
        deleted: false,
        company_id: __company_id,
      }).populate(["area"]);
      res.status(200).send({ success: true, departaments });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  getPostionsFilter: async (req, res) => {
    const { __company_id } = req;
    const { body } = req;
    try {
      const positions = await Position.find({
        ...body,
        deleted: false,
        company_id: __company_id,
      }).populate(["area", "departament"]);
      res.status(200).send({ success: true, positions });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  findAreaById: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      const area = await Area.findOne({
        _id: ObjectId(id),
        company_id: __company_id,
      });
      if (area) {
        res.status(200).send({ success: true, area });
      } else {
        res.status(404).send({ success: false });
      }
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  findDepartamentById: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      const departament = await Departament.findOne({
        _id: ObjectId(id),
        company_id: __company_id,
      });
      if (departament) {
        res.status(200).send({ success: true, departament });
      } else {
        res.status(404).send({ success: false });
      }
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  findPositionById: async (req, res) => {
    const { __company_id } = req;

    const id = req.params;
    try {
      const position = await Position.findOne({
        _id: ObjectId(id),
        company_id: __company_id,
      });
      if (position) {
        res.status(200).send({ success: true, position });
      } else {
        res.status(404).send({ success: false });
      }
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  findPositionByDepartament: async (req, res) => {
    const { __company_id } = req;
    const { id } = req.params;

    try {
      const positions = await Position.find({
        deleted: false,
        company_id: __company_id,
        departament: id
      });

      res.status(200).send({ success: true, positions });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
  findDepartamentsByArea: async (req, res) => {
    const { __company_id } = req;
    const { id } = req.params;

    try {
      const departaments = await Departament.find({
        area: id
      });

      res.status(200).send({ success: true, data: departaments });
    } catch (error) {
      res.status(400).send({ success: false, error });
    }
  },
};

module.exports = companyConfigController;
