require('../config/lib')
const {templateModel} = require('../schema/template.sch');
const {
    connonsql
} = require('../config/mongo_db')

async function insert_templateinput(json_data,data){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        let newdocument = new templateModel (data)
        var Value = await newdocument.save()
        return [true,Value]
    } catch (error) {
        console.log(error)
        return [false,error]
    }

}

async function select_templateinput(json_data,template_id) {
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        var result_template = await templateModel.findOne( { 
            _id:template_id 
        } )
        if (result_template.length!==0){
            return [true,result_template]
        }else {
            console.log('not found template')
            return [false,'not found template']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}


module.exports = {
    select_templateinput,
    insert_templateinput
}