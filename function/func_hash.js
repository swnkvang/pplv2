require('../config/lib')

var sha512 = async function (str) {
    try{
        var hash = crypto.createHash('sha512').update(str, 'utf-8').digest('hex');
        return hash
    }catch(err) {
        console.log(err)
        return ''
    }
    
}


var enaccess = function (data) {
    let secretkey = global_SSO_KEY
    return new Promise((resolve, reject) => {
        jwt.sign(data, secretkey, {
            algorithm: "HS256"
        }, function (err, token) {
            if (!err) {
                token = token.split(".")
                token = token[2] + "." + token[0] + "." + token[1]
                resolve(token);
            }
        });
    });
}

var encode = function (data) {
    try {
        const secretkey = 'q2TCgLKSwawLCtVFJnShihR16YqYcNUO'
        const token = jwt.sign(data, secretkey, {
            algorithm: "HS256"
        })
        return [true,token]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}

var decode = function(data) {
    try {
        const secretkey = 'q2TCgLKSwawLCtVFJnShihR16YqYcNUO'
        encoded = jwt.verify(data, secretkey, { algorithm: 'HS256' })
        return [true,encoded]
      } catch (error) {
        console.log(error)
        return [false,error]
      }
}

var makeid = async function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    enaccess,
    sha512,
    makeid,
    decode,
    encode
}