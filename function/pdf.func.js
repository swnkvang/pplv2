require('../config/lib')
require('../config/global')
require('../callAPI/axiosAPI')
const {
    connonsql
} = require('../config/mongo_db')
const {
    querySql
} = require("../config/maria_db")


const base64ToBuffer = async (base64) => {
    var binstr = Buffer.from(base64, 'utf-8').toString('base64');
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        buf[i] = ch.charCodeAt(0);
    });
    return buf;
}

const getDetailPdf = async (base64) => {
    try {
        let bufferObj = Buffer.from(base64, "base64");
        return new Promise((resolve, reject) => {
            pdf_parse(bufferObj).then(function (data) {
                    resolve([true, data])
                })
                .catch(function (error) {
                    console.log(error)
                    resolve([false, error])
                })
        })
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

module.exports = {
    base64ToBuffer,
    getDetailPdf
}