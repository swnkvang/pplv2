require('../config/lib')
require('../config/global')
require('../config/mongo_db')
const flow_Schema = require('../schema/flow.sch')
const {
    connonsql
} = require('../config/mongo_db')

var find_flow = async function(connectiondb,flow_id) {
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_flow = await flow_Schema.findOne({
            _id: flow_id,
            
        }, {
            __v: 0
        })
        return [true,r_flow]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}

// var update_flow = async function(connectiondb,transactionid,data_transaction) {
//     try {
//         if (connectiondb != null) { await connonsql(connectiondb) }
//         await flow_Schema.findOneAndUpdate({
//             _id: transactionid
//         }, data_transaction, {
//             upsert: true,
//             setDefaultsOnInsert: true
//         }, function (err) {
//             console.log(err)
//         });
        
//         return [true,'']
//     } catch (error) {
//         console.log('error',error)
//         return [false,error.message]
//     }
    
// }

var self = module.exports = {
    find_flow
}