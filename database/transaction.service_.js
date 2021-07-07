require("../config/lib")
// require("../configs/maria_db")
const {
    querySql
} = require("../config/maria_db")
const {
    connonsql
} = require('../config/mongo_db')
const ProcessSaveSchema = require("../schema/process.sch")

const SaveLogServcie = async (dbconfig, OtherService, status, dataService, document_id, transaction_id) => {
    try {
        var sql = {
            sql: `INSERT INTO tb_transaction_service(other_service,status,result,document_id,transaction_id) VALUES (?,?,?,?,?)`,
            values: [OtherService, status, dataService, document_id, transaction_id]
        }
        await querySql(dbconfig, sql)
        return [true]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};


const SaveTransactionSyncData = async (dbconfig, name, status) => {
    try {
        var sql = {
            sql: `INSERT INTO tb_transaction_sync_data(name,status) VALUES (?,?);`,
            values: [name, status]
        }
        var ReturningData = await querySql(dbconfig, sql)
        console.log(ReturningData)
        return [true]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const SaveLogServcieWebhook = async (dbconfig, OtherService, status, dataService, document_id, transaction_id, request, response, url) => {
    try {
        var sql = {
            sql: `INSERT INTO tb_transaction_webhook(other_service,status,result,document_id,transaction_id,request,response,url) VALUES (?,?,?,?,?,?,?,?)`,
            values: [OtherService, status, dataService, document_id, transaction_id, request, response, url]
        }
        await querySql(dbconfig, sql)
        return [true]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const SaveLogProcess = async (dbconfig, data_citizen, summary_group_id, data) => {
    try {
        await connonsql(dbconfig)
        var info = {
            summary_group_id: summary_group_id,
            data: data,
            actor: data_citizen
        }
        var newProcess = new ProcessSaveSchema(info)
        var GetProcessData = await newProcess.save()
        return [true, GetProcessData]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
}

const UpdateLogProcess = async (dbconfig, process_id, transaction_id, message, status) => {
    try {
        await connonsql(dbconfig)
        await ProcessSaveSchema.findOneAndUpdate({
            $and: [{
                _id: process_id,
                data: {
                    $elemMatch: {
                        transaction: transaction_id
                    }
                }
            }]
        }, {
            "$set": {
                "data.$.status": status,
                "data.$.message": message,
            }
        })
        return [true]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
}

const UpdateLogProcessSuccess = async (dbconfig, process_id, status) => {
    try {
        await connonsql(dbconfig)
        await ProcessSaveSchema.findOneAndUpdate({
            $and: [{
                _id: process_id
            }]
        }, {
            status: status
        })
        return [true]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
}

module.exports = {
    SaveLogServcie,
    SaveLogProcess,
    UpdateLogProcess,
    UpdateLogProcessSuccess,
    SaveLogServcieWebhook,
    SaveTransactionSyncData
}