require('../config/lib')
require('../config/global')

const router = express.Router();
const cvmData = require('../method/cvm_data');
const serviceData = require('../database/service_db');

router.post("/data_from_cvm",async function (req, res){
    try {
        var data_json = req.body
        var tax_id = data_json.tax_id
        var token_service = data_json.token
        var service_id = data_json.service_id
        var data_encode = data_json.data
        let login_data = await sodium_ppl.login_service(token_service,tax_id)
        var type_data  = ''
        if (login_data[0]){
            const json_data = login_data[1].db_data
            const result_service = await serviceData.select_servicekey(json_data,service_id)
            if (result_service[0]){
                var publicKey = result_service[1].publicKey
                data = jwt.decode(data_encode, publicKey, 'HS256');
                if (data.hasOwnProperty('data_contact')){
                    data_cvm = data.data_contact[0]
                    type_data = "data_contact"
                    const result_data = await cvmData.add_update_cvmdata(json_data,data_cvm,type_data)
                    if (result_data[0]){
                        return res.status(200).json({
                            status: true,
                            message: "success",
                            data: null
                        })
                    }else{
                        throw ({
                            message: result_data[1]
                        })
                    }
                }else if (data.hasOwnProperty('data_customer')){
                    data_cvm = data.data_customer[0]
                    type_data = "data_customer"
                    const result_data = await cvmData.add_update_cvmdata(json_data,data_cvm,type_data)
                    if (result_data[0]){
                        return res.status(200).json({
                            status: true,
                            message: "success",
                            data: null
                        })
                    }else{
                        throw ({
                            message: result_data[1]
                        })
                    }
                }
            }else{
                throw ({
                    message: result_service[1]
                })
            }
        }else{
            throw ({
                message: login_data[1]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});

module.exports = router