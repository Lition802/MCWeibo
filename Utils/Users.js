const fs = require('fs');

var users = JSON.parse(fs.readFileSync("users.json"));

exports.add = function(xuid,name,pwd){
    if(users[xuid] != undefined) return false;
    users[xuid] = {name,pwd,level:0,xp:0};
    save();
    return true;
}

exports.exsits = function(xuid){
    return users[xuid] != undefined;
}

exports.pwd_right = function(xuid,pwd){
    return users[xuid].pwd == pwd;
}

exports.addxp =function (xuid,xp){
    users[xuid].xp+=xp;
    save();
    return users[xuid].xp;
}

exports.addlevel = function(xuid,l){
    users[xuid].level +=l;
    save();
    return users[xuid].level;
}

exports.getLevel = function(xuid){
    if(users[xuid] == undefined) return 0;
    return users[xuid].level;
}
exports.getxp = function(xuid){
    return users[xuid].xp;
}

exports.getXUID = function(name){
    for(var i in users){
        if(users[i].name == name){
            return i;
        }
    }
}

exports.nameTolevel = function(n){
    return   this.getLevel(this.getXUID(n));
}

function save(){
    fs.writeFileSync('./users.json',JSON.stringify(users,null,"\t"));
}