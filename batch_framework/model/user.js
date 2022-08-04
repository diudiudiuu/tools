const { query } = require('../database')

// 获取user详情
const getUserInfo = async (user_id) => {
    const sql = `select * from tb_user where user_id = :user_id`
    const bind = {
        user_id: user_id
    }
    return await query(sql, bind)
}


const user = {
    getUserInfo,
}
module.exports = {
    user
}