require('../config/global')
const {querySql} = require("../config/maria_db")

async function insert_tb_document_log(json_data,data_insert) {
    try {
        const dbconfig = json_data.db_connect
        let sqlinsertdoc = {
          sql:`INSERT INTO tb_document_log (id_transaction, actor, action, detail, index_actor, status) VALUES (?,?,?,?,?,?)`,
          values: [data_insert.id_transaction, data_insert.actor, data_insert.action, data_insert.detail, data_insert.index_actor, data_insert.status]
        }
        result_insert = await querySql(dbconfig,sqlinsertdoc)
        return [true,'success']
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}

async function select_tb_document_log(json_data,transaction_id) {
    try {
        const dbconfig = json_data.db_connect
        let sqlquery = {
          sql:'SELECT * FROM \
          ( SELECT tb_document_log.id_transaction, \
                      tb_document_log.actor, \
                      tb_document_log.action, \
                      tb_document_log.detail, \
                      tb_document_log.updateAt, \
                      tb_document_log.status \
            FROM tb_document_log \
          ) t1 INNER JOIN \
             ( SELECT tb_account.account_id, \
                tb_account.first_name_th, \
                tb_account.last_name_th, \
                tb_account.first_name_eng, \
                tb_account.last_name_eng, \
                tb_account.account_title_th, \
                tb_account.account_title_eng, \
                tb_account.thai_email, \
                tb_account.thai_email2, \
                tb_account.thai_email3, \
                tb_account.employee_email, \
                tb_account.employee_id, \
                tb_account. mobile_no, \
                Json_Array(tb_org_personal.role_name) AS role_name, \
                Json_Array(tb_org_personal.role_id) AS role_id, \
                Json_Array(tb_org_personal.dept_name) AS dept_name, \
                Json_Array(tb_org_personal.dept_id) AS dept_id\
              FROM tb_account \
              INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
              GROUP BY account_id \
            ) t2 \
               ON t1.actor = t2.account_id\
               WHERE t1.id_transaction = "'+transaction_id+'" \
              ORDER BY t1.updateAt DESC '
        }
        var res_query = await querySql(dbconfig,sqlquery)
        for (let i=0;i<res_query.length;i++) {
          res_query[i].role_id = JSON.parse(res_query[i].role_id )
          res_query[i].role_name = JSON.parse(res_query[i].role_name )
          res_query[i].dept_name = JSON.parse(res_query[i].dept_name )
          res_query[i].dept_id = JSON.parse(res_query[i].dept_id )
        }
        return [true,res_query]   
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}

async function select_tb_document_log_list(connectiondb,list_transaction) {
  try {
      // const dbconfig = json_data.db_connect
      const sqlquery = {
        sql:`SELECT * FROM 
        ( SELECT tb_document_log.id_transaction, 
                    tb_document_log.actor, 
                    tb_document_log.action, 
                    tb_document_log.detail, 
                    tb_document_log.updateAt, 
                    tb_document_log.status,
                    tb_document_log.index_actor
          FROM tb_document_log 
        ) t1 INNER JOIN 
           ( SELECT tb_account.account_id, 
              tb_account.first_name_th, 
              tb_account.last_name_th, 
              tb_account.first_name_eng, 
              tb_account.last_name_eng, 
              tb_account.account_title_th, 
              tb_account.account_title_eng, 
              tb_account.thai_email, 
              tb_account.thai_email2, 
              tb_account.thai_email3, 
              tb_account.employee_email, 
              tb_account.employee_id, 
              tb_account. mobile_no, 
              Json_Array(tb_org_personal.role_name) AS role_name, 
              Json_Array(tb_org_personal.role_id) AS role_id, 
              Json_Array(tb_org_personal.dept_name) AS dept_name, 
              Json_Array(tb_org_personal.dept_id) AS dept_id
            FROM tb_account 
            INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id 
            GROUP BY account_id 
          ) t2 
             ON t1.actor = t2.account_id
             WHERE t1.id_transaction in (?)
            ORDER BY t1.updateAt asc `,
        values:[list_transaction]
      }
      // let sqlquery = {
      //   sql:'SELECT * FROM \
      //   ( SELECT tb_document_log.id_transaction, \
      //               tb_document_log.actor, \
      //               tb_document_log.action, \
      //               tb_document_log.detail, \
      //               tb_document_log.updateAt, \
      //               tb_document_log.status \
      //     FROM tb_document_log \
      //   ) t1 INNER JOIN \
      //      ( SELECT tb_account.account_id, \
      //         tb_account.first_name_th, \
      //         tb_account.last_name_th, \
      //         tb_account.first_name_eng, \
      //         tb_account.last_name_eng, \
      //         tb_account.account_title_th, \
      //         tb_account.account_title_eng, \
      //         tb_account.thai_email, \
      //         tb_account.thai_email2, \
      //         tb_account.thai_email3, \
      //         tb_account.employee_email, \
      //         tb_account.employee_id, \
      //         tb_account. mobile_no, \
      //         Json_Array(tb_org_personal.role_name) AS role_name, \
      //         Json_Array(tb_org_personal.role_id) AS role_id, \
      //         Json_Array(tb_org_personal.dept_name) AS dept_name, \
      //         Json_Array(tb_org_personal.dept_id) AS dept_id\
      //       FROM tb_account \
      //       INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
      //       GROUP BY account_id \
      //     ) t2 \
      //        ON t1.actor = t2.account_id\
      //        WHERE t1.id_transaction = "'+transaction_id+'" \
      //       ORDER BY t1.updateAt DESC '
      // }
      var res_query = await querySql(connectiondb,sqlquery)
      for (let i=0;i<res_query.length;i++) {
        res_query[i].role_id = JSON.parse(res_query[i].role_id )
        res_query[i].role_name = JSON.parse(res_query[i].role_name )
        res_query[i].dept_name = JSON.parse(res_query[i].dept_name )
        res_query[i].dept_id = JSON.parse(res_query[i].dept_id )
      }
      return [true,res_query]   
  } 
  catch (err) {
    console.log(err)
    return [false,err]
  } 
}

module.exports = {
    insert_tb_document_log,
    select_tb_document_log,
    select_tb_document_log_list
  }