require('../config/lib')
require('../config/global')

async function replace_characters(cha_str){
    try {
        var new_string = cha_str.replace(/[&\/\\#,+()$~%'":*?<>{}|]/g,'_');
        var new_string = new_string.replace('   ','_');
        return [true,new_string]
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    replace_characters
}