# 简介

MCWeibo是一个在线的微博平台，后端基于Nodejs搭建

可以通过HTTP请求来发布、获取文章


# api

```
[POST] /api/publish/
```
用于发布文章

POST数据示例
``` json
{
    "key":"{key}",
    "title":"文章标题",
    "subtitle":"文章副标题",
    "author":"作者",
    "text":"正文"
}
```

```
[GET] /api/page/?page={page}&key={key}
```
用于通过页码获取页面内容

```
[GET] /api/essay/?id={id}&key={key}
```
用于通过id获取具体文章

|HTTP状态码|含义|
|::|::|
|200|接口正常|
|404|请求的资源未找到|
|401|请求进行身份认证|
|416|请求的范围无效|