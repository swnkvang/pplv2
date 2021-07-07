require('../config/lib')
require('../config/global')

const EncToken = async (token, tax_id) => {
    try {
        if (tax_id !== '') {
            arrbizUser_Select = []
            //  แกะข้อมูลจาก token soduim  เพื่อให้ได้ข้อมูล Profile ของ User
            var r = await sodium_ppl.data_login_Decrypted(token)
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
            for (i = 0; i < db_data.length; i++) {
                if (db_data[i].t == tax_id) {
                    connectiondb = db_data[i]
                    break
                }
            }
            for (y = 0; y < biz_detail.length; y++) {
                tmp_id_card_num = biz_detail[y].getbiz.id_card_num
                if (tmp_id_card_num == tax_id) {
                    arrbizUser_Select.push(biz_detail[y])
                }
            }
            json_data = {
                db_connect: connectiondb,
                one_result_data: one_result_data,
                biz_user_select: arrbizUser_Select,
                one_access_token: one_access_token
            }
            if (json_data) {
                return [true, json_data]
            }
        } else {
            throw ({
                message: 'Not Found Business Id',
                code: 400
            })
        }
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

module.exports = {
    EncToken
}