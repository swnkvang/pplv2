require('../config/lib')

var sha512 = async function (str) {
    var hash = crypto.createHash('sha512').update(str, 'utf-8').digest('hex');
    return hash
}


var enaccess = function (data) {
    // let secretkey = global_SSO_KEY
    // return new Promise((resolve, reject) => {
    //     jwt.sign(data, secretkey, {
    //         algorithm: "HS256"
    //     }, function (err, token) {
    //         if (!err) {
    //             token = token.split(".")
    //             token = token[2] + "." + token[0] + "." + token[1]
    //             resolve(token);
    //         }
    //     });
    // });
}



module.exports = {
    enaccess,
    sha512,
    makeid
}