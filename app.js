const path = require('path');
const express = require('express');
const url = require('url');
const fs = require('fs');
const cookie = require('cookie-parser');
var bodyParser = require('body-parser');/*post方法*/
const UserHelper = require('./Utils/Users');
const PageHelper = require('./Utils/Page');
const { mainModule } = require('process');
var ids = PageHelper.getAllID();
const public_key = '20040615';
let app = express();
app.use(cookie());
app.use(bodyParser.json());// 添加json解析
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
var publish = JSON.parse(fs.readFileSync('publish.json','utf-8'));
//注意express.static这个中间件是express内置的
app.use(express.static(path.join(__dirname, 'views')));



function count_null(t){
    var i = 0;
    for(it in t){
        if(t[it].id == 'null')
            i++
    }
    return i;
}

app.get('/', function (req, res) {
    var ul =url.parse(req.url,true);
    var pge = (ul.query.page == undefined)?1:Number(ul.query.page);
    if(pge<0) res.redirect("./?page=1");
    if(pge>Math.ceil(ids.length /3)) res.redirect("./?page=1");
    var tg = [PageHelper.getEssay(ids[pge*3-3]),PageHelper.getEssay(ids[pge*3-2]),PageHelper.getEssay(ids[pge*3-1])]
    var tgs = [];
    var count = count_null(tg);
    var dao = false;
    while(count>0){
        tgs.push(PageHelper.pure);
        count--;
        dao = true;
    }
    if(dao) tg = tg.reverse();
    for(i in tg){
        if(tg[i].id != 'null')
            tgs.push(tg[i]);
    }
    var holder = {}
    if(dao) tgs = tgs.reverse();
    for(var ii in tgs){
        var path = 'steve'
        try{
            fs.statSync('./views/images/user/'+tgs[ii].author+".jpg")
            path = tgs[ii].author;
        }catch{}
        var i = Number(ii)+1;
        holder["photo_"+i] = path;
        holder["id_"+i] = tgs[ii].id;
        holder["title_"+i] = tgs[ii].title.replace(/\xA7[0-9A-FK-OR]/ig, '');
        holder["date_"+i] = tgs[ii].time;
        holder['raw_text_'+i] = tgs[ii].subtitle.replace(/\xA7[0-9A-FK-OR]/ig, '');
        holder['user_'+i] = tgs[ii].author;
        holder['content_'+i] = tgs[ii].text.replace(/\xA7[0-9A-FK-OR]/ig, '');
        holder['count_'+i] = tgs[ii].reply.length
    }
    holder['now_page' ]= pge
    holder['next_page']= pge+1
    holder['pervious_page'] =(pge-2<0)?1:pge-1
    //console.log(holder);
    res.render('main',holder);
    res.end();
});


app.get('/single',(req,res,next)=>{
    var ul =url.parse(req.url,true)
    id = ul.query.id;
    if(id==undefined){res.redirect('../');}
    var wz = PageHelper.getEssay(id);
    var path = 'steve'
        try{
            fs.statSync('./views/images/user/'+wz.author+".jpg")
            path = wz.author;
        }catch{}
    res.render('single/main', {
        content: wz.text.replace(/\xA7[0-9A-FK-OR]/ig, ''),
        name : wz.author,
        date : wz.time,
        raw_text : wz.subtitle.replace(/\xA7[0-9A-FK-OR]/ig, ''),
        title : wz.title.replace(/\xA7[0-9A-FK-OR]/ig, ''),
        photo : path,
        reply : PageHelper.getReply(id),
        count : wz.reply.length
    });
});

app.get('/about',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','about.html'));
});

app.post("/api/publish/",(req,res)=>{
    body = req.body;
    if(body.key != public_key){ res.json({code:401});res.end(); return;}
    if(publish[PageHelper.getToday()] == undefined) publish[PageHelper.getToday()]  = [];
    if(publish[PageHelper.getToday()].indexOf(body.author) == -1){
        publish[PageHelper.getToday()].push(body.author);
        fs.writeFileSync('publish.json',JSON.stringify(publish,null,'\t'));
    }
    else{
        res.json({code:407});
        res.end();
        return;
    }
    PageHelper.addPage(body.title,body.subtitle,body.text.replace('\\n','<br>'),body.author);
    res.json({code:200});
    res.end();
});
app.post('/api/reg/',(req,res)=>{
    console.log(req.body);
    var ret = {};
    if(req.body.key != public_key){
        res.json({code:401});
        res.end();
        return;
    }
    if(UserHelper.exsits(req.body.xuid)){
        ret.code = 507;
    }else{
        UserHelper.add(req.body.xuid,req.body.name,req.body.pwd);
        ret.code = 200;
    }
    res.json(ret);
    res.end();
});

app.post('/api/login/',(req,res)=>{
    console.log(req.body.xuid,'登录');
    var ret = {};
    if(req.body.key != public_key){
        res.json({code:401});
        res.end();
        return;
    }
    if(!UserHelper.exsits(req.body.xuid)){
        res.json({code:404});
        res.end();
        return;
    }
    if(UserHelper.pwd_right(req.body.xuid,req.body.pwd)){
        ret.code = 200;
    }else{
        ret.code = 404;
    }
    res.json(ret);
    res.end();
});

app.get('/api/page/',(req,res)=>{
    var ul =url.parse(req.url,true);
    console.log(ul);
    if(ul.query.key != public_key) {res.json({code:401}); res.end();return;}
    var pge = (ul.query.page == undefined)?1:Number(ul.query.page);
    if(pge<=0){ res.json({code:404}); return;}
    if(pge>Math.ceil(ids.length /3)) res.json({code:416});
    var tg = [PageHelper.getEssay(ids[pge*3-3]),PageHelper.getEssay(ids[pge*3-2]),PageHelper.getEssay(ids[pge*3-1])]
    var tgs = [];
    for(i in tg){
        if(tg[i].id != 'null')
            tgs.push(tg[i]);
    }
    res.json(tgs.reverse());
    res.end();
});

app.get('/api/page/all',(req,res)=>{
    var ul =url.parse(req.url,true);
    if(ul.query.key != public_key) {res.json({code:401}); res.end();return;}
    var re = [];
    ids.forEach(id=>{
        re.push(PageHelper.getEssay(id));
    });
    res.json(re);
    res.end();
});

app.post('/api/reply',(req,res)=>{
    body = req.body;
    console.log(body);
    if(body.key != public_key){ res.json({code:401});res.end(); return;}

    PageHelper.addReply(body.id,body.name,body.text);
    res.json({code:200});
    res.end();
});

app.get('/api/del',(req,res)=>{
    var ul =url.parse(req.url,true);
    if(ul.query.key != public_key) {res.json({code:401}); res.end();return;}
    try{
        PageHelper.delPage(ul.query.id);
    }catch(err){
        console.log(err);
    }
    res.json({code:200});
    res.end();
});

app.get('/api/essay/',(req,res)=>{
    var ul =url.parse(req.url,true);
    if(ul.query.key == undefined){ res.json({code:401}); res.end();return;}
    if(ul.query.key != public_key) {res.json({code:401}); res.end();return;}
    var id = (ul.query.id == undefined)?'null':ul.query.id;
    res.json(PageHelper.getEssay(id));
});


app.listen(3390);

setInterval(()=>{
    ids = PageHelper.getAllID().reverse();
},5000);

console.log(PageHelper.getToday())
