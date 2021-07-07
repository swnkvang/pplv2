require('../config/lib')
require('../config/global')

const find_data_logger = async (keyword,tax_id) => {
    try {
        // var list_data = []
        // id_log = null

        var list_ans = []
        var keyword = '0107544000094'
        // let path_folder = path_local + '/logger/' + '/' + tax_id + '/' + date_str + '/' + time_str + '/'
        var path_folder = 'C:/app/logger/0107544000094/2021-03-10/14.00-14.59/log_1.json'
        var result_readfile = await fs.readFileSync(path_folder, 'utf-8')
        // var list_data = JSON.parse(result_readfile)
        var list_data = JSON.parse('[' + result_readfile + ']')
        for (i=0 ; i<list_data.length ; i++){
            if (Object.values(list_data[i]).indexOf(keyword) > -1) {
                list_ans.push(list_data[i])
            }
        }
        return [true,list_ans]
    } 
    catch (error) {
        console.log(error)
        return [false,error]
    }
};

// ใส่ keyword ค้นหาได้
const find_data_logger_at_now = async (keyword,folder,tax_id,date_str,time_str) => {
    try {
        // var list_data = []
        // id_log = null
        if (folder == null || folder == ''){
            folder_log = tax_id
        }
        else{
            folder_log = folder
        }
        var list_ans = []
        // var keyword = '0107544000094'
        var path_folder = path_local + '/logger' + '/' + folder_log + '/' + date_str + '/' + time_str + '/'
        // console.log('path_folder:',path_folder)
        try{
            var file_in_fol = fs.readdirSync(path_folder)
        }
        catch (error) {
            console.log(error)
            return [false,'Not found folder']
        }
        // console.log('file_in_fol:',file_in_fol)
        // var path_folder = 'C:/app/logger/0107544000094/2021-03-10/14.00-14.59/log_1.json'
        // var result_readfile = await fs.readFileSync(path_folder, 'utf-8')
        // var list_data = JSON.parse('[' + result_readfile + ']')

        for (j=0 ; j<file_in_fol.length ; j++){
            let path_save = path_local + '/logger' + '/' + folder_log + '/' + date_str + '/' + time_str + '/' + file_in_fol[j]
            // console.log('path_save:',path_save)
            var result_readfile = await fs.readFileSync(path_save, 'utf-8')
            // var list_data = JSON.parse(result_readfile)
            var list_data = JSON.parse('[' + result_readfile + ']')
            for (i=0 ; i<list_data.length ; i++){
                if (Object.values(list_data[i]).indexOf(keyword) > -1) {
                // if (Object.values(list_data[i]).indexOf(String(list_data[i]).includes(keyword)) > -1) {
                    list_ans.push(list_data[i])
                    // console.log('list_ans:',list_ans)
                }
            }
        }        

        return [true,list_ans]
    } 
    catch (error) {
        console.log(error)
        return [false,error]
    }
};
//find แบบ like string
const find_data_logger_at_now_like = async (keyword,folder,tax_id,date_str,time_str) => { 
    try {
        // var list_data = []
        // id_log = null
        if (folder == null || folder == ''){
            folder_log = tax_id
        }
        else{
            folder_log = folder
        }
        var list_ans = []
        // var keyword = '0107544000094'
        var path_folder = path_local + '/logger' + '/' + folder_log + '/' + date_str + '/' + time_str + '/'
        // console.log('path_folder:',path_folder)
        try{
            var file_in_fol = fs.readdirSync(path_folder)
        }
        catch (error) {
            console.log(error)
            return [false,'Not found folder']
        }
        // console.log('file_in_fol:',file_in_fol)
        // var path_folder = 'C:/app/logger/0107544000094/2021-03-10/14.00-14.59/log_1.json'
        // var result_readfile = await fs.readFileSync(path_folder, 'utf-8')
        // var list_data = JSON.parse('[' + result_readfile + ']')

        for (j=0 ; j<file_in_fol.length ; j++){
            let path_save = path_local + '/logger' + '/' + folder_log + '/' + date_str + '/' + time_str + '/' + file_in_fol[j]
            // console.log('path_save:',path_save)
            var result_readfile = await fs.readFileSync(path_save, 'utf-8')
            var list_data = JSON.parse('[' + result_readfile + ']')
            // var list_data = JSON.parse(result_readfile)
            for (i=0 ; i<list_data.length ; i++){
                var find_str = JSON.stringify(list_data[i]).includes(keyword);
                if (find_str == true){
                    list_ans.push(list_data[i])
                }
            }
        }        

        return [true,list_ans]
    } 
    catch (error) {
        console.log(error)
        return [false,error]
    }
};

// ไม่มี keyword
const find_data_logger_all = async (tax_id,folder,date_str,time_str) => {
    try {
        // var list_data = []
        // id_log = null

        var list_ans = []
        // var keyword = '0107544000094'
        if (folder == null || folder == ''){
            folder_log = tax_id
        }
        else{
            folder_log = folder
        }
        var path_folder = path_local + '/logger' + '/' + folder_log + '/' + date_str + '/' + time_str + '/'
        // console.log('path_folder:',path_folder)
        try{
            var file_in_fol = fs.readdirSync(path_folder)
        }
        catch (error) {
            console.log(error)
            return [false,'Not found folder']
        }
        // console.log('file_in_fol:',file_in_fol)

        for (j=0 ; j<file_in_fol.length ; j++){
            let path_save = path_local + '/logger' + '/' + folder_log + '/' + date_str + '/' + time_str + '/' + file_in_fol[j]
            var result_readfile = await fs.readFileSync(path_save, 'utf-8')
            // var list_data = JSON.parse(result_readfile)
            var list_data = JSON.parse('[' + result_readfile + ']')
            for (i=0 ; i<list_data.length ; i++){
                list_ans.push(list_data[i])
                // console.log('list_ans:',list_ans)
            }
        }        

        return [true,list_ans]
    } 
    catch (error) {
        console.log(error)
        return [false,error]
    }
};


module.exports = {
    find_data_logger,
    find_data_logger_at_now,
    find_data_logger_all,
    find_data_logger_at_now_like
}