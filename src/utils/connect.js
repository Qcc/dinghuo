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
export function fetch(url,onComplete,params = {},method='GET'){
    console.log("调用了fecth =",'url',url,'method',method,'params:', params);
    if(typeof onComplete !== 'function'){
        console.log("成功获取到数据,回调函数不正确",onComplete);
        return;
    }
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
        if(data.status === 200 && data.errorCode === 0){
            console.log("成功获取到数据 ",JSON.stringify(data,null,4));
            onComplete(data);
            return;
        }
        console.log("服务器错误 ",JSON.stringify(data,null,4)); 
        onComplete(null);         
        })
    .fail((err,msg)=>{
        console.log("err ",err,"msg ",msg);
        onComplete(null);
    });
};

//退出
export const logoutApi =ROOTURL +' /public/user/logout.api';
//动态菜单
//export const dynamicMenuApi = ROOTURL + '/protected/dynamicmenu/get.api';
//订单管理 曾 删 改 查
export const orderCreate = ROOTURL + "/protected/order/create.api";
export const orderUpdate = ROOTURL + "/protected/order/update.api";
export const orderDelete = ROOTURL + "/protected/order/delete.api";
export const orderGetPager = ROOTURL + "/protected/order/getPager.api";
//发货
export const orderfulfill = ROOTURL + "/protected/order/fulfill.api";


//伙伴管理 曾 删 改 查
export const partnerCreate = ROOTURL + "/protected/partner/create.api";
export const partnerUpdate = ROOTURL + "/protected/partner/update.api";
export const partnerDelete = ROOTURL + "/protected/partner/delete.api";
export const partnerGetPager = ROOTURL + "/protected/partner/getPager.api";

//价格管理
export const priceGetPager = ROOTURL + "/protected/agencyprice/getPager.api";
export const priceApply = ROOTURL + "/protected/agencyprice/apply.api";

//库存查询
export const queryStockGetPager = ROOTURL + "/protected/stock/getPager.api";


//================mock data=================
//财务
//export const dynamicMenuApi ="http://192.168.200.100:3000/caiwuMenu";
//销售
export const dynamicMenuApi ="http://192.168.200.100:3000/xiaoshouMenu";
//
//export const orderGetPager = "http://192.168.200.100:3000/orderGetPager";
//export const partnerGetPager = "http://192.168.200.100:3000/partnerManager";
//export const partnerCreate = "http://192.168.200.100:3000/partnerManager";
//export const priceGetPager = "http://192.168.200.100:3000/priceGetPager";
//export const queryStockGetPager = "http://192.168.200.100:3000/StockManager";
//export const orderCreate = "http://192.168.200.100:3000/StockManager";



//export const TEST = "http://192.168.200.100:3000/priceGetPager";
