import React from 'react';
import { Table } from 'antd';
import {fetch,orderGetPager} from '../../utils/connect';

class HistoryOrders extends React.Component{
      constructor(props) { super(props); }

    state = {
        data: [],
        loading: false, //表格加载中
        row:{}, // 保存要操作的行
        pagination: { //分页器
                showSizeChanger:true, //是否可设置每页显示多少行
                defaultCurrent:1, //默认页码
                // defaultPageSize:5,//默认每页显示多少行
                pageSize:10, //页显示多少行
                total:0, //总行数
                showQuickJumper:true, //可快速跳转到指定页码
                pageSizeOptions:['10','50','200','500','1000']//每页可显示多少行
            }, //分页器
    };

    handleTableChange = (pagination, filters, sorter) => { //当点击页面下标时，这里传入的pagination.current指向了新页面
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
       // pager.total = pagination.total;
        this.setState({
            pagination: pager,
            loading:true,
        });
        // 真实api加 参数查询分页 {pageNO:pager.current,size:pager.pageSize,ifGetCount:1}
        fetch(orderGetPager,this.callbackDate);
    }

    stateName=(state)=>{
        let s='';
        switch(state){
            case -2:s='审核不通过';
            break;
            case 1:s='待审核';
            break;
            case 2:s='待付款';
            break;
            case 3:s='待发货';
            break;
            case 4:s='已完成';
            break;
        }
        return s;
    }

    //获取数据后映射到 table state
    callbackDate = (data) => {
          this.setState({
            loading:false,
        });
           if(data === null){
    Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
    return;    
    };
    if(data.errorCode !== 0){
        Modal.error({title: '错误！',content:'服务器错误,'+data.message});
        return;
    }
    if(data.entity !== null){
        //成功拿到数据
        let pager = this.state.pagination;
            pager.total=data.entity.count;
        let tempArray = data.entity.list;
        let sourceData=[];
        for(let i=0;i<tempArray.length;i++){
            if(tempArray[i].state == 4){
                sourceData.push({ 
                    "serial":i+1,
                    "id":tempArray[i].id,
                    "company":tempArray[i].partner && tempArray[i].partner.company,
                    "productName":tempArray[i].product && tempArray[i].product.productName,
                    "productVersion":tempArray[i].product && tempArray[i].product.productVersion,
                    "points":tempArray[i].points,
                    "sum":tempArray[i].sum,
                    "state":tempArray[i].state,  
                    "stateName":this.stateName(tempArray[i].state),                                              
                    "sales":tempArray[i].user && tempArray[i].user.name,
                    "transferNumber":tempArray[i].transferNumber,
                    "comment":tempArray[i].comment,
                });
            }
        }
        this.setState({
            loading:false,
            data:sourceData,
            pagination:pager,
        });
    }

    }
     
    componentDidMount=()=>{
        this.setState({
            loading:true,
        });
        // 真实api加 参数查询分页 {pageNO:1,size:10,ifGetCount:1}
        fetch(orderGetPager,this.callbackDate);
    }

    render() {
         //伙伴表 字段
        const Columns = [{
          title: '序号',
          dataIndex: 'serial',
        }, {
          title: '订单号',
          dataIndex: "id",
        },{
          title: '代理商',
          dataIndex: 'company',
        },  {
          title: '产品名称',
          dataIndex: 'productName',
        }, {
          title: '版本',
          dataIndex: 'productVersion',
        }, {
          title: '站点数',
          dataIndex: 'points',
        }, {
          title: '金额',
          dataIndex: 'sum',
        }, {
          title: '状态',
          dataIndex: 'stateName',
        },   {
          title: '银行流水号',
          dataIndex: 'transferNumber',
        },  {
          title: '订单备注',
          dataIndex: 'comment',
        },{
          title: '销售',
          dataIndex: 'sales',
        } ];

        return (
            <Table bordered columns={Columns}
                rowKey={record => record.id}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
                dataSource={this.state.data}
                pagination={this.state.pagination}  //Table.pagination：分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                loading={this.state.loading}        //Table.loading：页面是否加载中
                onChange={this.handleTableChange}  //Table.onChange：分页、排序、筛选变化时触发
            />
            );
    }
}

export default HistoryOrders;