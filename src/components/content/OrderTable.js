import React from 'react';
import { Table,Button,Modal } from 'antd';
import {fetch,orderCreate,orderUpdate,orderDelete,orderGetPager} from '../../utils/connect';
class OrderTable extends React.Component {
    constructor(props) { super(props); }

    state = {
        data: [],
        pagination: {
            total: 0,            //数据总数
            current:1,          //当前页数
            pageSize: 1        //每页条数
        },
        visibleAdd:false, //添加按钮点击  模态框 是否可见
        visibleEdit:false, //编辑按钮  模态框 是否可见        
        visibleDelete:false, //删除按钮  模态框 是否可见
        loadingAdd:false,   //确认按钮加载中
        loadingEdit:false,                
        loadingDelete:false,                                        
        loading: false //表格加载中
    };

    static propTypes = {
        Topics: React.PropTypes.object.isRequired,
        PubSub: React.PropTypes.object.isRequired
    };

    handleTableChange = (pagination, filters, sorter) => { //当点击页面下标时，这里传入的pagination.current指向了新页面
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch();
    }

    callbackDate = (data) => {
        console.log("订单表：",data)
    }

    componentDidMount() {
        fetch(orderGetPager,this.callbackDate,{pageNO:0,size:10,ifGetCount:1});
    }
    //新建
    createNewItem=()=>{
        this.setState({
            visibleAdd:true,
        });
        console.log("11");
    }
    //添加 编辑 删除 模态框控制
    handleAddOk=()=>{
        this.setState({
            loadingAdd:true,
        });
    }
    handleAddCancel=()=>{
        this.setState({
            visibleAdd:false,
        });
    }
    handleEditOk=()=>{
        this.setState({
            loadingEdit:true,
        });
    }
    handleEditCancel=()=>{
        this.setState({
            visibleEdit:false,
        });
    }    
    handleDeleteOk=()=>{
        this.setState({
            loadingDelete:true,
        });
    }
    handleDeleteCancel=()=>{
        this.setState({
            visibleDelete:false,
        });
    }


    render() {
        const columns = [{
            title: '编号',
            dataIndex: 'id'
        }, {
            title: '创建时间',
            dataIndex: 'createDatetime'
        }];

        return (
            <div>
                <div style={{position:'relative',marginBottom:"5px"}}>
                <h2 style={{display:'inline-block'}}>订单管理</h2>
                <Button type="primary" onClick={this.createNewItem} style={{position:"absolute",right:0}}>创建订单</Button>
                </div>
            <Table bordered columns={columns}
                rowKey={record => record.id}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
                dataSource={this.state.data}
                pagination={this.state.pagination}  //Table.pagination：分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                loading={this.state.loading}        //Table.loading：页面是否加载中
                onChange={this.handleTableChange}  //Table.onChange：分页、排序、筛选变化时触发
            />

             <Modal
              visible={this.state.visibleAdd}
              title="新建订单"
              onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleAddCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loadingAdd} onClick={this.handleAddOk}>
                  确认创建
                </Button>,
              ]}
            >
              <p>添加 模态框</p>
            </Modal>

            <Modal
              visible={this.state.visibleEdit}
              title="编辑订单"
              onOk={this.handleEditOk}
              onCancel={this.handleEditCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleEditCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loadingEdit} onClick={this.handleEditOk}>
                  编辑新建
                </Button>,
              ]}
            >
              <p>编辑 模态框</p>
            </Modal>

            <Modal
              visible={this.state.visibleDelete}
              title="删除订单"
              onOk={this.handleDeleteOk}
              onCancel={this.handleDeleteCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleDeleteCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loadingDelete} onClick={this.handleDeleteOk}>
                  确认删除
                </Button>,
              ]}
            >
              <p>删除 模态框</p>
            </Modal>
            </div>);
    }
}

//导出组件
export default OrderTable;
