const path = require('path');
const express = require('express');
const url = require('url');
const cookie = require('cookie-parser');
var bodyParser = require('body-parser');/*post方法*/

var pagedata = [
    {
        "第一篇":{
            title:"",
            subtitle:"",
            text:"",
            time:"",
            author:""
        },
        "第二篇":{
            title:"",
            subtitle:"",
            text:"",
            time:"",
            author:""
        },
        "第三篇":{
            title:"",
            subtitle:"",
            text:"",
            time:"",
            author:""
        }
    }
];
var pure = {
    "第一篇":{
        title:"",
        subtitle:"",
        text:"",
        time:"",
        author:""
    },
    "第二篇":{
        title:"",
        subtitle:"",
        text:"",
        time:"",
        author:""
    },
    "第三篇":{
        title:"",
        subtitle:"",
        text:"",
        time:"",
        author:""
    }
}


let app = express();
app.use(cookie());
app.use(bodyParser.json());// 添加json解析
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
 
//注意express.static这个中间件是express内置的
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', function (req, res, next) {
    var uurl = url.parse(req.url,true);
    var pge = (uurl.query.page == undefined)?'1':uurl.query.page
    if(pge <0) res.redirect('/')
    if(pge>pagedata.length) res.redirect('/');
    var dt = {};
    var index = 0;
    var gggg = getpages(Number(pge))
    console.log(gggg);
    for(element in gggg){
        index++;
        dt["title"+index] = gggg[element].title;
        dt["raw_text_"+index] = gggg[element].subtitle;
        dt["content_"+index] = gggg[element].text;
        dt["user_"+index] = gggg[element].author;
        dt["date_"+index] = gggg[element].time;
    };
    dt['id_1']='1'
    dt['id_2']='2'
    dt['id_3']='3'
    dt['now_page' ]= pge
    dt['next_page']= Number(pge)+1
    dt['pervious_page'] =Number(pge-1 <1)?1:pge-1
    res.render('main', dt);
});
app.get('/single',(req,res,next)=>{
    //console.log(req);
    var ul =url.parse(req.url,true)
    id = ul.query.id;
    if(id==undefined){res.redirect('../');}
    res.render('single/main', {
        title: '标题',
        raw_text:"副标题",
        content:'正文',
        name : '发言人',
        time : '2020-11-11'
    });
});

app.get('/about',(req,res)=>{
    res.render('about.html',{});
});

app.post('/add',(req,res)=>{
    body = req.body;
    var re = {};
    switch(body.type){
        case "reg":
            console.log('注册：'+body.params.xuid);
            re = {success:true};
            break;
        case "publish":
            console.log('发布:'+body.params.title);
            re = {success:true};
            break;
    }
    res.json(re)
});

app.listen(3391);

function getpages(pg){
    return pagedata[pg-1]
}