import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,Select,Popconfirm,Tooltip} from 'antd';
import {fetch,fetch2,customerCreate,customerUpdate,customerDelete,customerGetPager,employeeGetPager,partnerGetPager} from '../../utils/connect';

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


class AddModalForm extends React.Component {
  state={
      loading:false,
  }
    //添加成功数据后的回调
  onComplate=(data)=>{
    this.setState({
      loading:false,
    });
    this.props.form.resetFields();
    if(data === null){
      Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
      return;    
      };
      if(data.errorCode !== 0){
          Modal.error({title: '错误！',content:'服务器错误,'+data.message});
          return;
      }
        //表格重新加载数据
        this.props.handleAddCancel();
        this.props.componentDidMount();
        Modal.success({
              title: '成功',
              content: '添加客户成功。',
        });
    
  }
 
  //取消添加 并重置表单
  handleCancel=()=>{
      this.props.handleAddCancel();
      this.props.form.resetFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          this.setState({
            loading:true,
          });
          values.direct = 1;
          fetch(customerCreate,this.onComplate,values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >

         
        <FormItem {...formItemLayout} label="公司名称" >
          {getFieldDecorator('company', {
            rules: [{ required: true, message: '请输入客户公司名称!' }],
          })(
            <Input type="text" placeholder="请输入客户公司名称" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="联系人" >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入客户联系人姓名!' }],
          })(
            <Input type="text" placeholder="请输入客户联系人" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="电话" >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入客户联系人电话!' }],
          })(
            <Input type="phone" placeholder="请输入客户电话" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="邮箱" >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入客户邮箱地址!' },
             {type:"email",message:"输入的邮箱不正确!"}],
          })(
            <Input type="mail" placeholder="请输入客户邮箱" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="地址" >
          {getFieldDecorator('address', {
            rules: [{ required: true, message: '请输入客户地址!' }],
          })(
            <Input type="text" placeholder="请输入客户地址" />
          )}
        </FormItem>
        <br />
        <FormItem>
        <div style={{textAlign:"center"}}>
          <Button style={{width:"110px",marginRight:"10px"}} onClick={this.handleCancel}>取消</Button>
          <Button type="dashed" style={{width:"110px",marginRight:"10px"}}
                  onClick={()=>{this.props.form.resetFields()}}>重置</Button>
          <Button type="primary" htmlType="submit" loading={this.state.loading}  style={{width:"110px"}}>确定</Button>                              
        </div>  
        </FormItem>

      </Form>
    );
  }
}


class EditModalForm extends React.Component {

  state={
    loading:false,
    data:{},//要修改的数据
  }
    //确认编辑数据后的回调
  onComplate=(data)=>{
    this.setState({
      loading:false,
    });
    this.props.handleEditCancel();
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
        this.props.componentDidMount();
        Modal.success({
              title: '成功',
              content: '编辑客户信息成功！',
        });
  }
   
    //取消编辑 并重置表单
  handleCancel=()=>{
    this.setState({
        data:{},
    });
    this.props.handleEditCancel();
    this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = this.state.data;
        if(data.level || data.company || data.salesUser ||
            data.name || data.phone || data.email || data.address){
          let param = {
            condition: {id:this.props.record.id},
            entity: this.state.data
          }
          fetch2(customerUpdate,this.onComplate,param);
          this.setState({
            loading:true,
          });
        }
      }
    });
    this.setState({
        data:{},
    });
  }


  companyOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.company = e.target.value;
    this.setState({
      data:tempData
    });
  }
 
  nameOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.name = e.target.value;
    this.setState({
      data:tempData
    });
  }
  phoneOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.phone = e.target.value;
    this.setState({
      data:tempData
    });
  }
  emailOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.email = e.target.value;
    this.setState({
      data:tempData
    });
  } 
  addressOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.address = e.target.value;
    this.setState({
      data:tempData
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >
 
        <FormItem {...formItemLayout} label="公司名称" >
          {getFieldDecorator('company', {
              initialValue: this.props.record.company,
            rules: [{ required: true, message: '请输入公司名称!' }],
          })(
            <Input type="text" onChange={this.companyOnChange} placeholder="请输入公司名称" />
          )}
        </FormItem>


        <FormItem {...formItemLayout} label="联系人" >
          {getFieldDecorator('name', {
              initialValue: this.props.record.name,
            rules: [{ required: true, message: '请输入代理商联系人姓名!' }],
          })(
            <Input type="text" onChange={this.nameOnChange} placeholder="请输入代理商联系人" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="电话" >
          {getFieldDecorator('phone', {
              initialValue: this.props.record.phone,
            rules: [{ required: true, message: '请输入代理商联系人电话!' }],
          })(
            <Input type="phone" onChange={this.phoneOnChange} placeholder="请输入代理商电话" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="邮箱" >
          {getFieldDecorator('email', {
              initialValue: this.props.record.email,
            rules: [{ required: true, message: '请输入代理商邮箱地址!' },
             {type:"email",message:"输入的邮箱不正确!"}],
          })(
            <Input type="mail" onChange={this.emailOnChange} placeholder="请输入代理商邮箱" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="地址" >
          {getFieldDecorator('address', {
              initialValue: this.props.record.address,
            rules: [{ required: true, message: '请输入代理商地址!' }],
          })(
            <Input type="text" onChange={this.addressOnChange} placeholder="请输入代理商地址" />
          )}
        </FormItem>
        <br />
        <FormItem>
        <div style={{textAlign:"center"}}>
          <Button style={{width:"110px",marginRight:"10px"}} onClick={this.handleCancel}>取消</Button>
          <Button type="dashed" style={{width:"110px",marginRight:"10px"}}
                  onClick={()=>{this.props.form.resetFields();this.setState({data:{}});}}>重置</Button>
          <Button type="primary" loading={this.state.loading} htmlType="submit"  style={{width:"110px"}}>确定</Button>          
        </div>  
        </FormItem>

      </Form>
    );
  }
}

const WrapEditModalForm = Form.create()(EditModalForm);
const WrapAddModalForm = Form.create()(AddModalForm);
class CustomerManager extends React.Component {
    constructor(props) { super(props); }

    state = {
        data: [],//表格数据
        record:{},//需要修改的行
        loading: true, //表格加载中
        pagination: { //分页器
                showSizeChanger:true, //是否可设置每页显示多少行
                defaultCurrent:1, //默认页码
                // defaultPageSize:5,//默认每页显示多少行
                pageSize:10, //页显示多少行
                total:0, //总行数
                showQuickJumper:true, //可快速跳转到指定页码
                pageSizeOptions:['10','50','200','500','1000']//每页可显示多少行
            }, //分页器
        addModal:{
                visibleAdd:false, //添加按钮点击  模态框 是否可见
                loadingAdd:false,   //确认按钮加载中
            },
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
        // 真实api加 参数查询分页 {pageNO:pager.current,size:pager.pageSize,ifGetCount:1}
        fetch(partnerGetPager,this.callbackDate,{pageNO:pager.current,pageSize:pager.pageSize,ifGetCount:1});
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
            sourceData.push({ 
                "serial":i+1,
                "id":tempArray[i].id,
                "name":tempArray[i].name,
                "address":tempArray[i].address,
                "company":tempArray[i].company,
                "email":tempArray[i].email,
                "phone":tempArray[i].phone,   
                "directName":tempArray[i].direct === 1?"直销客户":"渠道",
                "direct":tempArray[i].direct,                
                "partner":tempArray[i].partner && tempArray[i].partner.company,                                             
                "salesuser":tempArray[i].salesUser && tempArray[i].salesUser.employee &&
                        tempArray[i].salesUser.employee.name,
            });
        }
        this.setState({
            loading:false,
            data:sourceData,
            pagination:pager,
        });
    }
    }
    
    //首次加载组件 获取数据
    componentDidMount=()=>{
        // 真实api加 参数查询分页 {pageNO:1,size:10,ifGetCount:1}
        fetch(customerGetPager,this.callbackDate,{pageNO:1,pageSize:10,ifGetCount:1});
    }
    //新建伙伴
    createNewItem=()=>{
        let state = {...this.state.addModal};
            state.visibleAdd=true;
        this.setState({
            addModal:state,
        });
    }
    //取消新建
    handleAddCancel=()=>{
        let state = {...this.state.addModal};
            state.visibleAdd=false;
        this.setState({
            addModal:state,
        });
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
    
    render() {
         //伙伴表 字段
        const Columns = [{
          title: '序号',
          dataIndex: 'serial',
        }, {
          title: '公司名称',
          dataIndex: 'company',
        },{
          title: '联系人',
          dataIndex: 'name',
        },  {
          title: '电话',
          dataIndex: 'phone',
        }, {
          title: '邮箱',
          dataIndex: 'email',
        }, {
          title: '销售渠道',
          dataIndex: 'directName',
        },{
          title: '销售',
          dataIndex: 'salesuser',
        },{
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                    <a onClick={()=>this.editRow(record)}>编辑</a>
                  );
              }, 
        }];

        return (
            <div>
                <div style={{position:'relative',marginBottom:"5px"}}>
                <h2 style={{display:'inline-block'}}>终端客户管理</h2>
                <Button type="primary" onClick={this.createNewItem} style={{position:"absolute",right:0}}>新建客户</Button>
                </div>
            <Table bordered columns={Columns}
                rowKey={record => record.serial}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
                dataSource={this.state.data}
                pagination={this.state.pagination}  //Table.pagination：分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                loading={this.state.loading}        //Table.loading：页面是否加载中
                onChange={this.handleTableChange}  //Table.onChange：分页、排序、筛选变化时触发
            />

             <Modal
              visible={this.state.addModal.visibleAdd}
              title="新建客户"
              //onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
              footer={null}>
               <WrapAddModalForm handleAddCancel={this.handleAddCancel} 
                                 componentDidMount={this.componentDidMount}
                                />
            </Modal>

            <Modal
              visible={this.state.editModal.visibleEdit}
              title="修改客户信息"
              //onOk={this.handleEditOk}
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

//导出组件
export default CustomerManager;
