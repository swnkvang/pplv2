require('../config/lib')
require('../config/global')
const conditionSchema = require('../schema/condition.sch')
const {
    connonsql
} = require('../config/mongo_db')
const { ConnectionBase } = require('mongoose')
const func_condition = require('../function/func_condition')


var self = module.exports = {
    ch_condition_flow: async function (input_data,conditionID,dept_id,connectiondb) {
        try {
            
        } catch (err) {
            console.log(err)
            return[false,err]
        }
        var flow_sign = null
        // var dept_id = arrbizUser_Select[0].dept_id
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_condition = await conditionSchema.find({
            $and: [{
                _id: conditionID
                }]
            });
        if (r_condition == null) {
            return [true,'not found data']
        }
        var key_compare = r_condition[0].key_compare
        var condition_type = r_condition[0].type
        var sf_input = null
        var external_input = null
        var ex_jv = null
        var InputFrontCode = null
        // console.log('key_compare',key_compare)
        for (r=0;r<key_compare.length;r++) {
            let key = key_compare[r]
            // console.log('len input data',input_data.length)
            for (j=0;j<input_data.length;j++) {
                // console.log(input_data[j].key,key)
                if (input_data[j].key == key) {
                    if (key == 'SaleFactors') {
                        // if (input_data[j].value != 0) {
                        //     sf_input = input_data[j].value
                        // }
                        sf_input = input_data[j].value
                    }
                    if (key == 'External') {
                        // if (input_data[j].value != 0) {
                        //     external_input = input_data[j].value
                        // }
                        external_input = parseFloat(input_data[j].value)
                    }
                    if (key == 'Ext_JV') {
                        ex_jv = parseFloat(input_data[j].value)
                    }
                }
            }
        }
        // console.log('external_input',external_input,'ex_jv',ex_jv)
        external_input = external_input
        // external_input = external_input.toFixed(2);
        // console.log('sf_input',sf_input,'external_input',external_input,'ex_jv',ex_jv)
        if (sf_input == null) {
            sf_input = 0
        }
        if (sf_input != null && external_input != null) {
            if (sf_input == 0 && external_input == 0 && ex_jv == 0) {
                for (let f=0;f<input_data.length;f++) {
                    // console.log(input_data[j].key,key)
                    if (input_data[f].key == 'Service_Table') {
                        for (let v=0;v<input_data[f].value.length;v++) {
                            for (let d=0;d<input_data[f].value[v].length;d++) {
                                if (input_data[f].value[v][d].key == 'Service_Table_S1_U1') {
                                    for (let s=0;s<input_data[f].value[v][d].value.length;s++) {
                                        if (input_data[f].value[v][d].value[s].key == 'FrontCode') {
                                            InputFrontCode = input_data[f].value[v][d].value[s].value
                                        }
                                    }
                                }
                            }
                            
                        }
                        
                    }
                }
                let detail = r_condition[0].detail
                for (let d=0;d<detail.length;d++) {
                    let tmp_flow_sign = detail[d].flow_sign
                    var colorgroup = detail[d].color
                    let FrontCodeTmp = detail[d].FrontCode
                    if (FrontCodeTmp.includes(InputFrontCode)) {
                        flow_sign = tmp_flow_sign
                        return [true,flow_sign,colorgroup]
                    }
                }
                
            }
            if (condition_type == 'node'){
                let condition_detail = r_condition[0].detail
                for(k=0;k<condition_detail.length;k++){
                    // console.log('K',k)
                    var tmp_condition = condition_detail[k].condition
                    var tmp_flow_sign = condition_detail[k].flow_sign
                    var colorgroup = condition_detail[k].color
                    if (colorgroup === undefined) {
                        colorgroup = null
                    }
                    var tmp_id = condition_detail[k].id
                    for(z=0;z<tmp_condition.length;z++){
                        // console.log('z',z)
                        let arr_status_sf = []
                        let arr_status_ex = []
                        let arr_status_exjv = []
                        console.log(tmp_condition[z])
                        let loop_type = tmp_condition[z].type
                        let loop_external = tmp_condition[z].External
                        let loop_sf = tmp_condition[z].SaleFactors
                        let loop_exjv = tmp_condition[z].Ext_JV
                        let loopDeptid = loop_type.dept_id
                        let loopName = loop_type.name
                        let SF_less = loop_sf.less
                        let SF_greater = loop_sf.greater
                        let SF_eq_less = loop_sf.equal_less
                        let SF_eq_greater = loop_sf.equal_greater
                        let EX_less = loop_external.less
                        let EX_greater = loop_external.greater
                        let EX_eq_less = loop_external.equal_less
                        let EX_eq_greater = loop_external.equal_greater
                        console.log('loop_exjv',colorgroup)
                        let EXJV_less  = loop_exjv.less
                        let EXJV_greater  = loop_exjv.greater
                        let EXJV_eq_less  = loop_exjv.eq_less
                        let EXJV_eq_greater  = loop_exjv.eq_greater
                        // console.log('dept_id',dept_id)
                        // console.log('loopDeptid',loopDeptid)
                        for (let y=0;y<dept_id.length;y++) {
                            if (loopDeptid.length == 0 || loopDeptid.includes(dept_id[y])) {
                                // less ค่าต่ำสำที่จะเป็นไปได้ >
                                // greater ค่ามากสุดที่จะเป็นไปได้ <
                                // SF
                                if(SF_less != null){
                                    if (sf_input > SF_less) {
                                        arr_status_sf.push(true)
                                    }
                                    else {
                                        arr_status_sf.push(false)
                                    }
                                } else {
                                    arr_status_sf.push(true)
                                }
                                if(SF_greater != null){
                                    if (sf_input < SF_greater) {
                                        arr_status_sf.push(true)
                                    } else {
                                        arr_status_sf.push(false)
                                    }
        
                                } else {
                                    arr_status_sf.push(true)
                                }
                                if(SF_eq_less != null){
                                    if (sf_input >= SF_eq_less) {
                                        arr_status_sf.push(true)
                                    } else {
                                        arr_status_sf.push(false)
                                    }
        
                                } else {
                                    arr_status_sf.push(true)
                                }
                                if(SF_eq_greater != null){
                                    if (sf_input <= SF_eq_greater) {
                                        arr_status_sf.push(true)
                                    } else {
                                        arr_status_sf.push(false)
                                    }
                                } else {
                                    arr_status_sf.push(true)
                                }
                                // EX
                                if(EX_less != null){
                                    if (external_input > EX_less) {
                                        arr_status_ex.push(true)
                                    }
                                    else {
                                        arr_status_ex.push(false)
                                    }
                                } else {
                                    arr_status_ex.push(true)
                                }
                                if(EX_greater != null){
                                    if (external_input < EX_greater) {
                                        arr_status_ex.push(true)
                                    } else {
                                        arr_status_ex.push(false)
                                    }
        
                                } else {
                                    arr_status_ex.push(true)
                                }
                                if(EX_eq_less != null){
                                    if (external_input >= EX_eq_less) {
                                        arr_status_ex.push(true)
                                    } else {
                                        arr_status_ex.push(false)
                                    }
        
                                } else {
                                    arr_status_ex.push(true)
                                }
                                if(EX_eq_greater != null){
                                    if (external_input <= EX_eq_greater) {
                                        arr_status_ex.push(true)
                                    } else {
                                        arr_status_ex.push(false)
                                    }
                                } else {
                                    arr_status_ex.push(true)
                                }
                                // EX_JV
                                if(EXJV_less != null){
                                    if (ex_jv > SF_less) {
                                        arr_status_exjv.push(true)
                                    }
                                    else {
                                        arr_status_exjv.push(false)
                                    }
                                } else {
                                    arr_status_exjv.push(true)
                                }
                                if(EXJV_greater != null){
                                    if (ex_jv < EXJV_greater) {
                                        arr_status_exjv.push(true)
                                    } else {
                                        arr_status_exjv.push(false)
                                    }
        
                                } else {
                                    arr_status_exjv.push(true)
                                }
                                if(EXJV_eq_less != null){
                                    if (ex_jv >= EXJV_eq_less) {
                                        arr_status_exjv.push(true)
                                    } else {
                                        arr_status_exjv.push(false)
                                    }
        
                                } else {
                                    arr_status_exjv.push(true)
                                }
                                if(EXJV_eq_greater != null){
                                    if (ex_jv <= EXJV_eq_greater) {
                                        arr_status_exjv.push(true)
                                    } else {
                                        arr_status_exjv.push(false)
                                    }
                                } else {
                                    arr_status_exjv.push(true)
                                }
                                // console.log('arr_status_sf',arr_status_sf)
                                // console.log('arr_status_ex',arr_status_ex)
                                // console.log('arr_status_exjv',arr_status_exjv)
                                if (arr_status_sf.length != 0 && arr_status_ex.length != 0 && arr_status_exjv != 0) {
                                    if (arr_status_sf.includes(false) || arr_status_ex.includes(false) || arr_status_exjv.includes(false)) {
                                        // console.log('not accept')
                                    } else {
                                        // console.log('accept')
                                        flow_sign = tmp_flow_sign
                                        return [true,flow_sign,colorgroup]
                                    }
                                }
                            } else {
                                // console.log('can not')
                            }
                        }
                      
                       
                    }
                }
            }
        }
        else {
            return [false,'sf_input and external_input are null',null]
        }
        return [false,null,'ไม่สามารถ impletment actor']
        
    },
    ch_condition_node_v3: async function (input_data,conditionID,dept_id,connectiondb) {
        try {
            
        } catch (err) {
            console.log(err)
            return[false,err]
        }
        var flow_sign = null
        // var dept_id = arrbizUser_Select[0].dept_id
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_condition = await conditionSchema.find({
            $and: [{
                _id: conditionID
                }]
            });
        if (r_condition == null) {
            return [true,'not found data']
        }
        var key_compare = r_condition[0].key_compare
        var condition_type = r_condition[0].type
        var sf_input = null
        var external_input = null
        var ex_jv = null
        // console.log('key_compare',key_compare)
        for (r=0;r<key_compare.length;r++) {
            let key = key_compare[r]
            // console.log('len input data',input_data.length)
            for (j=0;j<input_data.length;j++) {
                // console.log(input_data[j].key,key)
                if (input_data[j].key == key) {
                    if (key == 'SaleFactors') {
                        // if (input_data[j].value != 0) {
                        //     sf_input = input_data[j].value
                        // }
                        sf_input = input_data[j].value
                    }
                    if (key == 'External') {
                        // if (input_data[j].value != 0) {
                        //     external_input = input_data[j].value
                        // }
                        external_input = parseFloat(input_data[j].value)
                    }
                    if (key == 'Ext_JV') {
                        ex_jv = parseFloat(input_data[j].value)
                    }
                }
            }
        }
        // console.log('external_input',external_input,'ex_jv',ex_jv)
        external_input = external_input + ex_jv
        external_input = external_input.toFixed(2);
        console.log('sf_input',sf_input,'external_input',external_input)
        
        if (sf_input != null && external_input != null) {
            if (condition_type == 'node'){
                let condition_detail = r_condition[0].detail
                for(k=0;k<condition_detail.length;k++){
                    // console.log('K',k)
                    var tmp_condition = condition_detail[k].condition
                    var tmp_flow_sign = condition_detail[k].flow_sign
                    var colorgroup = condition_detail[k].color
                    if (colorgroup === undefined) {
                        colorgroup = null
                    }
                    var tmp_id = condition_detail[k].id
                    for(z=0;z<tmp_condition.length;z++){
                        // console.log('z',z)
                        let arr_status_sf = []
                        let arr_status_ex = []
                        let loop_type = tmp_condition[z].type
                        let loop_external = tmp_condition[z].External
                        let loop_sf = tmp_condition[z].SaleFactors
                        let loopDeptid = loop_type.dept_id
                        let loopName = loop_type.name
                        let SF_less = loop_sf.less
                        let SF_greater = loop_sf.greater
                        let SF_eq_less = loop_sf.equal_less
                        let SF_eq_greater = loop_sf.equal_greater
                        let EX_less = loop_external.less
                        let EX_greater = loop_external.greater
                        let EX_eq_less = loop_external.equal_less
                        let EX_eq_greater = loop_external.equal_greater
                        // console.log('dept_id',dept_id)
                        // console.log('loopDeptid',loopDeptid)
                        for (let y=0;y<dept_id.length;y++) {
                            if (loopDeptid.length == 0 || loopDeptid.includes(dept_id[y])) {
                                // console.log('SF_eq_greater',SF_eq_greater,'sf_input',sf_input)
                                // less ค่าต่ำสำที่จะเป็นไปได้ >
                                // greater ค่ามากสุดที่จะเป็นไปได้
                                if(SF_less != null){
                                    if (sf_input > SF_less) {
                                        arr_status_sf.push(true)
                                    }
                                    else {
                                        arr_status_sf.push(false)
                                    }
                                } else {
                                    arr_status_sf.push(true)
                                }
                                if(SF_greater != null){
                                    if (sf_input < SF_greater) {
                                        arr_status_sf.push(true)
                                    } else {
                                        arr_status_sf.push(false)
                                    }
        
                                } else {
                                    arr_status_sf.push(true)
                                }
                                if(SF_eq_less != null){
                                    if (sf_input >= SF_eq_less) {
                                        arr_status_sf.push(true)
                                    } else {
                                        arr_status_sf.push(false)
                                    }
        
                                } else {
                                    arr_status_sf.push(true)
                                }
                                if(SF_eq_greater != null){
                                    if (sf_input <= SF_eq_greater) {
                                        arr_status_sf.push(true)
                                    } else {
                                        arr_status_sf.push(false)
                                    }
                                } else {
                                    arr_status_sf.push(true)
                                }
                                // console.log('arr_status_sf',arr_status_sf)
                                if(EX_less != null){
                                    if (external_input > EX_less) {
                                        arr_status_ex.push(true)
                                    }
                                    else {
                                        arr_status_ex.push(false)
                                    }
                                } else {
                                    arr_status_ex.push(true)
                                }
                                if(EX_greater != null){
                                    if (external_input < EX_greater) {
                                        arr_status_ex.push(true)
                                    } else {
                                        arr_status_ex.push(false)
                                    }
        
                                } else {
                                    arr_status_ex.push(true)
                                }
                                if(EX_eq_less != null){
                                    if (external_input >= EX_eq_less) {
                                        arr_status_ex.push(true)
                                    } else {
                                        arr_status_ex.push(false)
                                    }
        
                                } else {
                                    arr_status_ex.push(true)
                                }
                                if(EX_eq_greater != null){
                                    if (external_input <= EX_eq_greater) {
                                        arr_status_ex.push(true)
                                    } else {
                                        arr_status_ex.push(false)
                                    }
                                } else {
                                    arr_status_ex.push(true)
                                }
                                // console.log('arr_status_ex',arr_status_ex)
                                if (arr_status_sf.length != 0 && arr_status_ex.length != 0) {
                                    if (arr_status_sf.includes(false) || arr_status_ex.includes(false)) {
                                        // console.log('not accept')
                                    } else {
                                        // console.log('accept')
                                        flow_sign = tmp_flow_sign
                                        return [true,flow_sign,colorgroup]
                                    }
                                }
                            } else {
                                // console.log('can not')
                            }
                        }
                      
                       
                    }
                }
            }
        }
        else {
            return [false,'sf_input and external_input are null',null]
        }
        return [false,null,'ไม่สามารถ impletment actor']
        
    },
    ch_condition_node_v2: async function (input_data,conditionID,arrbizUser_Select,connectiondb) {
        var flow_sign = null
        var dept_id = arrbizUser_Select[0].dept_id
        // console.log('sf_input',sf_input)
        // console.log('external_input',external_input)
        // เชื่อมต่อ connection
        if (connectiondb != null) { await connonsql(connectiondb) }
        // query condition from table
        // let r_condition = await conditionSchema.findOne({
        //     _id: conditionID,
        //     "detail.condition.type.dept_id": dept_id,
        // }, {
        //     __v: 0
        // })
        let r_condition = await conditionSchema.find({
            $and: [{
                _id: conditionID
                }]
            });
        if (r_condition == null) {
            return [400,'not found data']
        }
        var key_compare = r_condition[0].key_compare
        var condition_type = r_condition[0].type
        console.log('key_compare',key_compare)
        for (k=0;k<key_compare.length;k++) {
            let key = key_compare[k]
            // console.log('key',k,key)
            for (j=0;j<input_data.length;j++) {
                if (input_data[j].key == key) {
                    console.log('key',input_data[j].key)
                    console.log('value',input_data[j].value)
                }
            }
        }
        if (condition_type == 'node'){
            let condition_detail = r_condition[0].detail
            for(k=0;k<condition_detail.length;k++){
                console.log('K',k)
                var tmp_condition = condition_detail[k].condition
                var tmp_flow_sign = condition_detail[k].flow_sign
                var tmp_id = condition_detail[k].id
                // console.log(tmp_id)
                // let arr_status_sf = []
                // let arr_status_ex = []
                for(z=0;z<tmp_condition.length;z++){
                    console.log('z',z)
                    let arr_status_sf = []
                    let arr_status_ex = []
                    let loop_type = tmp_condition[z].type
                    let loop_external = tmp_condition[z].external
                    let loop_sf = tmp_condition[z].sf
                    let loopDeptid = loop_type.dept_id
                    let loopName = loop_type.name
                    // console.log('loop_sf',loop_sf)
                    let SF_less = loop_sf.less
                    let SF_greater = loop_sf.greater
                    let SF_eq_less = loop_sf.equal_less
                    let SF_eq_greater = loop_sf.equal_greater
                    let EX_less = loop_external.less
                    let EX_greater = loop_external.greater
                    let EX_eq_less = loop_external.equal_less
                    let EX_eq_greater = loop_external.equal_greater
                    if (loopDeptid.includes(dept_id)) {
                        console.log('SF_eq_greater',SF_eq_greater,'sf_input',sf_input)
                        // less ค่าต่ำสำที่จะเป็นไปได้ >
                        // greater ค่ามากสุดที่จะเป็นไปได้
                        if(SF_less != null){
                            if (sf_input > SF_less) {
                                arr_status_sf.push(true)
                            }
                            else {
                                arr_status_sf.push(false)
                            }
                        } else {
                            arr_status_sf.push(true)
                        }
                        if(SF_greater != null){
                            if (sf_input < SF_greater) {
                                arr_status_sf.push(true)
                            } else {
                                arr_status_sf.push(false)
                            }

                        } else {
                            arr_status_sf.push(true)
                        }
                        if(SF_eq_less != null){
                            if (sf_input >= SF_eq_less) {
                                arr_status_sf.push(true)
                                // console.log('yessss sefff')
                            } else {
                                arr_status_sf.push(false)
                            }

                        } else {
                            arr_status_sf.push(true)
                        }
                        if(SF_eq_greater != null){
                            if (sf_input <= SF_eq_greater) {
                                arr_status_sf.push(true)
                            } else {
                                arr_status_sf.push(false)
                            }
                        } else {
                            arr_status_sf.push(true)
                        }
                        console.log('arr_status_sf',arr_status_sf)
                        if(EX_less != null){
                            if (external_input > EX_less) {
                                arr_status_ex.push(true)
                            }
                            else {
                                arr_status_ex.push(false)
                            }
                        } else {
                            arr_status_ex.push(true)
                            // console.log('push true')
                        }
                        if(EX_greater != null){
                            if (external_input < EX_greater) {
                                arr_status_ex.push(true)
                            } else {
                                arr_status_ex.push(false)
                            }

                        } else {
                            arr_status_ex.push(true)
                        }
                        console.log('EX_eq_less',EX_eq_less)
                        if(EX_eq_less != null){
                            if (external_input >= EX_eq_less) {
                                arr_status_ex.push(true)
                                // console.log('yessss sefff')
                            } else {
                                arr_status_ex.push(false)
                            }

                        } else {
                            arr_status_ex.push(true)
                        }
                        // console.log('EX_eq_greater',EX_eq_greater)
                        console.log('external_input',external_input)
                        if(EX_eq_greater != null){
                            if (external_input <= EX_eq_greater) {
                                arr_status_ex.push(true)
                            } else {
                                arr_status_ex.push(false)
                            }
                        } else {
                            arr_status_ex.push(true)
                        }
                        console.log('arr_status_ex',arr_status_ex)
                        
                        // if (sf_input >= SF_less && external_input <= EX_greater) {
                        //     console.log('OK')
                        // } 
                        if (arr_status_sf.length != 0 && arr_status_ex.length != 0) {
                            if (arr_status_sf.includes(false) || arr_status_ex.includes(false)) {
                                console.log('not accept')
                            } else {
                                console.log('accept')
                                return [200,tmp_flow_sign]
                            }
                        }
                    } else {
                        console.log('can not')
                    }
                   
                }
            }
             
        
            // console.log('OK',condition_detail)
        }


        return [400,r_condition]
        

        
        
    
        
    },
    ch_condition_node: async function (conditionID,Selected_taxid,token) {
        //  แกะข้อมูลจาก token soduim  เพื่อให้ได้ข้อมูล Profile ของ User
        r = await sodium_ppl.data_login_Decrypted(token)
        if (r[0] === 400) {
          return {status:'fail',data:null,messageER:r}
        }
        // สร้างตัวแปรเก็บ value ข้อมูล Profile ของ User
        var one_result_data = r.one_result_data
        var db_data = r.db_data
        var connectiondb = null
        for (i=0;i<db_data.length;i++) {
            if (db_data[i].t == Selected_taxid) {
                connectiondb = db_data[i]
                break
            }
        }
        // เชื่อมต่อ connection
        if (connectiondb != null) { await connonsql(connectiondb) }
        
        // query condition from table
        let r_condition = await conditionSchema.findOne({
            _id: conditionID,
            
        }, {
            __v: 0
        })
        // console.log('r_condition',r_condition)
        // r_condition 
        var condition_type = r_condition.type
        if (condition_type == 'node'){
            let condition_detail = r_condition.detail
            for(k=0;k<condition_detail.length;k++){
                condition_detail[k]
            }
            console.log('OK')
        }


        return r_condition
        

        
        
    
        
    },
}