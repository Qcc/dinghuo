import React from 'react';
import { Table,Icon,Button,Modal } from 'antd';
import {fetch} from '../../utils/connect';

class CURDTable extends React.Component {
    constructor(props) { super(props); }

    state = {
        data: [],
        pagination: { //分页器
                    showSizeChanger:true, //是否可设置每页显示多少行
                    defaultCurrent:1, //默认页码
                  // defaultPageSize:5,//默认每页显示多少行
                    pageSize:10, //页显示多少行
                    total:0, //总行数
                    showQuickJumper:true, //可快速跳转到指定页码
                    pageSizeOptions:['10','50','200','500','1000']//每页可显示多少行
                  }, //分页器
        visibleAdd:false, //添加按钮点击  模态框 是否可见
        visibleEdit:false, //编辑按钮  模态框 是否可见        
        visibleDelete:false, //删除按钮  模态框 是否可见

        loadingAdd:false,   //确认按钮加载中
        loadingEdit:false,                
        loadingDelete:false,                                        
        loading: false //表格加载中
    };

    //props 校验
    static propTypes = {
        deleteModalTitle:React.PropTypes.string,
        editModalTitle:React.PropTypes.string, 
        newModalTitle:React.PropTypes.string, 
        newButton: React.PropTypes.string,        
        title: React.PropTypes.string,
        Create:React.PropTypes.string,
        Update:React.PropTypes.string,
        Delete:React.PropTypes.string,
        GetPager: React.PropTypes.string,
        Columns:React.PropTypes.array,

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
        fetch(this.props.GetPager,this.callbackDate);
    }

    //获取数据后映射到 table state
    callbackDate = (data) => {
        if(!data){
            Modal.error({
              title: '错误',
              content: '服务器错误，请稍后刷新（F5）重试！',
            });
            return;
        }
        let pager = this.state.pagination;
            pager.total=data.entity.count;
        let tempArray = data.entity.list;
        let sourceData=[];
        for(let i=0;i<tempArray.length;i++){
            sourceData.push({ 
                "id":tempArray[i].id,
                "partner":tempArray[i].partner.name,
                "product":tempArray[i].product.productName,
                "createDatetime":tempArray[i].createDatetime,
                "amount":tempArray[i].amount,
                "price":tempArray[i].price,
                "user":tempArray[i].user.name,
                "approvalDatetime":tempArray[i].approvalDatetime,
                "sum":tempArray[i].sum,
                "state":tempArray[i].state,
            });
        }
        this.setState({
            loading:false,
            data:sourceData,
            pagination:pager,
        });
    }
    //切换模块时，重新获取数据
    componentWillReceiveProps=(nextProps)=>{
        console.log("接受了新的props",nextProps);
        this.setState({
            loading:true,
        });
        // 真实api加 参数查询分页 {pageNO:1,size:10,ifGetCount:1}
        fetch(nextProps.GetPager,this.callbackDate);
    }
    //首次加载组件 获取数据
    componentDidMount() {
        this.setState({
            loading:true,
        });
        console.log("运行时机");
        // 真实api加 参数查询分页 {pageNO:1,size:10,ifGetCount:1}
        fetch(this.props.GetPager,this.callbackDate);
    }
    //新建
    createNewItem=()=>{
        this.setState({
            visibleAdd:true,
        });
        console.log("11");
    }
    //编辑表格行
    editRow=(record)=>{
        this.setState({
            visibleEdit:true,
        });
    }
    //删除表格行
    deleteRow=(record)=>{
        this.setState({
            visibleDelete:true,
        });   
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
         

        return (
            <div>
                <div style={{position:'relative',marginBottom:"5px"}}>
                <h2 style={{display:'inline-block'}}>{this.props.title}</h2>
                <Button type="primary" onClick={this.createNewItem} style={{position:"absolute",right:0}}>{this.props.newButton}</Button>
                </div>
            <Table bordered columns={this.props.Columns}
                rowKey={record => record.id}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
                dataSource={this.state.data}
                pagination={this.state.pagination}  //Table.pagination：分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                loading={this.state.loading}        //Table.loading：页面是否加载中
                onChange={this.handleTableChange}  //Table.onChange：分页、排序、筛选变化时触发
            />

             <Modal
              visible={this.state.visibleAdd}
              title={this.props.newModalTitle}
              onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleAddCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loadingAdd} onClick={this.handleAddOk}>
                  确认
                </Button>,
              ]}
            >
              <p>添加 模态框</p>
            </Modal>

            <Modal
              visible={this.state.visibleEdit}
              title={this.props.editModalTitle}
              onOk={this.handleEditOk}
              onCancel={this.handleEditCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleEditCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loadingEdit} onClick={this.handleEditOk}>
                  确认
                </Button>,
              ]}
            >
              <p>编辑 模态框</p>
            </Modal>

            <Modal
              visible={this.state.visibleDelete}
              title={this.props.deleteModalTitle}
              onOk={this.handleDeleteOk}
              onCancel={this.handleDeleteCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleDeleteCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loadingDelete} onClick={this.handleDeleteOk}>
                  确认
                </Button>,
              ]}
            >
              <Icon style={{color:"#ffbf00",fontSize:"28px",margin:"20px"}} type="exclamation-circle" /><span>您确认要删除该行记录吗？</span>
            </Modal>
            </div>);
    }
}

//导出组件
export default CURDTable;
