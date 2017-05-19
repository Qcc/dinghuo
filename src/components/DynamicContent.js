import React from 'react';
import { Table,Calendar,Button } from 'antd';
//销售模块
import StockManager from './content/StockManager'
import CreateOrder from './content/CreateOrder'
import LicenseManager from './content/LicenseManager'
import PendingOrdersSales from './content/PendingOrdersSales'
import OrderDetails from './content/OrderDetails'
import PartnerManager from './content/PartnerManager';
import CustomerManager from './content/CustomerManager';

import AgencyPriceManager from './content/AgencyPriceManager';
// import {orderCreate,orderUpdate,orderDelete,orderGetPager,
//         partnerCreate,partnerUpdate,partnerDelete,partnerGetPager,} from '../utils/connect';
//财务模块
import PendingOrdersFinance from './content/PendingOrdersFinance'
import HistoryOrders from './content/HistoryOrders'
import AgencyPriceApproval from './content/AgencyPriceApproval'
import PartnerDetails from './content/PartnerDetails'


//账户信息
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

        switch(menuItem){
            //销售模块
            case 'PartnerManager' :
                return  <PartnerManager/>;
            case 'AgencyPriceManager':
                return  <AgencyPriceManager />;
            case 'StockQuery':
                return <StockManager  />;
            case 'CreateOrder':
                return <CreateOrder />;
            case 'PendingOrders_Sales':
                return <PendingOrdersSales/>;
            case 'OrderDetails':
                return <OrderDetails/>; 
            case 'LicenseManager':
                return <LicenseManager/>; 
            case 'CustomerManager':
                return <CustomerManager/>; 
            //财务模块  
            case 'AgencyPriceApproval':
                return <AgencyPriceApproval/>;
            case 'HistoryOrders':
                return <HistoryOrders/>;
            case 'PendingOrders_Finance':
                return <PendingOrdersFinance/>;
            case 'PartnerDetails':
                return <PartnerDetails/>;

            case 'MyAccount':
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
