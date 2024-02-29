const { model } = require("mongoose");

const models = {
  User: require("./nosql/users"),
  Area: require("./nosql/area"),
  Departament: require("./nosql/departament"),
  Position: require("./nosql/position"),
  Prospect: require("./nosql/prospect"),
  Planning: require("./nosql/planning"),
  Proposal: require("./nosql/proposal"),
  Contract: require("./nosql/contract"),
  Movement: require("./nosql/movement"),
  Charge: require("./nosql/charge"),
  Task: require("./nosql/task"),
  Debt: require("./nosql/debt"),
  WorkingDay: require("./nosql/working_day"), 
  Milestone: require("./nosql/milestones"),
  Project: require("./nosql/project"),
  ChangePasswordRequest: require("./nosql/changePasswordRequest"),
};

module.exports = models;
