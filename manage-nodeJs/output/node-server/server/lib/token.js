const axios = require('')
const getTokenApi = 'https://i.flyme.cn/uc/webservice/getTokenByTicket?ticket='
const refTokenApi = 'https://i.flyme.cn/uc/webservice/refreshTokenByTicket?ticket='
const delTokenApi = 'https://i.flyme.cn/uc/webservice/destroyTokenByTicket?ticket='
const getToken = (uticket) => {
    return new Promise((res, rej) => {
        res(axios.get(getTokenApi + uticket))
    })
}

const refToken = uticket => {
    return new Promise((res, rej) => {
        res(axios.get(refTokenApi + uticket))
    })
}

const delToken = uticket => {
    return new Promise((res, rej) => {
        res(axios.get(delTokenApi + uticket))
    })
}

exports.getToken = getToken
exports.refToken = refToken
exports.delToken = delToken
