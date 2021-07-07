require('../config/lib')
require('../config/global')

const callOneid = require('../oneid/call_oneid');
const HASH = require('../function/func_hash');
const Update = require('../database/db_update');

var self = module.exports = {
    authorize: async function (dataJson) {
        arrayUpdateTime = []
        username = dataJson.username
        password = dataJson.password
        let ipaddress = await HASH.makeid(16)
        ipaddress = ipaddress + '' + String(parseInt(Date.now() / 1000))
        console.log(ipaddress)
        console.log(username,password)
        let info  = {
            "grant_type":  "password",
            "username":     username,
            "password":     password,
            "client_id":    globalclientId,
            "client_secret": globalsecretKey,
            "scope": "pic"
        }
        url_oneidLogin = globalUrlOne + '/api/oauth/getpwd'
        url_oneidGetbiz = globalUrlOne + '/api/account_and_biz_detail'
        r = await callOneid.call_LoginOneid(url_oneidLogin,info)
        // console.log('r',r[0])
        if (r[0] == 200) {
            try{
                let data = r[1].data
                let type = data.token_type
                let access_token = data.access_token
                let account_id = data.account_id
                let username = data.username
                let refresh_token = data.refresh_token
                let expires_in = data.expires_in
                let type_access_token = type + " " + access_token
                let employee_email = []
                let hash_data = await HASH.sha512(password)
                console.log(type_access_token)
                let detail = await callOneid.call_getBizOneid(url_oneidGetbiz, type_access_token)
                console.log(detail[0])
                if (detail[0] == 200) {
                    let data_detail = detail[1].data
                    let email_one = {
                        email_one_1: data_detail.thai_email,
                        email_one_2: data_detail.thai_email2,
                        email_one_3: data_detail.thai_email3
                    }
                    let email = data_detail.email
                    if (email.length != 0) {
                        for (let y = 0; y < email.length; y++) {
                            const emaills = email[y];
                            let email_emyp = emaills.email
                            employee_email.push(email_emyp)
                        }
                    }
                    let sign_hash = null
                    if (data.thai_email != undefined) {
                        sign_hash = await HASH.sha512(data.thai_email)
                    }
                    let biz_detail = data_detail.biz_detail
                    let enaccess_data = data = {
                        iss: "paperless",
                        aud: null,
                        token_data: access_token
                    }
                    if (biz_detail.length != 0) {
                        for (let u = 0; u < biz_detail.length; u++) {
                            const rows = biz_detail[u];
                            let one_updated_at = rows.updated_at
                            arrayUpdateTime.push(new Date(one_updated_at))
                        }
                    }
                    let MaxUpdateDate = Math.max.apply(Math, arrayUpdateTime);
                    let en_ssoaccess = await HASH.enaccess(enaccess_data)
                    let resJson = {
                        one_access_token: access_token,
                        one_result_data: data_detail,
                        enaccess: en_ssoaccess,
                        status: "success",
                        username: username
                    }
                    console.log('email_one',email_one)
                    await Update.updateProfile(account_id, username, access_token, refresh_token, hash_data, MaxUpdateDate, biz_detail, email_one, sign_hash, employee_email,ipaddress, data_detail)
                    return [200, resJson]
                }
            }catch(err){
                console.log(err)
                return [400,err]
            }
          
        }
        else {
            return [401,'Unauthorized']
        }
      
      
       
    }
}