const axios = require('axios')


function postdata(data){
    axios
    .post('http://127.0.0.1:5888/sendGroupMessage', data)
    .then(res => {
      console.log(`状态码: ${res.statusCode}`)
    })
    .catch(error => {
      console.error(error)
    })
}
module.exports={
    postdata
}