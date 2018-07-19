/**
 * Created by shea on 2018/2/13.
 */
const prefix = "http://localhost:8080";

function forward(page) {
    window.location.href = prefix+page;
}
//获取url中的参数
function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null) return unescape(r[2]); return null; //返回参数值
}

//获取参数方法
function getUrlParam2(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = encodeURI(window.location.search).substr(1).match(reg);
    if(r!==null)return unescape(r[2]); return null;
}
// //使用获取参数方法
// var id= GetUrlParam("id");
// var name = decodeURI(GetUrlParam("name"));
// console.log("id:"+id+"  name:"+name);