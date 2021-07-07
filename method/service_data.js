require('../config/lib')
require('../config/global')

const file_method = require('../function/func_savefile');
const servicedetail = require('../database/service_detail');
const func_datetime = require('../function/func_datetime')


async function add_servicedata(json_data,file_excel){
  try {
    const now = new Date
    const dtnow = await func_datetime.formatDate(now)
    const file_name_new = uuid()
    const somepath = '/storage/'+tax_id+'/excel_service' + '/' + dtnow+'/'
    const file_name = file_excel.originalname
    const dbconfig = json_data.db_connect
    var type_file = null
    file_name_split = file_name.split(".")
    len_file = file_name_split.length
    if (file_name_split.length == 2) {
        type_file = file_name_split[1]
    } else {
        var index_type = len_file - 1
        type_file = file_name_split[index_type]
    }
    var data = file_excel.buffer
    const save_file = await file_method.createFile(path_local,somepath,file_name_new,type_file,data)
    if (save_file[0]){
      var doc = parser.parseXls2Json(save_file[1]);
      let service_detail = doc[0]
      service_detail = service_detail.filter(service => service.service_name != '');
      for (let i =0; i<service_detail.length;i++){
        if (service_detail[i].service_name !=''){
          if (service_detail[i].cost_unit===''){
            service_detail[i].cost_unit = 0
          }
          if (service_detail[i].internal ===''){
              service_detail[i].internal = 0
          }
          if (service_detail[i].external_jv===''){
              service_detail[i].external_jv = 0
          }
          if (service_detail[i].external===''){
              service_detail[i].external = 0
          }
        }
      }
      var cs_type = null
      var Solution = service_detail.find(detail_service => detail_service.cs_type === 'Solution')
      var Standard = service_detail.find(detail_service => detail_service.cs_type === 'Standard')
      if (Solution!==undefined&&Standard!==undefined){
        cs_type = 'All' 
      }else if(Solution!==undefined&&Standard===undefined) {
        cs_type = 'Solution'
      }else if(Solution===undefined&&Standard!==undefined) {
        cs_type = 'Standard'
      }
      const result_delete = await servicedetail.delete_service(dbconfig,cs_type)
      if (result_delete[0]){
        const result_insert = await servicedetail.insert_muti_service(dbconfig,service_detail)
        if (result_insert[0]){
          return [true,'success']
        }else{
          return [false,result_insert[2]]
        }
      }else{
        return [false,result_delete[1]]
      }
    }else{
      return [false,save_file[1]]
    }
  } catch (error) {
    console.log(error)
    return [false,error]
  }
  
}

  module.exports = {
    add_servicedata
}