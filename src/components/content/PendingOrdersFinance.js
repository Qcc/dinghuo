import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,Select,Popconfirm,message,Radio} from 'antd';
import {fetch,orderGetPager,orderfulfill,orderDelete,orderUpdate,orderapproval,ordertransfer} from '../../utils/connect';


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
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
class EditModalForm extends React.Component {

    //确认编辑数据后的回调
  onComplate=(data)=>{
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
              content: '订单审核成功！',
        });
    
    
    this.props.form.resetFields();
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
            this.props.handleEditCancel();                 
        fetch(orderapproval,this.onComplate,{"id":record.id,"pass":values.state},"POST");
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >  

        <FormItem {...formItemLayout} label={this.props.record.orderTypeName+"客户"} >
          {getFieldDecorator('company', {
              initialValue: this.props.record.company,
            rules: [{ required: false, message: '' }],
          })(
            <Input disabled type="text" /> 
          )}
        </FormItem>
        {this.props.record.orderType ===3?"":
        <FormItem {...formItemLayout} label="产品">
                {getFieldDecorator('productName', {initialValue: this.props.record.productName,
                     })(
                    <Select disabled>
                       <Option value="ordinary">沟通云桌面</Option>
                       <Option value="gold">CTBS高级版</Option>                       
                       <Option value="isv">CTBS企业版</Option>
                     </Select>
                    )}
        </FormItem>}
        {this.props.record.orderType ===4?
        <FormItem {...formItemLayout} label="授权码" >
          {getFieldDecorator('license', {
              initialValue: this.props.record.license,
            rules: [{ required: false, message: '' }],
          })(
            <Input disabled type="text" />
          )}
        </FormItem>:''}
        {this.props.record.orderType ===3?"":
        <FormItem {...formItemLayout} label="站点数" >
          {getFieldDecorator('points', {
              initialValue: this.props.record.points,
            rules: [{ required: false, message: '请输入站点数!' }],
          })(
            <Input disabled type="text" placeholder="请输入站点数" />
          )}
        </FormItem>}
        
        <FormItem {...formItemLayout} label="金额" >
          {getFieldDecorator('money', {
              initialValue: this.props.record.money,
            rules: [{ required: false, message: '请输入订单金额！' }],
          })(
            <Input disabled  type="phone" placeholder="请输入金额" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} required label="审核" >
             {getFieldDecorator('state', {
            rules: [{ required: true, message: '请选择，确认选通过，不确认选不通过。' }],
          })(
             <RadioGroup >
               <Radio value={1}>通过</Radio>
               <Radio value={0}>不通过</Radio>
             </RadioGroup>
          )}
        </FormItem>

        <br />
        <FormItem>
        <div style={{textAlign:"center"}}>
          <Button style={{width:"110px",marginRight:"40px"}} onClick={this.handleCancel}>取消</Button>
           
          <Button type="primary" htmlType="submit"  style={{width:"110px"}}>确认</Button>          
        </div>  
        </FormItem>

      </Form>
    );
  }
}

class PaymentModalForm extends React.Component {

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
              content: '确认收款成功！',
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
            this.props.handleEditCancel();                 
        fetch(ordertransfer,this.onComplate,{"id":record.id,"transferNumber":values.transferNumber},"POST");
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >  
        <FormItem {...formItemLayout} label="订单付款银行流水号" >
          {getFieldDecorator('transferNumber', {
            rules: [{ required: true, message: '请输入银行流水号!' }],
          })(
            <Input  type="text" placeholder="请输入银行流水号" />
          )}
        </FormItem>
        <br />
        <FormItem>
        <div style={{textAlign:"center"}}>
          <Button style={{width:"110px",marginRight:"10px"}} onClick={this.handleCancel}>取消</Button>
          <Button type="primary" htmlType="submit"  style={{width:"110px"}}>确认到款</Button>          
        </div>  
        </FormItem>

      </Form>
    );
  }
}

const WrapEditModalForm = Form.create()(EditModalForm);
const WrapPaymentModalForm = Form.create()(PaymentModalForm);
class PendingOrdersFinance extends React.Component{
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
        paymentModal:{
                visiblePayment:false, //编辑按钮  模态框 是否可见        
                loadingPayment:false,     
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
        // 真实api加 参数查询分页 {pageNO:pager.current,size:pager.pageSize,ifGetCount:1}
        fetch(orderGetPager,this.callbackDate,{pageNO:pager.current,pageSize:pager.pageSize,state:+filters.stateName[0],ifGetCount:1});
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
    orderTypeName=(orderType)=>{
        let s='';
        switch(orderType){
            case 1:s='伙伴订货';
            break;
            case 2:s='直销客户';
            break;
            case 3:s='伙伴压款';
            break;
            case 4:s='老客户加点';
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
              sourceData.unshift({ 
                "serial":i+1,
                "id":tempArray[i].id,
                "createDatetime":tempArray[i].createDatetime,
                "orderTypeName":this.orderTypeName(tempArray[i].orderType),
                "orderType":tempArray[i].orderType,
                "license":tempArray[i].license,
                "company":tempArray[i].partner&& tempArray[i].partner.company || 
                          tempArray[i].customer && tempArray[i].customer.company,
                "productName":tempArray[i].product && tempArray[i].product.productName,
                "productVersion":tempArray[i].product && tempArray[i].product.productVersion,
                "points":tempArray[i].points,
                "money":tempArray[i].money,
                "state":tempArray[i].state,  
                "stateName":this.stateName(tempArray[i].state),                                              
                "sales":tempArray[i].createdByUser && tempArray[i].createdByUser.employee &&
                         tempArray[i].createdByUser.employee.name,
                "comment":tempArray[i].comment,
              });
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
        fetch(orderGetPager,this.callbackDate,{pageNO:1,pageSize:10,ifGetCount:1});
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

    handlePaymentCancel=()=>{
        let state = {...this.state.paymentModal};
            state.visiblePayment=false;
            state.loadingPayment=false;            
        this.setState({
            paymentModal:state,
        });
    } 

    //删除行回调
    deleteUpdate=(data)=>{
        if(data){
            message.success('删除订单成功');
            this.componentDidMount();
        }else{
            message.error('删除订单失败，请稍后再试！');
        }
    }

    //确认到款
    paymentOK=(record)=>{
        let state = {...this.state.paymentModal};
            state.visiblePayment=true;
        //深拷屏
        Object.assign(state.data,record);
        this.setState({
            paymentModal:state,
        });
    }

    editTable=(record)=>{
        switch(record.state){
            case 1:
                return <a onClick={()=>this.editRow(record)}>审核订单</a>
            case 2:
                return <a onClick={()=>this.paymentOK(record)}>确认到款</a>
                        
        }
    }

    render() {
         //伙伴表 字段
        const Columns = [{
          title: '订单号',
          dataIndex: "id",
        }, {
          title: '订单日期',
          dataIndex: "createDatetime",
        }, {
          title: '客户类型',
          dataIndex: "orderTypeName",
        },{
          title: '公司名称',
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
          filters: [{
                  text: '待发货',
                  value: 3,
                },{
                  text: '待审核',
                  value: 1,
                },{
                  text: '待付款',
                  value: 2,
                },{
                  text: '已完成',
                  value: 4,
                },{
                  text: '审核不通过',
                  value: -2,
                }],
                filterMultiple: false,
        }, {
          title: '销售',
          dataIndex: 'sales',
        }, {
          title: '订单备注',
          dataIndex: 'comment',
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
              title="审核订单"
              onCancel={this.handleEditCancel}
              footer={null}
            >
               <WrapEditModalForm record={this.state.editModal.data} 
                                  handleEditCancel={this.handleEditCancel} 
                                  componentDidMount={this.componentDidMount}
                                 />
            </Modal>
            <Modal
              visible={this.state.paymentModal.visiblePayment}
              title="确认到款"
              onCancel={this.handlePaymentCancel}
              footer={null}
            >
               <WrapPaymentModalForm record={this.state.paymentModal.data} 
                                  handleEditCancel={this.handlePaymentCancel} 
                                  componentDidMount={this.componentDidMount}
                                 />
            </Modal>

            
            </div>);
    }
}
export default PendingOrdersFinance;