import React from 'react';
import { Table,Calendar,Button } from 'antd';
import CreateOrder from './content/CreateOrder'
import PendingOrdersSales from './content/PendingOrdersSales'
import PartnerManager from './content/PartnerManager';
import PartnerManagerAdmin from './content/PartnerManagerAdmin';
import CustomerManager from './content/CustomerManager';
import CustomerManagerAdmin from './content/CustomerManagerAdmin';
import AgencyPriceManager from './content/AgencyPriceManager';
import TrailLicenseManager from './content/TrailLicenseManager';
import ServiceChargeManager from './content/ServiceChargeManager';
import ServiceChargeManagerAdmin from './content/ServiceChargeManagerAdmin';
import PendingOrdersFinance from './content/PendingOrdersFinance';
import HistoryOrders from './content/HistoryOrders';
import AgencyPriceApproval from './content/AgencyPriceApproval';
import EmployeeManager from './content/EmployeeManager';
import ProductManager from './content/ProductManager';
import AccountInfo from './content/AccountInfo'


//伙伴管理表格 字段
const PartnerColumns = [{
  title: 'ID',
  dataIndex: 'partnerId',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Cash Assets',
  dataIndex: 'money',
}, {
  title: 'Address',
  dataIndex: 'address',
}];
//员工管理表格 字段
const EmployeeColumns = [{
  title: 'ID',
  dataIndex: 'employeeId',
}, {
  title: 'Cash Assets',
  dataIndex: 'money',
}, {
  title: 'Address',
  dataIndex: 'address',
}];
class DynamicContent extends React.Component {
    constructor(props) { 
        super(props); 
        //订单表 字段
        this.OrderColumns = [{
          title: '订单号',
          dataIndex: 'id',
        }, {
          title: '伙伴',
          dataIndex: 'partner',
        },{
          title: '产品',
          dataIndex: 'product',
        },  {
          title: '创建时间',
          dataIndex: 'createDatetime',
        }, {
          title: '购买站点数',
          dataIndex: 'amount',
        }, {
          title: '单价',
          dataIndex: 'price',
        }, {
          title: '销售代表',
          dataIndex: 'user',
        }, {
          title: '审核时间',
          dataIndex: 'approvalDatetime',
        }, {
          title: '总价',
          dataIndex: 'sum',
        }, {
          title: '状态',
          dataIndex: 'state',
        }, {
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                    <div>
                        <a onClick={()=>this.CURDTable.editRow(record)}>编辑</a>
                        { " / " }<a onClick={()=>this.CURDTable.deleteRow(record)}>删除</a>
                    </div> 
                  );
              }, 
        }];
        
    }

    state = {
        menuKey : "1" //根据不同的菜单，展现不同的内容
        //,buttonKey: "default" //如果后面要扩展，比如根据点击按钮展现不同内容，参考menuKey类似做法即可
    };

    static propTypes = {
        Topics: React.PropTypes.object.isRequired,
        PubSub: React.PropTypes.object.isRequired
    };

    

    componentDidMount() {
        let cb = (topic, param) => {
            this.setState({
                menuKey: param.menuKey
            });
        };
        this.pubsub = this.props.PubSub.subscribe(this.props.Topics.OnMenu, cb);
    }

    componentWillUnmount() {
        this.props.PubSub.unsubscribe(this.pubsub);
    }

    dynamicContent() {
        let menuItem =this.state.menuKey;
        // console.log("当前模块=》",menuItem);
        switch(menuItem){
            //销售模块
            case 'PartnerManager_sales' :    //伙伴管理-销售
                return  <PartnerManager/>;
            case 'CustomerManager_sales':   //直销客户管理-销售
                return <CustomerManager/>; 
            case 'AgencyPriceApply_sales':    //伙伴价格申请-销售
                return <AgencyPriceManager/>; 
            case 'CreateOrder':           //新建订单-销售 
                return <CreateOrder/>;
            case 'PendingOrders_sales':   //待处理订单-销售
                return <PendingOrdersSales/>;
            case 'OrderDetails':        //历史订单-销售-财务-管理员
                return <HistoryOrders/>; 
            case 'TrailLicenseManager':   //临时授权-销售-财务-管理员
                return <TrailLicenseManager/>;
            case 'ServiceChargeManager': //维护费-销售-技术
                return <ServiceChargeManager/>;
            //财务模块  
            case 'PartnerManager_finance':    //渠道伙伴-财务-管理员
                return <PartnerManagerAdmin/>;
             case 'CustomerManager_finance':    //直销客户-财务-管理员 
                return <CustomerManagerAdmin/>;
            case 'AgencyPriceApproval_finance': //伙伴价格审核-财务-管理员
                return <AgencyPriceApproval/>;
            case 'PendingOrders_Finance':   //待处理订单-财务-管理员
                return <PendingOrdersFinance/>;
            case 'HistoryOrders':           //历史订单-财务-管理员
                return <HistoryOrders/>;
            case 'ServiceChargeManager_admin': //维护费-销售-技术
                return <ServiceChargeManagerAdmin/>;
            //管理员
            case 'PartnerManager_admin' :  //伙伴管理-财务-管理员
                return  <PartnerManagerAdmin/>;
            case 'CustomerManager_admin':    //直销客户-财务-管理员====
                return <CustomerManagerAdmin/>;
            case 'AgencyPriceApproval_admin': //伙伴价格审核-财务-管理员
                return <AgencyPriceApproval/>;
            case 'PendingOrders_admin':   //待处理订单-财务-管理员
                return <PendingOrdersFinance/>;
            case 'EmployeeManager':    //员工管理-管理员
                return <EmployeeManager/>;
            case 'ProductManager':    // 产品管理-管理员
                return <ProductManager/>;

            case 'MyAccount':   // 账户管理 -销售-财务-技术-管理员
                return <AccountInfo/>;
            default :
                return <h1>{menuItem}</h1>;
        }
    }
    
    render() {
        
        return (
            <div style={this.props.style}>
                {this.dynamicContent()}
            </div>
        );
    }
}

//导出组件
export default DynamicContent;
