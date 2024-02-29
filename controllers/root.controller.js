const {User} = require('../models')

const rootController = {
  getAllCompanies: async(req, res)=>{
    try {
      const companies = await User.where({"role.0": {$eq: 1}})
      res.status(200).send({
        success: true,
        companies
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success: true,
        error
      })
    }
  }
}

module.exports = rootController