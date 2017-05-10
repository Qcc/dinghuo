import React from 'react';
import { Table,Calendar,Button } from 'antd';
import AddPartner from './content/AddPartner'
import AccountInfo from './content/AccountInfo'
import PartnerManagerTable from './content/PartnerManagerTable.js';
import PartnerCURDTable from './content/PartnerCURDTable.js';
import {orderCreate,orderUpdate,orderDelete,orderGetPager,
        partnerCreate,partnerUpdate,partnerDelete,partnerGetPager,} from '../utils/connect';


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
        console.log("当前菜单 ",this.state.menuKey);
        if(this.state.menuKey == 'OrderList') {
            return <PartnerManagerTable  />;
        }else if(this.state.menuKey == 'PartnerManager')
            return <PartnerManagerTable />;
        else if(this.state.menuKey == 'ModEmployee'){
            return <PartnerManagerTable  />;
        }else if(this.state.menuKey == 'AccountInfo'){
            return <AccountInfo/>;            
        }else{
            return <h1>{this.state.menuKey}</h1>;
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
