const { connect } = require('mongoose')
module.exports.connectTomongo = async (req, res) => {
    try {
        await connect('mongodb://localhost/bank')
        console.log("connected to mongoDB");
    } catch (err) {
        console.log(err)
    }
}

