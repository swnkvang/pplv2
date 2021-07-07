require('../config/lib')
const ServiceKeySchema = require('../schema/serviceKey.sch')
const {
    connonsql
} = require('../config/mongo_db')


async function select_servicekey(json_data,serviceid){
    try {
        await connonsql(json_data)
        const  GetService = await ServiceKeySchema.findOne({
            _id: serviceid
        });
        if (GetService.length!==0){
            return [true,GetService]
        }else {
            return [false,'not found service']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    select_servicekey
}