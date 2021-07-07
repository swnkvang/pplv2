require('../config/lib')
require('../config/global')
// require('../config/mongo_db')

// const Update_db = require('../db/update.db');
// const Select_db = require('../db/select.db');

// const {
//     connonsql
// } = require('../config/mongo_db')

async function get_random_string(length) {
    try {
        random_list = []
        arr_str = []
        arr_digit = []
        // valueRandom_Str = randomstring.generate();
        valueRandom_Str = randomstring.generate({
            charset: 'ABCDEFGHJKLMNPQRSTUVWXYZ'
        });
        arr_tracking = []
        // console.log('valueRandom_Str:',valueRandom_Str)
        for (i=0;i<valueRandom_Str.length;i++){
            arr_str.push(valueRandom_Str[i].toUpperCase())
        }
        for (j=0;j<valueRandom_Str.length;j++){
            arr_digit.push(randomInt(1,9))
        }
        // console.log('arr_str',arr_str)
        // console.log('arr_digit',arr_digit)
        for (i=0;i<length;i++){
            r = randomInt(1,2)
            // console.log('arr_tracking:',arr_tracking)
            valueRandom_tracking = null
            // console.log(i)
            if (i==0) {
                valueRandom_tracking = randomChoice(arr_str, arr_digit);
            }
            else if (r==1) {
                valueRandom_tracking = randomChoice(arr_str, arr_digit);
            }
            else if (r==2) {
                valueRandom_tracking = randomChoice(arr_digit, arr_digit);
            }
            // console.log('valueRandom_tracking:',valueRandom_tracking)
            arr_tracking.push(valueRandom_tracking)
        }
        
        // return [arr_tracking,200]
        return [200,arr_tracking]
    } catch (err) {
        // [err,400]
        return [400,err]
    }
}

async function random_string_digit_generator() {
    random_list = []
    valueRandom_Str = randomstring.generate({
        charset: 'ABCDEFGHJKLMNPQRSTUVWXYZ'
    });
    arr_str = []
    arr_digit = []
    try {
        for (i=0;i<valueRandom_Str.length;i++){
            arr_str.push(valueRandom_Str[i].toUpperCase())
        }
        for (i=0;i<valueRandom_Str.length;i++){
            arr_digit.push(randomInt(1,9))
        }
        for(i=0;i<6;i++){
            valueRandom_tracking = randomChoice(arr_str, arr_digit);
            random_list.push(valueRandom_tracking)
        }
        for(i=0;i<3;i++){
            valueRandom_tracking = randomChoice(arr_digit, arr_digit);
            random_list.push(valueRandom_tracking)
        }
        // return [random_list,200]
        return [200,random_list]
    } catch (err) {
        // [err,400]
        return [400,err]
    }
   
}

async function gen_digit_tracking(tracking) {   
    list_char = []
    list_char_new = []
    num_count = 13
    sum_digit = 0
    try {
        for (i=0 ; i < tracking.length ; i++){
            char = tracking[i]
            // check_int = Number.isInteger(char)
            check_int = isNaN(char)
            // console.log('check_int:',check_int)
            if (check_int == true){
                // char = Number(ord(char))
                char = Number(char.charCodeAt(0))
            }
            else if (check_int == false){
                char = Number(char)
            }
            list_char.push(char)
            char = char*num_count
            num_count = num_count-1
            list_char_new.push(char)
        }
        // console.log('list_char_new:',list_char_new)
        for (j=0 ; j < list_char_new.length;j++){
            sum_digit = sum_digit+list_char_new[j]
        }
        sum_digit = (sum_digit % 11)
        sum_digit = Math.abs(11 - sum_digit)
        str_sum_digit = String(sum_digit)
        // last_digit = str_sum_digit[-1]
        last_digit = str_sum_digit.slice(-1);
        tracking_new = tracking+last_digit
        
        // return {'result':'OK','status_Code':200,'messageText':String(tracking_new)}
        // return [tracking_new,200]
        return [200,tracking_new]
    }
    catch (error) {
        // [error,400]
        return [400,err]
    }
    
}

async function gen_tracking() {
    try{
        // random_digit = 3
        random_digit = randomInt(1,3);
        // random_digit = 2
        if (random_digit == 1) {
            result_gen = await get_random_string(9)
            if (result_gen[0] == 200) {
                tracking = result_gen[1]
            }
        } else if (random_digit == 2) {
            result_gen = await random_string_digit_generator()
            if (result_gen[0] == 200) {
                tracking = result_gen[1]
            }
        } else if (random_digit == 3) {
            result_gen = await random_string_digit_generator()
            if (result_gen[0] == 200) {
                tracking = result_gen[1]
            }
        }
        
        tracking = (await get_random_string(3))[1] + ',' + tracking.toString()
        // console.log('tracking:',tracking)
        tracking = tracking.replace(/,/g, '')
        resgen_track = await gen_digit_tracking(tracking)
        return resgen_track
    }
    catch(err){
        console.log(err)
        return err
    }
}

async function check_tracking(tracking) {
    try{
        // console.log('tracking:',tracking)
        var lastChar = tracking.substr(tracking.length - 1)
        var firstChar = tracking.slice(0, -1)
        // console.log('firstChar:',firstChar)
        result_gen = await gen_digit_tracking(firstChar)
        // console.log('result_gen:',result_gen)
        if (result_gen[1] == tracking){
            return true
        }
        else {
            return false
        }
        
    }
    catch(err){
        console.log(err)
    }
}


module.exports = {
    gen_tracking,
    gen_digit_tracking,
    random_string_digit_generator,
    get_random_string,
    check_tracking
}