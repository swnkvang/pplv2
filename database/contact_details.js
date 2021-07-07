require("../config/lib")
const {querySql} = require("../config/maria_db")

async function select_data_form_cvm(cvm_id, json_data,type_api) {
    try {
        var sql_text = null
        if (type_api === 'paperless'){
            sql_text = {
                sql:`SELECT 
                        customer_full_name_th as "Cusname_thai",
                        customer_full_name_en as "Cusname_Eng",
                        type_of_business as "Business_type",
                        number_address as "HouseNo",
                        village_no_address as "VillageNo",
                        village_name_address as "Village",
                        lane_or_alley_address as "Alley",
                        road_address as "Road",
                        province_address as "Province",
                        district_address as "District",
                        sub_district_address as "Sub-district",
                        postal_code_address as "PostalCode",
                        sale_emp_id as "EmployeeID",
                        sale_name as "Sales_Name",
                        presale_emp_id as "ID_PreSale",
                        presale_name as "Name_PreSale",
                        name_finance_staff as "Financial_Name",
                        email_finance_staff as "Financial_E-mail",
                        phone_number_finance_staff as "Financial_Tel",
                        name_customer_no1 as "Technicain_Name",
                        position_customer_no1 as "Technicain_Position",
                        phone_number_customer_no1 as "Technicain_Tel",
                        email_customer_no1 as "Technicain_E-mail",
                        erp_code as "Customer_ID",
                        CASE 
                        WHEN address_customer = '' THEN foreigner_address 
                        else address_customer
                        END "Address",
                        service_owner as "Service1",
                        position_finance as Financial_Position,
                        contact_no as cvm_id,
                        phone_number_customer_no1 as CusTel,
                        email_customer_no1 as "Cus_E-mail"

                    FROM  tb_contact_details 
                    WHERE contact_no = ? and (contact_deleted_at is null or contact_deleted_at = '' )`,
                values:[cvm_id]
            }
        }else{
            sql_text = {
                sql:`SELECT 
                        customer_name_th as "Cusname_thai",
                        customer_name_en as "Cusname_Eng",
                        type_of_business as "Business_type",
                        number_address as "HouseNo",
                        village_no_address as "VillageNo",
                        village_name_address as "Village",
                        lane_or_alley_address as "Alley",
                        road_address as "Road",
                        province_address as "Province",
                        district_address as "District",
                        sub_district_address as "Sub-district",
                        postal_code_address as "PostalCode",
                        sale_emp_id as "EmployeeID",
                        sale_name as "Sales_Name",
                        presale_emp_id as "ID_PreSale",
                        presale_name as "Name_PreSale",
                        name_finance_staff as "Financial_Name",
                        email_finance_staff as "Financial_E-mail",
                        phone_number_finance_staff as "Financial_Tel",
                        name_customer_no1 as "Technicain_Name",
                        position_customer_no1 as "Technicain_Position",
                        phone_number_customer_no1 as "Technicain_Tel",
                        email_customer_no1 as "Technicain_E-mail",
                        erp_code as "Customer_ID",
                        address_customer as "Address",
                        service_owner as "Service1",
                        contact_no as cvm_id,
                        phone_number_customer_no1 as CusTel,
                        email_customer_no1 as "Cus_E-mail"
                    FROM  tb_contact_details 
                    WHERE (contact_no =? or customers_id = ?) `,
                values:[cvm_id,cvm_id]
            }
        }
        result_query = await querySql(json_data,sql_text)
        if (result_query.length !== 0) {
            if (result_query[0].Address==null){
                result_query[0].Address = ''
            }
            return [true,result_query[0]]
        }else {
            return [false,'data not found']
        }
    } 
    catch (err) {
        console.log(err)
        return [false,err]
    } 
}

async function select_data_form_cvm_v2(cvm_id, json_data) {
    try {
        var sql_text = null
        let cus_list = []
        let cusname_list = []
        sql_text = {
            sql:`SELECT 
                    customer_full_name_th as "Cusname_thai",
                    customer_full_name_en as "Cusname_Eng",
                    type_of_business as "Business_type",
                    number_address as "HouseNo",
                    village_no_address as "VillageNo",
                    village_name_address as "Village",
                    lane_or_alley_address as "Alley",
                    road_address as "Road",
                    province_address as "Province",
                    district_address as "District",
                    sub_district_address as "Sub-district",
                    postal_code_address as "PostalCode",
                    sale_emp_id as "EmployeeID",
                    sale_name as "Sales_Name",
                    presale_emp_id as "ID_PreSale",
                    presale_name as "Name_PreSale",
                    name_finance_staff as "Financial_Name",
                    email_finance_staff as "Financial_E-mail",
                    phone_number_finance_staff as "Financial_Tel",
                    name_customer_no1 as "Technicain_Name",
                    position_customer_no1 as "Technicain_Position",
                    phone_number_customer_no1 as "Technicain_Tel",
                    email_customer_no1 as "Technicain_E-mail",
                    erp_code as "Customer_ID",
                    CASE 
                    WHEN address_customer = '' THEN foreigner_address 
                    else address_customer
                    END "Address",
                    service_owner as "Service1",
                    position_finance as Financial_Position,
                    contact_no as cvm_id,
                    phone_number_customer_no1 as CusTel,
                    email_customer_no1 as "Cus_E-mail",
                    contact_phone,
                    name_customer_no2,
                    email_customer_no2,
                    phone_number_customer_no2
                FROM  tb_contact_details 
                WHERE contact_no = ? and (contact_deleted_at is null or contact_deleted_at = '' )`,
            values:[cvm_id]
        }
        result_query = await querySql(json_data,sql_text)
        if (result_query.length !== 0) {
            if (result_query[0].Address==null){
                result_query[0].Address = ''
            }
            var cus_no1 = {
                Technicain_Name:result_query[0].Technicain_Name,
                "Technicain_E-mail":result_query[0]["Technicain_E-mail"],
                Technicain_Tel:result_query[0].Technicain_Tel,
                contact_phone:result_query[0].contact_phone
            }
            var cus_no2 = {
                Technicain_Name:result_query[0].name_customer_no2,
                "Technicain_E-mail":result_query[0].email_customer_no2,
                Technicain_Tel:result_query[0].phone_number_customer_no2,
                contact_phone:result_query[0].contact_phone
            }
            cus_list.push(cus_no1)
            cus_list.push(cus_no2)
            cusname_list.push(result_query[0].Cusname_thai)
            cusname_list.push(result_query[0].Cusname_Eng)
            result_query[0].cus_detail = cus_list
            result_query[0].cusname = cusname_list
            return [true,result_query[0]]
        }else {
            return [false,'data not found']
        }
    } 
    catch (err) {
        console.log(err)
        return [false,err]
    } 
}

async function select_cvmid_list(json_data) {
    try {
        var cvm_list = []
        const dbconfig = json_data.db_connect
        var sql_text = {
            sql:`SELECT contact_no as cvm_id 
            FROM tb_contact_details
            WHERE contact_deleted_at is null or contact_deleted_at = ''`,
            values:[]
        }
        result_query = await querySql(dbconfig,sql_text)
        if (result_query.length !== 0) {
            for (i = 0; i < result_query.length; i++) {
                cvm_list.push(result_query[i].cvm_id)
            } 
            return [true,cvm_list]
        }else {
            return [false,'data not found']
        }
    } 
    catch (err) {
        console.log(err)
        return [false,err]
    } 
}

async function select_cvmid_list_from_empid(json_data,sale_emp_id) {
    try {
        var cvm_list = []
        const dbconfig = json_data.db_connect
        var sql_text = {
            sql:`SELECT contact_no as cvm_id
            FROM tb_contact_details
            WHERE sale_emp_id = ? and (contact_deleted_at is null or contact_deleted_at = '' )`,
            values:[sale_emp_id]
        }
        result_query = await querySql(dbconfig,sql_text)
        if (result_query.length !== 0) {
            for (i = 0; i < result_query.length; i++) {
                cvm_list.push(result_query[i].cvm_id)
            } 
            return [true,cvm_list]
        }else {
            return [false,'data not found']
        }
    } 
    catch (err) {
        console.log(err)
        return [false,err]
    } 
}

async function select_cloumname(json_data,tablename,key_del) {
    try {
        var cvm_list = []
        var info = {}
        var sql_text = {
            sql:`SELECT COLUMN_NAME as column_name
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ?`,
            values:[tablename]
        }
        result_query = await querySql(json_data,sql_text)
        if (result_query.length !== 0) {
            for (i = 0; i < result_query.length; i++) {
                // if (result_query[i].column_name!=key_del){
                //     cvm_list.push(result_query[i].column_name)
                // }
                if(!key_del.includes(result_query[i].column_name)){
                    cvm_list.push(result_query[i].column_name)
                }
            } 
            info = {
                columlist:cvm_list,
                len:cvm_list.length
            }
            return [true,info]
        }else {
            return [false,'data not found']
        }
    } 
    catch (err) {
        console.log(err)
        return [false,err]
    } 
}

async function insert_data_cvm(json_data,data){
    try {
        var listres = []
        var listkey = []
        for(var i in data){
            listres.push(data[i])
            listkey.push(i)
        }
        var field = listkey[0]
        var value = "?"
        for(var j = 1;j < listkey.length;j++){
            field += ","+listkey[j]
            value += ",?"
        }
        field_ = "("+field +")"
        value = "("+value +")"
        var sql = {
            sql:`INSERT INTO tb_contact_details`+ ` `+ field_+` `+ `VALUES`+` `+value+`;`,
            values:listres
        }
        result_insert = await querySql(json_data,sql)
        return [true,"success"]
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function update_data_cvm(json_data,data,condition_update){
    try {
        var listres = []
        var listkey = []
        for(var i in data){
            // if (data[i]!== ''){
            //     listres.push(data[i])
            //     listkey.push(i)
            // }
            listres.push(data[i])
            listkey.push(i)
        }
        var field = ""
        var condition_cvm = null
        if (condition_update==='contact_no'){
            condition_cvm = String(data.contact_no)
        }else{
            condition_cvm = String(data.customers_id)
        }
        for(var j = 1;j < listkey.length;j++){
            field += listkey[j]+" = ?"
            if(j != listkey.length - 1){
                field += ","
            }
        }
        var params = []
        for(var k = 1;k < listres.length;k++){
            params.push(listres[k])
            // if(k == listres.length - 1){
            //     params.push(listres[0])
            // }
        }
        params.push(condition_cvm)
        var sql = {
            sql:`UPDATE tb_contact_details SET `+field+` WHERE`+' '+condition_update+' '+  `= ?;`,
            values:params
        }
        result_update = await querySql(json_data,sql)
        return [true,'success']
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function alter_colum(json_data,data){
    try {
        if (data.length!==0){
            console.log(data,'data')
            var colum_new = 'ADD ' + data[0] + ' LONGTEXT '+ null
            for(var j = 1;j < data.length;j++){
                colum_new += ',ADD ' + data[j] + ' LONGTEXT '+ null
            }
            var sql = {
                sql:`ALTER TABLE tb_contact_details `+colum_new+` ;`,
                values:[]
            }
            result_update = await querySql(json_data,sql)
            return [true,"success"]
        }else{

        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    select_data_form_cvm,
    select_cvmid_list,
    select_cloumname,
    insert_data_cvm,
    update_data_cvm,
    alter_colum,
    select_cvmid_list_from_empid,
    select_data_form_cvm_v2
}