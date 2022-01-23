const fs = require('fs');

var users = JSON.parse(fs.readFileSync("Data/users.json"));

var bans = JSON.parse(fs.readFileSync("Data/ban.json"));

exports.add = function (xuid, name, pwd) {
    if (users[xuid] != undefined) return false;
    users[xuid] = { name, pwd, level: 0, xp: 0, admin: { is: false, key: null } };
    save();
    return true;
}

exports.exsits = function (xuid) {
    return users[xuid] != undefined;
}

exports.pwd_right = function (xuid, pwd) {
    if(users[xuid]==undefined)return false;
    return users[xuid].pwd == pwd;
}

exports.addxp = function (xuid, xp) {
    users[xuid].xp += xp;
    save();
    return users[xuid].xp;
}

exports.addlevel = function (xuid, l) {
    users[xuid].level += l;
    save();
    return users[xuid].level;
}

exports.getLevel = function (xuid) {
    if (users[xuid] == undefined) return 0;
    return users[xuid].level;
}
exports.getxp = function (xuid) {
    return users[xuid].xp;
}

exports.getXUID = function (name) {
    for (var i in users) {
        if (users[i].name == name) {
            return i;
        }
    }
}

exports.XUID2NAME = function (xuid) {
    try{
       
        return users[xuid].name;
    }catch{ console.log(`查询xuid${xuid}失败`);return 'steve';}

}

exports.nameTolevel = function (n) {
    return this.getLevel(this.getXUID(n));
}

function save() {
    fs.writeFileSync('Data/users.json', JSON.stringify(users, null, "\t"));
    fs.writeFileSync('Data/ban.json', JSON.stringify(bans, null, "\t"));
}

exports.getCount = function () {
    return Object.keys(users).length;
}

exports.key_exist = function (key) {
    for (var i in users) {
        if (users[i].admin.is) {
            if (users[i].admin.key == key)
                return true
        }
    }
    return false;
}

exports.admin_key2name = function(key){
    for (var i in users) {
        if (users[i].admin.is) {
            if (users[i].admin.key == key)
                return users[i].name;
        }
    }
}

exports.ban = function(xuid){
    if(users[xuid]==undefined)return false;
    bans[xuid]=users[xuid];
    users[xuid].pwd = "ban";
    save()
    return true;
}

exports.unban =function(xuid){
    if(bans[xuid]==undefined)return false;
    users[xuid] = bans[xuid];
    delete bans[xuid];
    save()
    return true;
}