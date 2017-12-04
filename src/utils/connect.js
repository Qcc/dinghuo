import reqwest from 'reqwest';

//根地址 
export const ROOTURL = "http://www.szcloudshare.com/dinghuo";
// const ROOTURL = "http://192.168.200.104:8080/dinghuo";

/*
ajax请求函数
@url 请求url
@onComplete 请求结果处理函数
@method 请求方法，默认GET
@params 请求参数对象
*/
//获取
export function fetch(url,onComplete,params = {},method='POST'){
    // console.log("调用了fecth =",'url',url,'method',method,'params:', params);
    if(typeof onComplete !== 'function'){
        // console.log("成功获取到数据,回调函数不正确",onComplete);
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
        if(data.status === 200){
            // console.log("成功获取到数据 ",JSON.stringify(data,null,4));
            onComplete(data);
        }else{
            onComplete(null);          
            // console.log("服务器错误 ",JSON.stringify(data,null,4));          
        }
        })
    .fail((err,msg)=>{
        // console.log("err ",err,"msg ",msg);
        onComplete(null);
    });
};

//特殊操作
export function fetch2(url,onComplete,params = {},method='POST'){
    //  console.log("调用了fecth =",'url',url,'method',method,'params:', params);
    if(typeof onComplete !== 'function'){
        // console.log("成功获取到数据,回调函数不正确",onComplete);
        return;
    }
    reqwest({
      url: url,
      method: method,
      crossDomain: true,                  //跨域
      withCredentials: true,              //跨域时带Cookie
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=utf-8'
    })
     .then((data) => {
        if(data.status === 200){
            // console.log("成功获取到数据 ",JSON.stringify(data,null,4));
            onComplete(data);
        }else{
            onComplete(null);          
            // console.log("服务器错误 ",JSON.stringify(data,null,4));          
        }
        })
    .fail((err,msg)=>{
        // console.log("err ",err,"msg ",msg);
        onComplete(null);
    });
};

export const indexURL =  ROOTURL + "/kouton/index.html";
//登录成功
export const loginSuccessURL= ROOTURL + "/protected/kouton/main.html";
// export const loginSuccessURL= "http://localhost:8000/main.html";
//退出
export const logoutApi = ROOTURL + "/public/user/logout.api";
//是否登录
export const isLoggedIn = ROOTURL + "/public/user/isLoggedIn.api";
//登录
export const actionURL =ROOTURL +'/public/user/koutonlogin.api';

//修改密码
export const modifyPassword = ROOTURL+'/public/user/modifyPassword.api';
//验证码 api 
export const validateCodeImgURL = ROOTURL + "/public/user/validateCodeImg.api";

//动态菜单
export const dynamicMenuApi = ROOTURL + '/protected/dynamicmenu/get.api';
//订单管理 曾 删 改 查
export const orderCreate = ROOTURL + "/protected/order/create.api";
export const orderUpdate = ROOTURL + "/protected/order/update.api";
export const orderDelete = ROOTURL + "/protected/order/delete.api";
export const orderGetPager = ROOTURL + "/protected/order/getPager.api";
//发货
export const orderfulfill = ROOTURL + "/protected/order/fulfill.api";

//审核订单
export const orderapproval = ROOTURL + "/protected/order/approval.api";
//确认到款
export const ordertransfer = ROOTURL + "/protected/order/transfer.api";

//临时授权
export const licenseCountPager = ROOTURL + "/protected/license/getLicenseCountPager.api";

//伙伴管理 曾 删 改 查
export const partnerCreate = ROOTURL + "/protected/partner/create.api";
export const partnerUpdate = ROOTURL + "/protected/partner/update.api";
export const partnerDelete = ROOTURL + "/protected/partner/delete.api";
export const partnerGetPager = ROOTURL + "/protected/partner/getPager.api";
export const partnerdisable = ROOTURL + "/protected/partner/disable.api";

//价格管理
export const priceGetPager = ROOTURL + "/protected/agencyprice/getPager.api";
export const priceApply = ROOTURL + "/protected/agencyprice/apply.api";
export const priceApproval = ROOTURL + "/protected/agencyprice/approval.api";

//库存查询
export const queryStockGetPager = ROOTURL + "/protected/stock/getPager.api";
//产品查询
export const productGetPager = ROOTURL + "/protected/product/getPager.api";
export const productCreate = ROOTURL + "/protected/product/create.api";
export const productUpdate = ROOTURL + "/protected/product/update.api";
export const productDelete = ROOTURL + "/protected/product/delete.api";

//临时授权
export const generateTrail = ROOTURL +"/protected/license/generateTrail.api";
//临时license 延期 加点
export const addUserNumberAndDelay = ROOTURL+"/protected/license/addUserNumberAndDelay.api";
//临时license 获取还可延期的天数
export const getSumDelayDays = ROOTURL+"/protected/license/getSumDelayDays.api";
//售后服务
export const getAfterSalesPager = ROOTURL+"/protected/license/getAfterSalesPager.api";

//员工管理
export const employeeCreate = ROOTURL+"/protected/employee/create.api";
export const employeeUpdate = ROOTURL+"/protected/employee/update.api";
export const employeeDisable = ROOTURL+"/protected/employee/disable.api";
export const employeeGetPager = ROOTURL+"/protected/employee/getPager.api";
//部门管理
export const departmentGetPager = ROOTURL+"/protected/department/getPager.api";

//终端用户管理
export const customerCreate = ROOTURL + "/protected/customer/create.api";
export const customerUpdate = ROOTURL + "/protected/customer/update.api";
export const customerDelete = ROOTURL + "/protected/customer/delete.api";
export const customerGetPager = ROOTURL + "/protected/customer/getPager.api";

//维护费管理
export const serviceCreate = ROOTURL + "/protected/customerServiceCharge/create.api";
export const serviceUpdate = ROOTURL + "/protected/customerServiceCharge/update.api";
export const serviceDelete = ROOTURL + "/protected/customerServiceCharge/delete.api";
export const serviceGetPager = ROOTURL + "/protected/customerServiceCharge/getPager.api";
//现金库存管理
export const rechargeCreate = ROOTURL + "/protected/recharge/create.api";
export const rechargeTransfer = ROOTURL + "/protected/recharge/transfer.api";
export const rechargeGetPager = ROOTURL + "/protected/recharge/getPager.api";






//================mock data=================
//财务
//export const dynamicMenuApi ="http://192.168.200.100:3000/caiwuMenu";
//销售
//export const dynamicMenuApi ="http://192.168.200.100:3000/xiaoshouMenu";
//
//export const orderGetPager = "http://192.168.200.100:3000/orderGetPager";
//export const partnerGetPager = "http://192.168.200.100:3000/partnerManager";
//export const partnerCreate = "http://192.168.200.100:3000/partnerManager";
//export const priceGetPager = "http://192.168.200.100:3000/priceGetPager";
//export const queryStockGetPager = "http://192.168.200.100:3000/StockManager";
//export const orderCreate = "http://192.168.200.100:3000/StockManager";



//export const TEST = "http://192.168.200.100:3000/priceGetPager";
