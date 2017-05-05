import reqwest from 'reqwest';

//根地址 
const ROOTURL = "http://192.168.200.104:8080/dinghuo";
/*
ajax请求函数
@url 请求url
@onComplete 请求结果处理函数
@method 请求方法，默认GET
@params 请求参数对象
*/
export function fetch(url,onComplete,params = {},method='POST'){
    url=ROOTURL+url;
    console.log("调用了fecth =",'url',url,'method',method,'params:', params);
    reqwest({
      url: url,
      method: method,
      crossDomain: true,                  //跨域
      withCredentials: true,              //跨域时带Cookie
      data: {
        ...params,
      },
      type: 'json',
    })
    .then((data) => {
        if(data.status !== 200 && data.errorCode !== 0){
          console.log("服务器错误 ",JSON.stringify(data,null,4));          
          return;
        }
        console.log("成功获取到数据 ",JSON.stringify(data,null,4));
        if(typeof onComplete == 'function'){
            onComplete(data);
        }else{
            console.log("对调函数不正确",onComplete);
        }
        })
    .fail((err,msg)=>{
        console.log("err ",err,"msg ",msg);
        if(typeof onComplete == 'function'){
            onComplete(null);
        }else{
            console.log("对调函数不正确",onComplete);
        }
    });
};

//退出
export const logoutApi ='public/user/logout.api';
export const dynamicMenuApi ='protected/dynamicmenu/get.api';