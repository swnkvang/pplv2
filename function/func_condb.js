require('../config/lib')

var connectiondb = async function (token,Selected_taxid) {
    try {
        token = token.split(' ')[1]
        // default value
        arrbizUser_Select = []
        //  แกะข้อมูลจาก token soduim  เพื่อให้ได้ข้อมูล Profile ของ User
        r = await sodium_ppl.data_login_Decrypted(token)
        console.log(r)
        if (r[0] == 400 || r[0] == 401){
            return {
                status: 'FAIL',
                data: null,
                messageER: 'error from data_login_Decrypted ' + String(r)
            }
        }
        var one_result_data = r.data_login.one_result_data
        var biz_detail = one_result_data.biz_detail
        var db_data = r.db_data
        var connectiondb = null
        for (i=0;i<db_data.length;i++) {
            if (db_data[i].t == Selected_taxid) {
                connectiondb = db_data[i]
                break
            }
        } 
        for (y=0;y<biz_detail.length;y++){
            tmp_id_card_num = biz_detail[y].getbiz.id_card_num
            if(tmp_id_card_num == Selected_taxid){
                console.log(tmp_id_card_num)
                arrbizUser_Select.push(biz_detail[y])
            }
        }
        json_data = {
            db_connect: connectiondb,
            one_result_data: one_result_data,
            biz_user_select: arrbizUser_Select
        }
        return {
            status: 'SUCCESS',
            data: json_data,
            messageER: null
        }
       
    } catch (err){
        console.log(err)
        return {
            status: 'FAIL',
            data: null,
            messageER: err
        }
    } 
    
}

module.exports = {
    // connectiondb
}