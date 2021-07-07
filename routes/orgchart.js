require('../config/lib')
require('../config/global')

const router = express.Router();
const { response } = require('express');
const org = require('../method/orgchart_process')
const middleware = require('../method/middleware')
const get_data = require('../method/get_data_process')
const process_flow = require('../method/process_flow')

router.use(middleware)

router.get("/get_orgchart/",async function (req, res) {
    token = req.headers.authorization
    Selected_taxid = req.query.Selected_taxid
    console.log(Selected_taxid)
    account_id = req.query.account_id
    resp = await org.get_orgchart_oneid(token,Selected_taxid,account_id)
    res.send(resp)
});

router.get("/get_orgchart/deptid",async function (req, res) {
    dept_id = req.query.dept_id
    resp = await org.get_orgchart_deptid(dept_id)
    res.send(resp)
});

router.get("/get_orgchart/deptid_roleid",async function (req, res) {
    dept_id = req.query.dept_id
    role_id = req.query.role_id
    // resp = await org.get_orgchart_by_deptAndRole_V1(dept_id,role_id)
    resp = await org.get_orgchart_by_deptAndRole(dept_id,role_id)
    res.send(resp)
});

router.get("/get_orgchart/roleid",async function (req, res) {
    // dept_id = req.query.dept_id
    // var token = req.headers.authorization
    // token = token.split(' ')[1]
    // Selected_taxid = req.query.Selected_taxid
    let json_data = req.json_data
    let connectiondb = json_data.connectiondb
    role_id = req.query.role_id
    // default value
    // arrbizUser_Select = []
    //  แกะข้อมูลจาก token soduim  เพื่อให้ได้ข้อมูล Profile ของ User
    // r = await sodium_ppl.data_login_Decrypted(token)
    // console.log(r)
    // return r
    // console.log(r)
    // if (r[0] === 401) {
    //   return {status:'fail',data:null,messageER:r}
    // }
    
    // var one_result_data = r.data_login.one_result_data
    // var User_account_id = one_result_data.id
    // console.log('User_account_id',User_account_id)
   
    // var biz_detail = one_result_data.biz_detail
    // var db_data = r.db_data
    // var connectiondb = null
    // for (i=0;i<db_data.length;i++) {
    //     if (db_data[i].t == Selected_taxid) {
    //         connectiondb = db_data[i]
    //         break
    //     }
    // } 
    
    // for (y=0;y<biz_detail.length;y++){
    //     tmp_id_card_num = biz_detail[y].getbiz.id_card_num
    //     if(tmp_id_card_num == Selected_taxid){
    //         console.log(tmp_id_card_num)
    //         arrbizUser_Select.push(biz_detail[y])
    //     }
    // }
    resp = await org.get_orgchart_roleid(json_data,role_id)
    res.send(resp)
});

router.get("/get_orgchart/presale",async function (req, res) {
    let connectiondb = req.json_data.db_connect
    var keyword = req.query.keyword
    try {        
        resp = await get_data.get_orgchart_presell(keyword,connectiondb)
        if (resp[0] == 200){
            return res.status(200).json({
                result: "OK",
                messageText: resp[1],
                status_Code: 200
            });
        }
        else {
            return res.status(400).json({
                result: "ER",
                messageText: resp[1],
                status_Code: 400
            });
        }
        
    }
    catch (error) {
        // console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    
});

router.get("/get_orgchart/presale_v2",async function (req, res) {
    let connectiondb = req.json_data.db_connect
    var keyword = req.query.keyword
    var doctype = req.query.doctype
    try {   
        var res_con = await get_data.process_get_condition_presale(doctype,connectiondb)
        if (res_con[0] == true){
            // console.log(res_con[1])
            var role_id = res_con[1]
            var resp = await get_data.get_orgchart_presell_v2(keyword,role_id,connectiondb)
            if (resp[0] == 200){
                return res.status(200).json({
                    result: "OK",
                    messageText: resp[1],
                    status_Code: 200
                });
            }
            else {
                return res.status(400).json({
                    result: "ER",
                    messageText: resp[1],
                    status_Code: 400
                });
            }
        }
        else{
            return res.status(400).json({
                result: "ER",
                messageText: res_con[1],
                status_Code: 400
            });
        }
        
        
    }
    catch (error) {
        // console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    
});

router.get("/get_orgchart/presale_v3",async function (req, res) {
    let connectiondb = req.json_data.db_connect
    var keyword = req.query.keyword
    var doctype = req.query.doctype
    var type_of_team = req.query.type_of_team
    var type_of_flow = req.query.type_of_flow
    try {   
        var res_con = await get_data.process_get_flow_presale_v2(doctype,type_of_team,type_of_flow,connectiondb)
        console.log('res_con:',res_con)
        if (res_con[0] == true){
            if (res_con[2] == 0){
                var list_role_id = []
                res_con[1].forEach(element =>
                    list_role_id.push(element.role_id)
                );
                var resp = await get_data.get_orgchart_presell_v3(keyword,list_role_id,connectiondb)
                if (resp[0] == 200){
                    return res.status(200).json({
                        result: "OK",
                        messageText: resp[1],
                        status_Code: 200
                    });
                }
                else {
                    return res.status(400).json({
                        result: "ER",
                        messageText: resp[1],
                        status_Code: 400
                    });
                }
            }
            else if(res_con[2] == 1){
                var list_account_id = []
                res_con[1].forEach(element =>
                    list_account_id.push(element.account_id)
                );
                var resp = await get_data.get_orgchart_presell_v4(list_account_id,connectiondb)
                for (let k=0 ; k<res_con[1].length ; k++){
                    for (let l=0 ; l<resp[1].length ; l++){
                        if (res_con[1][k].account_id == resp[1][l].account_id){
                            res_con[1][k]['employee_id'] = resp[1][l].employee_id
                        }
                    }
                }
                if (resp[0] == 200){
                    return res.status(200).json({
                        result: "OK",
                        messageText: res_con[1],
                        status_Code: 200
                    });
                }
                else {
                    return res.status(400).json({
                        result: "ER",
                        messageText: res_con[1],
                        status_Code: 400
                    });
                }
            }
            
        }
        else{
            return res.status(400).json({
                result: "ER",
                messageText: res_con[1],
                status_Code: 400
            });
        }
        
        
    }
    catch (error) {
        // console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    
});

router.get("/get_orgchart/sale_old",async function (req, res) {
    let connectiondb = json_data.db_connect
    var tax_id = connectiondb.t
    var account_id = req.query.account_id
    var arr_data = []
    try {
        var resp = await get_data.get_orgchart_sale(account_id,connectiondb)
        var res_tel = await get_data.get_tel_number(tax_id,connectiondb)
        var dept_id = (resp[1][0]).dept_id

        console.log('dept_id:',dept_id)
        // resp[1].forEach(element => 
        //     arr_data.push((element.role_id == '65deda60-328c-11ea-9cd1-271a4772a5a0'))
        // );
        // console.log('resp:',(resp[1]))
        // var num_arr = arr_data.indexOf(true);
        // console.log('num_arr:',num_arr)
        
        
        for(let i = 0 ; i<resp[1].length ; i++){
            if (resp[1][i].role_id == '1c1a0050-367c-11ea-8e01-616f99689a32' || resp[1][i].role_id =='ee5eda40-9503-11ea-a4b4-0b87e9bf50ec' || resp[1][i].role_id =='05595d20-9504-11ea-990a-b169308bf5db' || resp[1][i].role_id =='0c784f50-9504-11ea-9b26-43b1a4d7c295' || resp[1][i].role_id =='fc4a2290-9503-11ea-a8eb-d90cae645fca' || resp[1][i].role_id =='65deda60-328c-11ea-9cd1-271a4772a5a0' || resp[1][i].role_id == '253835a0-367c-11ea-a0e1-e981e3624a06' || resp[1][i].role_id == '48d10950-6da9-11ea-8050-395bbea67444'){
                if (resp[1][i].role_id == '65deda60-328c-11ea-9cd1-271a4772a5a0'){
                    var res_sbm = await get_data.get_orgchart_SBM_ppl(connectiondb)
                    resp[1][i].tel_no = res_tel[1][0].tel_no
                    resp[1][i].SBM = res_sbm[1]
                    arr_data.push(resp[1][i])
                }
                else{
                    var res_sbm = await get_data.get_orgchart_SBM(dept_id,connectiondb)
                    resp[1][i].tel_no = res_tel[1][0].tel_no
                    resp[1][i].SBM = res_sbm[1]
                    arr_data.push(resp[1][i])
                }
            }
        }
        
        if (resp[0] == 200){
            return res.status(200).json({
                result: "OK",
                messageText: arr_data,
                status_Code: 200
            });
        }
        else {
            return res.status(400).json({
                result: "ER",
                messageText: resp[1],
                status_Code: 400
            });
        }
        
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    
});

router.get("/get_orgchart/sale",async function (req, res) {
    let connectiondb = req.json_data.db_connect
    var tax_id = connectiondb.t
    var account_id = req.query.account_id
    var arr_data = []
    try {
        var resp = await get_data.get_orgchart_sale(account_id,connectiondb)
        var res_tel = await get_data.get_tel_number(tax_id,connectiondb)
        var dept_id = (resp[1][0]).dept_id

        console.log('dept_id:',dept_id)
        
        // resp[1].forEach(element => 
        //     arr_data.push((element.role_id == '65deda60-328c-11ea-9cd1-271a4772a5a0'))
        // );
        // console.log('resp:',(resp[1]))
        // var num_arr = arr_data.indexOf(true);
        // console.log('num_arr:',num_arr)
        
        
        for(let i = 0 ; i<resp[1].length ; i++){
            if (resp[1][i].role_id == '1c1a0050-367c-11ea-8e01-616f99689a32' || resp[1][i].role_id =='ee5eda40-9503-11ea-a4b4-0b87e9bf50ec' || resp[1][i].role_id =='05595d20-9504-11ea-990a-b169308bf5db' || resp[1][i].role_id =='0c784f50-9504-11ea-9b26-43b1a4d7c295' || resp[1][i].role_id =='fc4a2290-9503-11ea-a8eb-d90cae645fca' || resp[1][i].role_id =='65deda60-328c-11ea-9cd1-271a4772a5a0' || resp[1][i].role_id == '253835a0-367c-11ea-a0e1-e981e3624a06' || resp[1][i].role_id == '48d10950-6da9-11ea-8050-395bbea67444' || resp[1][i].role_id == 'd32c5fc0-de9a-11e9-9eed-6dafe77dbb46'){
                if (resp[1][i].role_id == '65deda60-328c-11ea-9cd1-271a4772a5a0'){
                    var res_sbm = await get_data.get_orgchart_SBM_ppl(connectiondb)
                    resp[1][i].tel_no = res_tel[1][0].tel_no
                    resp[1][i].SBM = res_sbm[1]
                    arr_data.push(resp[1][i])
                }
                else{
                    var res_sbm = await get_data.get_orgchart_SBM(dept_id,connectiondb)
                    resp[1][i].tel_no = res_tel[1][0].tel_no
                    resp[1][i].SBM = res_sbm[1]
                    arr_data.push(resp[1][i])
                }
            }
            else if (resp[1][i].dept_id == '2e9927c0-629c-11ea-8ac4-776cf511d20d'){
                var res_sbm = await get_data.get_orgchart_SBM_cost(dept_id,connectiondb)
                resp[1][i].tel_no = res_tel[1][0].tel_no
                resp[1][i].SBM = res_sbm[1]
                arr_data.push(resp[1][i])
            }
        }
        
        if (resp[0] == 200){
            return res.status(200).json({
                result: "OK",
                messageText: arr_data,
                status_Code: 200
            });
        }
        else {
            return res.status(400).json({
                result: "ER",
                messageText: resp[1],
                status_Code: 400
            });
        }
        
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    
});

router.get("/get_orgchart/sale_v2",async function (req, res) {
    let connectiondb = req.json_data.db_connect
    var tax_id = connectiondb.t
    var account_id = req.query.account_id
    var document_type = req.query.document_type
    var arr_data = []
    try {
        var resp_flow = await process_flow.process_flow_sale(connectiondb,document_type)
        var resp = await get_data.get_orgchart_sale(account_id,connectiondb)
        var res_tel = await get_data.get_tel_number(tax_id,connectiondb)
        var dept_id = (resp[1][0]).dept_id

        // resp[1].forEach(element => 
        //     arr_data.push((element.role_id == '65deda60-328c-11ea-9cd1-271a4772a5a0'))
        // );
        // console.log('resp:',(resp[1]))
        // var num_arr = arr_data.indexOf(true);
        // console.log('num_arr:',num_arr)
        
        if (resp[0] == 200){
            for(let i = 0 ; i<resp[1].length ; i++){
                // if (resp[1][i].role_id == '1c1a0050-367c-11ea-8e01-616f99689a32' || resp[1][i].role_id =='ee5eda40-9503-11ea-a4b4-0b87e9bf50ec' || resp[1][i].role_id =='05595d20-9504-11ea-990a-b169308bf5db' || resp[1][i].role_id =='0c784f50-9504-11ea-9b26-43b1a4d7c295' || resp[1][i].role_id =='fc4a2290-9503-11ea-a8eb-d90cae645fca' || resp[1][i].role_id =='65deda60-328c-11ea-9cd1-271a4772a5a0' || resp[1][i].role_id == '253835a0-367c-11ea-a0e1-e981e3624a06'){
                if (resp_flow[1].includes(resp[1][i].role_id) || resp[1][i].role_id =='65deda60-328c-11ea-9cd1-271a4772a5a0'){
                    if (resp[1][i].role_id == '65deda60-328c-11ea-9cd1-271a4772a5a0'){
                        var res_sbm = await get_data.get_orgchart_SBM_ppl(connectiondb)
                        resp[1][i].tel_no = res_tel[1][0].tel_no
                        resp[1][i].SBM = res_sbm[1]
                        arr_data.push(resp[1][i])
                    }
                    else{
                        var res_sbm = await get_data.get_orgchart_SBM(dept_id,connectiondb)
                        resp[1][i].tel_no = res_tel[1][0].tel_no
                        resp[1][i].SBM = res_sbm[1]
                        arr_data.push(resp[1][i])
                    }
                }
            }
                return res.status(200).json({
                    result: "OK",
                    messageText: arr_data,
                    status_Code: 200
                });
        }
        else {
            return res.status(400).json({
                result: "ER",
                messageText: resp[1],
                status_Code: 400
            });
        }
        
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    
});

router.get("/get_orgchart/head_department",async function (req, res) {
    try {
        let json_data = req.json_data
        // let json_data = req.json_data
        let account_id = req.query.account_id
        resp = await org.get_head_department(json_data,account_id)
        if (resp[0]){
            return res.status(200).json({
                result: "OK",
                messageText: resp[1],
                status_Code: 200
            });
        }
        else {
            return res.status(400).json({
                result: "ER",
                messageText: resp[1],
                status_Code: 400
            });
        }
        
        
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    
});




module.exports = router
