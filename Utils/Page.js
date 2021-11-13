const fs = require('fs');

var pagedata = JSON.parse(fs.readFileSync("page.json"));


Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
}

function guid() {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.addPage=function (title,subtitle,text,author){
    var id = guid();
    if(pagedata[id]==undefined){
        pagedata[id]={
            time: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            author,
            title,
            subtitle,
            text,
            id
        };
    }
    fs.writeFileSync('./page.json',JSON.stringify(pagedata,null,"\t"));
}

exports.getAllID = function(){
    var ids = [];
    for(i in pagedata){
        if(pagedata[i].id != 'null')
            ids.push(i);
    }
    return ids;
}

var pure = {
    title:"空位",
    subtitle:"",
    text:"这里是文章空位，您可以发微博来占领这个空位",
    time:"",
    author:"佚名",
    id:"null"
}

exports.pure = pure;

exports.getEssay = function (id){
    if(id == undefined) return pure;
    return (pagedata[id] == undefined)?pure:pagedata[id];
}