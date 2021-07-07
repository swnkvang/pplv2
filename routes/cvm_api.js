require('../config/lib')
require('../config/global')

const router = express.Router();
const { info } = require('winston');
const cvmData = require('../database/contact_details');
const middleware = require('../method/middleware');

router.use(middleware)

router.get("/v1/get_data_customer", async function (req, res) {
    try {
        let data = req.query
        const cvm_id = data.cvm_id
        var json_data = req.json_data
        const dbconfig = json_data.db_connect
        const type_api = 'paperless'
        result_select = await cvmData.select_data_form_cvm(cvm_id, dbconfig, type_api)
        if (result_select[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_select[1]
            })
        } else {
            throw ({
                message: result_select[1]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }

});

router.get("/v2/get_data_customer", async function (req, res) {
    try {
        let data = req.query
        const cvm_id = data.cvm_id
        var json_data = req.json_data
        const dbconfig = json_data.db_connect
        const type_api = 'paperless'
        result_select = await cvmData.select_data_form_cvm_v2(cvm_id, dbconfig, type_api)
        if (result_select[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_select[1]
            })
        } else {
            throw ({
                message: result_select[1]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});

router.get("/v1/get_cvmid_all", async function (req, res) {
    try {
        var json_data = req.json_data
        var data_query = req.query
        var sale_emp_id = data_query.sale_emp_id
        if (sale_emp_id === undefined || sale_emp_id === '') {
            result_select = await cvmData.select_cvmid_list(json_data)
            if (result_select[0]) {
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result_select[1]
                })
            } else {
                throw ({
                    message: result_select[1]
                })
            }
        } else {
            result_select = await cvmData.select_cvmid_list_from_empid(json_data, sale_emp_id)
            if (result_select[0]) {
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result_select[1]
                })
            } else {
                throw ({
                    message: result_select[1]
                })
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});

router.get("/cvm_data_all", async function (req, res) {
    try {
        url = 'https://inetcvm.one.th/new/api/v2/all_customer/version_2'
        // param = {
        //     page:"1",
        //     limit:"2000"
        // }
        var data_list = req.body.data
        var json_data = req.json_data.db_connect
        var connectiondb = json_data.db_connect
        let detail = []
        let contact_list = []
        // const list_key = Object.keys(data_cvm)
        let list_keynew = []
        // const key_del = ['transaction_id','createAt','updateAt']
        // const result_column = await cvmData.select_cloumname(connectiondb,'tb_contact_details',key_del)
        const condition_update_from_cvmid = 'contact_no'
        // const result_update = await cvmData.update_data_cvm(connectiondb,data_cvm,condition_update_from_cvmid)
        // res.send('OK')
        // "total_page": 38
        for (var y = 0; y < 38; y++){
            page = y+1
            param = {
                page:page,
                limit:"2000"
            }
            console.log(param)
            const result_cvm = await Call.GetAPI_v2(url,param)
            console.log(result_cvm[0])
            const data_cvm = result_cvm[1].data
            // const type_data = "data_contact"
            for (var i = 0; i < data_cvm.length; i++) {
                detail_cvm = data_cvm[i]
                contact = detail_cvm.contacts
                for (var j = 0; j < contact.length; j++) {
                    detail_contact = contact[j]
                    var info = {
                        customers_id:detail_cvm.customers_id,
                        tax_id: detail_cvm.tax_id,
                        description_none_tax_id: detail_cvm.description_none_tax_id,
                        customer_name_th:detail_cvm.customer_name_th,
                        customer_name_en: detail_cvm.customer_name_en,
                        erp_code: detail_cvm.erp_code,
                        main_office: detail_cvm.main_office,
                        sub_name_office: detail_cvm.sub_name_office,
                        type_of_customer: detail_cvm.type_of_customer,
                        type_of_business: detail_cvm.type_of_business,
                        number_address: detail_cvm.number_address,
                        village_no_address: detail_cvm.village_no_address,
                        village_name_address: detail_cvm.village_name_address,
                        lane_or_alley_address: detail_cvm.lane_or_alley_address,
                        road_address: detail_cvm.road_address,
                        province_address: detail_cvm.province_address,
                        district_address: detail_cvm.district_address,
                        sub_district_address: detail_cvm.sub_district_address,
                        postal_code_address: detail_cvm.postal_code_address,
                        name_finance_staff: detail_cvm.name_finance_staff,
                        email_finance_staff: detail_cvm.email_finance_staff,
                        phone_number_finance_staff: detail_cvm.phone_number_finance_staff,
                        number_finance: detail_cvm.number_finance,
                        village_no_finance: detail_cvm.village_no_finance,
                        village_name_finance: detail_cvm.village_name_finance,
                        lane_or_alley_finance: detail_cvm.lane_or_alley_finance,
                        road_finance: detail_cvm.road_finance,
                        province_finance: detail_cvm.province_finance,
                        district_finance: detail_cvm.district_finance,
                        sub_district_finance: detail_cvm.sub_district_finance,
                        postal_code_finance: detail_cvm.postal_code_finance,
                        name_customer_no1: detail_cvm.name_customer_no1,
                        position_customer_no1: detail_cvm.position_customer_no1,
                        phone_number_customer_no1: detail_cvm.phone_number_customer_no1,
                        email_customer_no1: detail_cvm.email_customer_no1,
                        name_customer_no2: detail_cvm.name_customer_no2,
                        position_customer_no2: detail_cvm.position_customer_no2,
                        phone_number_customer_no2: detail_cvm.phone_number_customer_no2,
                        email_customer_no2: detail_cvm.email_customer_no2,
                        address_customer: detail_cvm.address_customer,
                        address_finance: detail_cvm.address_finance,
                        contact_id: detail_contact.contact_id,
                        contact_no: detail_contact.contact_no,
                        service_owner: detail_contact.service_owner,
                        service_name: detail_contact.service_name,
                        status_customers: detail_contact.status_customers,
                        contact_name: detail_contact.contact_name,
                        contact_phone: detail_contact.contact_phone,
                        contact_email:detail_contact. contact_email,
                        contact_position:detail_contact.contact_position ,
                        contact_name_2: detail_contact.contact_name_2,
                        contact_phone_2:detail_contact. contact_phone_2,
                        contact_email_2:detail_contact. contact_email_2,
                        contact_position_2:detail_contact.contact_position_2,
                        sale_emp_id: detail_contact.sale_emp_id,
                        sale_name: detail_contact.sale_name,
                        team_sale: detail_contact.team_sale,
                        presale_emp_id: detail_contact.presale_emp_id,
                        presale_name: detail_contact.presale_name,
                        team_presale: detail_contact.team_presale,
                        so_types:detail_contact.so_types,
                        events:detail_contact.events,
                        contact_created_date: detail_contact.contact_created_date,
                        contact_created_time:detail_contact.contact_created_time,
                        contact_updated_date: detail_contact.contact_updated_date,
                        contact_updated_time: detail_contact.contact_updated_time,
                        project_name:detail_contact.project_name ,
                        customer_created_date: detail_cvm.customer_created_date,
                        customer_created_time: detail_cvm.customer_created_time,
                        customer_updated_date: detail_cvm.customer_updated_date,
                        customer_updated_time: detail_cvm.customer_updated_time,
                        customer_prefixs_id: detail_cvm.customer_prefixs_id,
                        prefix_name_th: detail_cvm.prefix_name_th,
                        prefix_name_en: detail_cvm.prefix_name_en,
                        position_finance: detail_cvm.position_finance,
                        customer_full_name_th:detail_cvm.customer_full_name_th,
                        customer_full_name_en:detail_cvm.customer_full_name_en,
                        foreigner_address:detail_cvm.foreigner_address,
                        foreigner_city:detail_cvm.foreigner_city,
                        foreigner_state:detail_cvm.foreigner_state,
                        foreigner_country: detail_cvm.foreigner_country,
                        foreigner_zipcode: detail_cvm.foreigner_zipcode,
                        finance_foreigner_address: detail_cvm.finance_foreigner_address,
                        finance_foreigner_city: detail_cvm.finance_foreigner_city,
                        finance_foreigner_state: detail_cvm.finance_foreigner_state,
                        finance_foreigner_country: detail_cvm.finance_foreigner_country,
                        finance_foreigner_zipcode: detail_cvm.finance_foreigner_zipcode,
                        foreigner_address_customer:detail_cvm.foreigner_address_customer,
                        foreigner_address_finance: detail_cvm.foreigner_address_finance
                    }
                    const result_update = await cvmData.update_data_cvm(json_data,info,condition_update_from_cvmid)
                    detail.push(info)
                }
            }
            console.log("success")
        }
        return res.status(200).json({
            status: true,
            message: "Success",
            data: null
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
})

module.exports = router