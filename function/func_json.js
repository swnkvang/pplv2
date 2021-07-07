require('../config/lib')
require('../config/global')

async function delete_key_from_list(data_list){
    try {
        let list_data = data_list.map(data => {
            delete data.style
            if (typeof data.value === "object"){
                delete_key_from_list(data.value)
            }
            return data
        })
        return {result: 'OK', messageText: list_data}
    } catch (error) {
        console.log(error)
        return { result: 'ER', messageER: error }
    }
}

async function delete_key_from_list_v2(data, keys) {
    try {
        for(let i in data) {
            if(keys.includes(i)){
                delete data[i]
            } else if(typeof data[i] === 'object') 
                {delete_key_from_list_v2(data[i], keys)}
        }
        return {result: 'OK', messageText: data}
    } catch (error) {
        console.log(error)
        return { result: 'ER', messageER: error }
    }
    
}

const ReplaceSymbol = async (mystring) => {
    try {
        var mystring = String(mystring).replace(/[<>:"/\|?*\'\t√–∫∫§«“¡‡ ’Ë¬ßÕß§Ï°√]/g, "_")
        return [true, mystring]
    } catch (error) {
        console.log(error)
        return [false]
    }
};

module.exports = {
    delete_key_from_list,
    delete_key_from_list_v2,
    ReplaceSymbol
}