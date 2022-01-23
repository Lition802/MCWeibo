const { cookie } = require('express/lib/response');
const fs = require('fs');
var cookies = JSON.parse(fs.readFileSync("Data/cookies.json"));
var sd = require('silly-datetime');
exports.getCookie= function(xuid){
    if(cookie[xuid]==undefined)return undefined;
    return cookies[xuid].user_id;
}
exports.setCookie= function(xuid,user_id,if_admin){
    cookies[xuid]={user_id,if_admin};
    save();
}

exports.cookieExist=function(id){
    for(var i in cookies){
        if(cookies[i].user_id==id)
        return true;
    }
    return false;
}


exports.getUser=function(cookie){
    for(var i in cookies){
        if(cookies[i].user_id==cookie)
        return i;
    }
}

exports.removeCookie = (id)=>{
    delete cookies[this.getUser(id)]
    save();
}
function save(){
    fs.writeFileSync('Data/cookies.json',JSON.stringify(cookies,null,"\t"));
}