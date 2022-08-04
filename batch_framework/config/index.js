const env = process.env.node_env

//根据env 加载不同配置文件
let config = {}

if (env == 'dev') {
  const { dev } = require('./dev')
  config = dev
} else if (env == 'stage') {
  const { stage } = require('./stage')
  config = stage
} else if (env == 'prod') {
  const { prod } = require('./prod')
  config = prod
} else {
  const { dev } = require('./dev')
  config = dev
}

module.exports = {
  config
}