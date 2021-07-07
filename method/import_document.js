require('../config/lib')
require('../config/global')

const db_transaction = require('../database/actiondb_transaction')

async function import_data_from_documentid(json_data,documentid){
    try {
        const dbconfig = json_data.db_connect
        result_tran = await db_transaction.find_transaction_from_documentid(dbconfig,documentid)
        if (result_tran[0]){
            var flow = result_tran[1].flow
            var stepnow = result_tran[1].step_now
            var status_draft = false
            var input_data = result_tran[1].input_data
            var status_document = result_tran[1].status_document
            if (status_document !== 'Y'){
                if (stepnow!=1){
                    return [true,input_data]
                }else{
                    for (let i =0; i<flow.length;i++){
                        var index = flow[i].index
                        if (index==stepnow){
                            var actor = flow[i].actor
                            var check_draft = actor.find(actors => actors.status === "Draft");
                            if (check_draft!==undefined){
                                status_draft = true
                                break
                            }
                        }
                    }
                    if (!status_draft){
                        return [true,input_data]
                    }else{
                        let tmperror = {
                            msg_thai : 'เอกสารบันทึกแบบร่างไม่สามารถนำมาใช้ได้',
                            msg_eng : 'Draft documents cannot be used'
                        }
                        return [false,null,tmperror]
                    }
                }
            }else{
                return [true,input_data]
            }
        }else{
            return [false,null,result_tran[1]]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    import_data_from_documentid
}