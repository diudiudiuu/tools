const { user } = require('../model/user')
const { config } = require('../config')
const { query } = require('../database')
const { tools } = require('../util/tools')

const batch = async () => {
    console.log("*********batch开始****************")

    const user_id = "1"
    const userInfo = await user.getUserInfo(user_id)
    console.log("*********userInfo****************")
    console.log(userInfo)

    console.log("*********batch结束****************")
}

module.exports = {
    batch
}