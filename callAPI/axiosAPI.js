require('../config/lib')

global.Call = {
    PostAPI: async (url, info) => {
        let res = axios.post(url, info)
            .then(function (response) {
                return [200, response]
            })
            .catch(function (error) {
                console.log(error)
                return [400, error]
            });
        return res
    },
    GetAPI: async (url, access) => {
        let res = axios.get(url, {
                'headers': {
                    'Authorization': access
                }
            })
            .then(function (response) {
                return [200, response]
            })
            .catch(function (error) {
                console.log(error)
                return [400, error]
            });
        return res
    },
    GetAPI_v2: async (url,param) => {
        let res = axios.get(url,
            {
                headers: {
                    'Client-ID': "4",
                    'Client-Secret':"$2a$14$ih7ob7r69MXkdqPcbqYYturKc6d22HMVbInKuBY7Q1UIePHv9ZT/W" 
                },
                params: param
            })
            .then(function (response) {
                return [200, response.data]
            })
            .catch(function (error) {
                console.log(error)
                return [400, error]
            });
        return res
    },
    GetAPI_PARAM_TOKEN: async (url, param, access) => {
        let res = axios.get(url,
            {
                headers: {
                    'Authorization': access
                },
                params: param
            })
            .then(function (response) {
                return [200, response]
            })
            .catch(function (error) {
                console.log(error)
                return [400, error]
            });
        return res
    },
    callPost_v2: async (url, header, body) => {
        // console.log('headers:',header)
        axios.interceptors.request.use(x => {
            x.meta = x.meta || {}
            x.meta.requestStartedAt = new Date().getTime();
            return x;
        })
        axios.interceptors.response.use(x => {
            x.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
            return x;
        })
        var start = new Date();
        let res = axios.post(url=url , json=body , {
            'headers': {
                'Authorization': header
            },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        })
            .then(function (response) {
                time_duration = new Date() - start
                if(response.status == 200 || response.status == 201){
                    // insertDB.insert_transactionlog((response.data),'OK',(body),url,header,time_duration)
                    // console.log('response001',response.data)
                    return {
                        result: 'OK',
                        msg: response.data,
                        time_duration:String(response.responseTime),
                        status_code: response.status
                    }
                }else{
                    // console.log('response',response.data)
                    // insertDB.insert_transactionlog((response.data),'ER',(body),url,header,time_duration)
                    return {
                        result: 'ER',
                        msg: response.data,
                        time_duration:String(response.responseTime),
                        status_code: response.status
                    }
                }
            })
            .catch(function (error) {
                // console.log(error)
                time_duration = new Date() - start
                // insertDB.insert_transactionlog((error.response),'ER',(body),url,header,time_duration)
                return {
                    result: 'ER',
                    msg: error.response,
                    time_duration:time_duration,
                    error: error
                    // status_code:error.response.status
                }
            });
        return res
    },
    callPost_formdata: async (url, bodyFormData) => {
        var start = new Date();
        axios.interceptors.request.use(x => {
            x.meta = x.meta || {}
            x.meta.requestStartedAt = new Date().getTime();
            return x;
        })
        axios.interceptors.response.use(x => {
            x.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
            return x;
        })
        let res = axios.post(url=url , bodyFormData , { headers:bodyFormData.getHeaders()})
            .then(function (response) {
                console.log(response.responseTime)
                // time_duration = new Date() - start
                if(response.status == 200 || response.status == 201){
                    // console.log(response)
                    // insertDB.insert_transactionlog((response.data),'OK',(body),url,header,time_duration)
                    return {
                        result: 'OK',
                        msg: response.data,
                        time_duration:String(response.responseTime),
                        status_code: response.status
                    }
                    // return [true,response.data]
                }else{
                    // insertDB.insert_transactionlog((response.data),'ER',(body),url,header,time_duration)
                    return {
                        result: 'ER',
                        msg: response.data,
                        time_duration:String(response.responseTime),
                        status_code: response.status
                    }
                    // return [false,response.data]
                }
            })
            .catch(function (error) {
                console.log(error)
                time_duration = new Date() - start
                return {
                    result: 'ER',
                    msg: error.response,
                    time_duration:time_duration,
                    error: error
                    // status_code:error.response.status
                }
                // insertDB.insert_transactionlog((error.response),'ER',(body),url,header,time_duration)
                // return [false,error]
            });
        return res
    },
    callPost_onebox: async (url, header, body) => {
        // console.log('headers:',header)
        axios.interceptors.request.use(x => {
            x.meta = x.meta || {}
            x.meta.requestStartedAt = new Date().getTime();
            return x;
        })
        axios.interceptors.response.use(x => {
            x.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
            return x;
        })
        var start = new Date();
        let res = axios.post(url=url , json=body , {
            'headers': {
                'Authorization': header
            },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        })
            .then(function (response) {
                time_duration = new Date() - start
                if(response.status == 200 || response.status == 201){
                    // insertDB.insert_transactionlog((response.data),'OK',(body),url,header,time_duration)
                    // console.log('response001',response.data)
                    return {
                        result: 'OK',
                        msg: response.data,
                        time_duration:String(response.responseTime),
                        status_code: response.status
                    }
                }else{
                    // console.log('response',response.data)
                    // insertDB.insert_transactionlog((response.data),'ER',(body),url,header,time_duration)
                    return {
                        result: 'ER',
                        msg: response.data,
                        time_duration:String(response.responseTime),
                        status_code: response.status
                    }
                }
            })
            .catch(function (error) {
                // console.log(error)
                time_duration = new Date() - start
                // insertDB.insert_transactionlog((error.response),'ER',(body),url,header,time_duration)
                return {
                    result: 'ER',
                    msg: error.response,
                    time_duration:time_duration,
                    error: error
                    // status_code:error.response.status
                }
            });
        return res
    }
}