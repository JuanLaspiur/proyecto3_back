require('colors')
const {User} = require('../models')
const bcrypt = require('bcrypt')


const users = [
  {
    name: 'root',
    email: 'root@quercu.com',
    password: 'EICHE2023',
    role: [0]
  }
]

const seedUsers = {
  importData: async() => {
    let count = 0
    for(let i = 0; i < users.length; i++){
      const findUser = await User.findOne({email: users[i].email})
      if(!findUser){
        const user = users[i]
        const passHash = await bcrypt.hash(user.password, 10)
        user.password = passHash
        await User.create(user)
        count++
      }
    }
    console.log(`New user entries: ${count}`.green)
  },
  deleteData: async() => {
    let count = 0
    for(let i = 0; i < users.length; i++){
      const findUser = await User.findOneAndDelete({email: users[i].email})
      if(findUser){
        count++
      } 
    }
    console.log(`Users deleted: ${count}`.red)
  }
}

module.exports = seedUsers