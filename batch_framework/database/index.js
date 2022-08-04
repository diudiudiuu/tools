const mysql = require('mysql')
const { config } = require('../config')

const pool = mysql.createPool({
  host: config.mysql.mysql_host,
  user: config.mysql.mysql_user,
  password: config.mysql.mysql_password,
  database: config.mysql.mysql_dbname
})

let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        if (!sql) {
          pool.end()
          return
        }
        connection.config.queryFormat = function (sql, values) {
          if (!values) return sql
          return sql.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
              return this.escape(values[key])
            }
            return txt
          }.bind(this))
        }
        console.log("***执行sql*********:" + sql)
        console.log("***绑定参数*********:" + JSON.stringify(values))
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(JSON.stringify(rows)))
          }
        })
        connection.release()
      }
    })
  })
}

module.exports = { query }
