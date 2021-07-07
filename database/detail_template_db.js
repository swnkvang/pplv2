require("../config/lib")
const {querySql} = require("../config/maria_db")


async function select_detailtemplate(json_data,document_type,service,type_cloud) {
    try {
      const dbconfig = json_data.db_connect
      var sql_text = {
        sql:`SELECT
            detail
          FROM
            tb_detail_template
          WHERE
          document_type = ? and (condition_detail = ? or condition_detail = ?);`,
        values:[document_type,service,type_cloud]
      }
      result_query = await querySql(dbconfig,sql_text)
      if (result_query.length!==0){
        var detail = result_query[0].detail
        detail = JSON.parse(detail);
        return [true,detail]
      }else{
        return [false,'data not found']
      }
    } catch (error) {
      console.log(error)
      return [false,error]
    }
}

async function insert_detailtemplate(json_data,data_detail) {
  try {
    const dbconfig = json_data.db_connect
    for (let i =0; i<data_detail.length;i++){ 
      var condition = data_detail[i].condition
      var document_type = data_detail[i].document_type
      var detail = data_detail[i].detail
      var str_detail = JSON.stringify(detail)
      var sql = {
        sql:`INSERT INTO tb_detail_template (condition_detail, detail, document_type) VALUES (?,?,?);`,
        values:[condition, str_detail, document_type]
      }
      result_insert = await querySql(dbconfig,sql)
    }
    return [true,str_detail]
  } catch (error) {
    console.log(error)
    return [false,error]
  }
}

module.exports = {
  select_detailtemplate,
  insert_detailtemplate
}