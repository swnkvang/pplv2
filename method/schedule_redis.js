require('../config/lib')
require('../config/global')

async function schedule_delete_redis() {
    try {
        const job = schedule.scheduleJob({hour: 02, minute: 00,second : 00}, async function(){
        // const job = schedule.scheduleJob('0 0 */1 * * *', async function(){
            var result_del = await sodium_ppl.get_data_to_delete_from_redis()
            console.log('result_del:',result_del)
        });

    } catch (error) {
        console.log(error.stack);
        return {
            result: 'ER',
            message: error.message,
            status_code:400
        }
    }
}

module.exports = {
    schedule_delete_redis
}