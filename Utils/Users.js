const fs = require('fs');

var users = JSON.parse(fs.readFileSync("users.json"));

exports.add = function(xuid,name,pwd){
    if(users[xuid] != undefined) return false;
    users[xuid] = {name,pwd};
    fs.writeFileSync('./users.json',JSON.stringify(users,null,"\t"));
    return true;
}

exports.exsits = function(xuid){
    return users[xuid] != undefined;
}

exports.pwd_right = function(xuid,pwd){
    return users[xuid].pwd == pwd;
}