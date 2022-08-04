
const { command } = require('./command')

exports.handler = async function (event, context) {
    await command.batch()
};

