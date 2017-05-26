import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,Select,Popconfirm,message} from 'antd';
import {fetch,fetch2,orderGetPager,orderfulfill,orderDelete,orderUpdate} from '../../utils/connect';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};
const FormItem = Form.Item;
const Option = Select.Option;
class EditModalForm extends React.Component {

    //确认编辑数据后的回调
  onComplate=(data)=>{
    this.props.form.resetFields();
       if(data === null){
    Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
    return;    
    };
    if(data.errorCode !== 0){
        Modal.error({title: '错误！',content:'服务器错误,'+data.message});
        return;
    }
     
        //成功拿到数据
        //表格重新加载数据
        this.props.handleEditCancel();
        this.props.componentDidMount();
        Modal.success({
              title: '成功',
              content: '编辑订单成功！',
        });
     
  }
   
    //取消编辑 并重置表单
  handleCancel=()=>{
      this.props.handleEditCancel();
      this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    let record = this.props.record;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          if(record.orderType !==3){
          if(record.company ==values.company && record.points == values.points &&
             record.productName == values.productName && record.money ==values.money){
            this.props.handleEditCancel();                
            return; 
            }
          }else{
             if(record.company ==values.company && record.money ==values.money){
            this.props.handleEditCancel();                
            return; 
            } 
          }
        let param = {
            condition: {id:this.props.record.id},
            entity: values
          }
        fetch2(orderUpdate,this.onComplate,param);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >  

        <FormItem {...formItemLayout} label="公司名称" >
          {getFieldDecorator('company', {
              initialValue: this.props.record.company,
            rules: [{ required: false, message: '请输入客户公司名称!' }],
          })(
            <Input type="text" disabled/>
          )}
        </FormItem>

        {this.props.record.orderType === 3?'':
        <FormItem {...formItemLayout} label="产品" >
                {getFieldDecorator('productName', {initialValue: this.props.record.productName,
                     })(
                    <Select>
                       <Option value="ordinary">沟通云桌面</Option>
                       <Option value="gold">CTBS高级版</Option>                       
                       <Option value="isv">CTBS企业版</Option>
                     </Select>
                    )}
        </FormItem>}
        {this.props.record.orderType === 3?'':
        <FormItem {...formItemLayout} label="站点数" >
          {getFieldDecorator('points', {
              initialValue: this.props.record.points,
            rules: [{ required: false, message: '请输入站点数!' }],
          })(
            <Input type="text" placeholder="请输入站点数" />
          )}
        </FormItem>}

        <FormItem {...formItemLayout} label="金额" >
          {getFieldDecorator('money', {
              initialValue: this.props.record.money,
            rules: [{ required: false, message: '请输入订单金额！' }],
          })(
            <Input type="phone" placeholder="请输入金额" />
          )}
        </FormItem>

        <br />
        <FormItem>
        <div style={{textAlign:"center"}}>
          <Button style={{width:"110px",marginRight:"10px"}} onClick={this.handleCancel}>取消</Button>
          <Button type="dashed" style={{width:"110px",marginRight:"10px"}}
                  onClick={()=>{this.props.form.resetFields()}}>重置</Button>
          <Button type="primary" htmlType="submit"  style={{width:"110px"}}>重新提交</Button>          
        </div>  
        </FormItem>

      </Form>
    );
  }
}

const WrapEditModalForm = Form.create()(EditModalForm);

class PendingOrdersSales extends React.Component{
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
        editModal:{
                visibleEdit:false, //编辑按钮  模态框 是否可见        
                loadingEdit:false,     
                data:{},//待编辑行对象                                                                   
            },
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
        // 真实api加 参数查询分页 
        fetch(orderGetPager,this.callbackDate,{pageNO:pager.current,size:pager.pageSize,ifGetCount:1});
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
            default:s='无';            
        }
        return s;
    }
    orderTypeName=(orderType)=>{
        let s='';
        switch(orderType){
            case 1:s='伙伴订货';
            break;
            case 2:s='直销客户';
            break;
            case 3:s='伙伴压款';
            break;
            default:s='无';
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
            if(tempArray[i].state === 4) continue;
            if(tempArray[i].state === 3){
              sourceData.unshift({ 
                "serial":i+1,
                "id":tempArray[i].id,
                "createDatetime":tempArray[i].createDatetime,
                "orderTypeName":this.orderTypeName(tempArray[i].orderType),
                "orderType":tempArray[i].orderType,                
                "company":tempArray[i].partner && tempArray[i].partner.company || 
                          tempArray[i].customer && tempArray[i].customer.company,
                "productName":tempArray[i].product && tempArray[i].product.productName,
                "productVersion":tempArray[i].product && tempArray[i].product.productVersion,
                "points":tempArray[i].points,
                "money":tempArray[i].money,
                "state":tempArray[i].state,  
                "stateName":this.stateName(tempArray[i].state),                                              
                "sales":tempArray[i].createdByUser && tempArray[i].createdByUser.employee &&
                         tempArray[i].createdByUser.employee.name,
              });
            }else{
                sourceData.push({ 
                "serial":i+1,
                "id":tempArray[i].id,
                "createDatetime":tempArray[i].createDatetime,
                "orderTypeName":this.orderTypeName(tempArray[i].orderType),
                "orderType":tempArray[i].orderType,                
                "company":tempArray[i].partner && tempArray[i].partner.company || 
                          tempArray[i].customer && tempArray[i].customer.company,
                "productName":tempArray[i].product && tempArray[i].product.productName,
                "productVersion":tempArray[i].product && tempArray[i].product.productVersion,
                "points":tempArray[i].points,
                "money":tempArray[i].money,
                "state":tempArray[i].state,  
                "stateName":this.stateName(tempArray[i].state),                                              
                "sales":tempArray[i].createdByUser && tempArray[i].createdByUser.employee &&
                         tempArray[i].createdByUser.employee.name,
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
        fetch(orderGetPager,this.callbackDate,{pageNO:1,size:10,ifGetCount:1});
    }
    //编辑表格行
    editRow=(record)=>{
        let state = {...this.state.editModal};
            state.visibleEdit=true;
        //深拷屏
        Object.assign(state.data,record);
        this.setState({
            editModal:state,
        });
    }
    handleEditCancel=()=>{
        let state = {...this.state.editModal};
            state.visibleEdit=false;
            state.loadingEdit=false;            
        this.setState({
            editModal:state,
        });
    }    

     //保存行数据
    saveRow=(record)=>{
        let state = {...this.state.row};
            //深拷贝
            Object.assign(state,record);
        this.setState({
            row:state,
        });
    }
    //删除行回调
    deleteUpdate=(data)=>{
           if(data === null){
    Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
    return;    
    };
    if(data.errorCode !== 0){
        Modal.error({title: '错误！',content:'服务器错误,'+data.message});
        return;
    }
    
        //成功拿到数据
            message.success('删除订单成功');
            this.componentDidMount();
         
    }

    //删除行
    confirmDelete=()=>{
        fetch(orderDelete,this.deleteUpdate,{id:this.state.row.id});            
        this.setState({
            row:{},
        });
    }
    //发货回调
    deliveryUpdate=(data)=>{
           if(data === null){
    Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
    return;    
    };
    if(data.errorCode !== 0){
        Modal.error({title: '错误！',content:'服务器错误,'+data.message});
        return;
    }
    
        //成功拿到数据
            message.success('操作成功');
            this.componentDidMount();
         
    }
    //发货
    confirmDelivery=()=>{
        fetch(orderfulfill,this.deliveryUpdate,{id:this.state.row.id});    
        this.setState({
            row:{},
        });    
    }

    editTable=(record)=>{
        switch(record.state){
            case -2:
                return <div>
                        <a style={{color:"#ccc"}} >编辑</a> /                         
                        <a style={{color:"#ccc"}} >删除</a>                        
                        {/*<a style={{color:"#ccc"}} onClick={()=>this.editRow(record)}>编辑</a> / 
                        <Popconfirm title="您确认要删除该订单吗?" onConfirm={this.confirmDelete} okText="确认删除" cancelText="不删除">
                        <a style={{color:"#ccc"}} onClick={()=>this.saveRow(record)}>删除</a>
                        </Popconfirm>*/}
                        </div> ;
            case 3:
                return <Popconfirm title={record.orderType===3?"您确认要给该代理商充值吗?":"您确认要给该代理商发货吗?"}  
                            onConfirm={this.confirmDelivery} okText="确认" cancelText="取消">
                            <a onClick={()=>this.saveRow(record)}>{record.orderType===3?"充值":"发货"}</a>
                        </Popconfirm> ;
        }
    }

    render() {
         //伙伴表 字段
        const Columns = [{
          title: '订单号',
          dataIndex: "id",
        },{
          title: '创建日期',
          dataIndex: "createDatetime",
        },{
          title: '订单类型',
          dataIndex: "orderTypeName",
        },{
          title: '客户',
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
          dataIndex: 'money',
        }, {
          title: '状态',
          dataIndex: 'stateName',
        }, {
          title: '销售',
          dataIndex: 'sales',
        },{
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                    <div>
                        {this.editTable(record)}
                    </div> 
                  );
              }, 
        }];

        return (
            <div>
            <Table bordered columns={Columns}
                rowKey={record => record.id}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
                dataSource={this.state.data}
                pagination={this.state.pagination}  //Table.pagination：分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                loading={this.state.loading}        //Table.loading：页面是否加载中
                onChange={this.handleTableChange}  //Table.onChange：分页、排序、筛选变化时触发
            />


            <Modal
              visible={this.state.editModal.visibleEdit}
              title="修改订单"
              onCancel={this.handleEditCancel}
              footer={null}
            >
               <WrapEditModalForm record={this.state.editModal.data} 
                                  handleEditCancel={this.handleEditCancel} 
                                  componentDidMount={this.componentDidMount}
                                 />
            </Modal>
            </div>);
    }
}
export default PendingOrdersSales;