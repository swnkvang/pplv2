require("../config/lib")
// require("../configs/maria_db")
const {querySql} = require("../config/maria_db")


async function insert_servicedetail(json_data,service_detail) {
  try {
      const dbconfig = json_data.db_connect
      for (let i =0; i<service_detail.length;i++){ 
        var service_name = service_detail[i].service_name
        var unit_type = service_detail[i].unit_type
        var group_service = service_detail[i].group_service
        var item_code = service_detail[i].item_code
        var cost_unit = Number(service_detail[i].cost_unit)
        var internal = Number(service_detail[i].internal)
        var external_jv= Number(service_detail[i].external_jv)
        var external_cost = Number(service_detail[i].external)
        var cs_type = service_detail[i].cs_type
        var title = service_detail[i].title
        if (service_name===""){
          break
        }
        var sql = {
          sql:`INSERT INTO tb_service_detail (service_name, unit_type, group_service, item_code, cost_unit, internal, external_jv, external, cs_type,title) VALUES (?,?,?,?,?,?,?,?,?,?);`,
          values:[service_name, unit_type, group_service, item_code, cost_unit, internal, external_jv, external_cost, cs_type,title]
        }
        result_insert = await querySql(dbconfig,sql)
      }
      return [true,'success']
  } 
  catch (err) {
    console.log(err)
    return [false,err]
  } 
}

async function insert_muti_service(dbconfig,service_detail){
  try {
    let service_list = []
    for (let i =0; i<service_detail.length;i++){ 
      service_list.push(Object.values(service_detail[i]))
    }
    var sql = {
      sql:`INSERT INTO tb_service_detail (service_name, unit_type, group_service, item_code, cost_unit, internal, external_jv, external, cs_type,title) VALUES ?;`,
      values:[service_list]
    }
    result_insert = await querySql(dbconfig,sql)
    if (result_insert!==undefined){
      return [true,'success']
    }else{
      var tmperror = {
        msg_thai : 'ไม่สารถเพิ่มข้อมูลserviceได้',
        msg_eng : 'Can not add data service.'
      }
      return [false,null,tmperror]
    }
  } 
  catch (err) {
    console.log(err)
    return [false,null,err]
  }
}

async function select_servicedetail(json_data,data_query) {
  try {
    var cs_type = data_query.cs_type
    var group_service = data_query.group_service
    var type_cloud = data_query.type_cloud
    var keyword_cloud = '%'+type_cloud+'%'
    const dbconfig = json_data.db_connect
    var sql_text = {
      sql:`SELECT
            service_name,unit_type, group_service,item_code,cost_unit,internal,external_jv, external,allocate
        FROM
            tb_service_detail
        WHERE
            cs_type = ? and group_service = ?`,
      values:[cs_type, group_service, keyword_cloud]
    }
    result_query = await querySql(dbconfig,sql_text)
    if (result_query.length!==0){
      for (i = 0; i < result_query.length; i++) {
        if (result_query[i].allocate===1){
          result_query[i].allocate = true
        }else{
          result_query[i].allocate = false
        }
    }
      return [true,result_query]
    }else{
      return [false,'data not found']
    }
  } catch (error) {
    console.log(error)
    return [false,error]
  }
}

async function delete_service(dbconfig,cs_type){
  try {
    if (cs_type!=='All'){
      var sql_text = {
        sql:`DELETE FROM tb_service_detail WHERE cs_type = ?;`,
        values:[cs_type]
      }
    }else{
      var sql_text = {
        sql:`DELETE FROM tb_service_detail;`,
        values:[]
      }
    }
    result_query = await querySql(dbconfig,sql_text)
    if (result_query!== undefined){
      return [true,'success']
    }else{
      return [false,'Can does not delete']
    }
  } catch (error) {
    console.log(error)
    return [false,error]
  }
}

module.exports = {
  insert_servicedetail,
  select_servicedetail,
  insert_muti_service,
  delete_service
}