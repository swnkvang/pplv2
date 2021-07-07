require('../config/lib')
require('../config/global')

module.exports = (async function (req, res, next) {
    try {
        var authorization = req.headers.authorization
        var type_token = String(authorization).split(' ')[0]
        var token = String(authorization).split(' ')[1]
        if (type_token != 'Bearer') {
            throw ({
                message: 'Unauthorized',
                code: 401
            })
        }
        if (req.headers.hasOwnProperty('taxid')) {
            if (req.headers.taxid !== '') {
                let tax_id = req.headers.taxid
                let arrbizUser_Select = []
                //  แกะข้อมูลจาก token soduim  เพื่อให้ได้ข้อมูล Profile ของ User
                let r = await sodium_ppl.data_login_Decrypted(token)
                // console.log('r',r)
                if (r[0] == 400 || r[0] == 401) {
                    res.status(401)
                    res.send()
                }
                var one_result_data = r[1].data_login.one_result_data
                var biz_detail = one_result_data.biz_detail
                var db_data = r[1].db_data
                var one_access_token = r[1].data_login.one_access_token
                var connectiondb = null
                for (let i = 0; i < db_data.length; i++) {
                    if (db_data[i].t == tax_id) {
                        connectiondb = db_data[i]
                        break
                    }
                }
                for (let y = 0; y < biz_detail.length; y++) {
                    let tmp_id_card_num = biz_detail[y].getbiz.id_card_num
                    if (tmp_id_card_num == tax_id) {
                        arrbizUser_Select.push(biz_detail[y])
                    }
                }
                var json_data = {
                    db_connect: connectiondb,
                    one_result_data: one_result_data,
                    biz_user_select: arrbizUser_Select,
                    one_access_token: one_access_token
                }
                if (json_data) {
                    req.json_data = json_data
                    next()
                }
            } else {
                throw ({
                    message: 'Not Found Business Id',
                    code: 400
                })
            }
        } else {
            throw ({
                message: 'Not Found Business Id',
                code: 400
            })
        }
    } catch (error) {
        console.log(error)
        res.status(error.code).json({
            status: false,
            message: error.message,
            data: null
        })
    }


})