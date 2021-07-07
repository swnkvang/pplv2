require('../config/lib')

var ch_detailcondition = async function (str) {
    var hash = crypto.createHash('sha512').update(str, 'utf-8').digest('hex');
    return hash
}

module.exports = {
    ch_detailcondition
}