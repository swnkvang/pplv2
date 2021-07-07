require('../config/lib')
require('../config/global')


const GenerateTokenDataForService = async (data, sub, private) => {
    try {
        var inJWTJson = {
            name: "pplv2",
            sub: sub,
            data: data,
            iat: Math.floor(Date.now() / 1000) - 30
        }
        var token = jwt_service.encode(inJWTJson, private, false, 'RS256');
        return [true, token]
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

module.exports = {
    GenerateTokenDataForService
}