import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,Select,Popconfirm } from 'antd';
import {fetch,fetch2,employeeCreate,employeeUpdate,employeeDisable,employeeGetPager,departmentGetPager} from '../../utils/connect';

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
const children=[];

class AddModalForm extends React.Component {
  state={
      loading:false,
  }


  dpUpdata=(data)=>{
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
            let list = data.entity;
            for (let i = 0; i < list.length; i++) {
                children.push(<Option key={list[i].id}>{list[i].name}</Option>);
            }
        }
        
    }
    componentDidMount=()=>{
        fetch(departmentGetPager,this.dpUpdata,{pageNO:1,pageSize:1000,ifGetCount:1})
    }


    //添加成功数据后的回调
  onComplate=(data)=>{
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
        //表格重新加载数据
        this.props.handleAddCancel();
        this.props.componentDidMount();
        Modal.success({
              title: '成功',
              content: '添加员工成功！,请登录后立即修改密码。',
        });
    this.props.form.resetFields();
  }
 
  //取消添加 并重置表单
  handleCancel=()=>{
      this.props.handleAddCancel();
      this.props.form.resetFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      loading:true,
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch(employeeCreate,this.onComplate,
            {"employee.name":values.name,"user":values.user,"password":values.user,"employee.dp.id":values.dp,
                "employee.phone":values.phone,"employee.email":values.email});
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >

        <FormItem {...formItemLayout} label="员工姓名" >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入员工姓名!' }],
          })(
            <Input type="text" placeholder="请输入员工姓名" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="登录帐号" >
          {getFieldDecorator('user', {
            rules: [{ required: true, message: '请输入登录帐号!' }],
          })(
            <Input type="text" placeholder="请输入登录帐号" />
          )}
        </FormItem>

         <FormItem {...formItemLayout} label="所属部门" required>
                {getFieldDecorator('dp',{
            rules: [{ required: true, message: '请输请选择部门!' }],
          })(
                    <Select
                       showSearch
                       onChange={this.dpOnChange}
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       filterOption={(value, option) => option.props.children.indexOf(value)!=-1}
                     >
                       {children}
                     </Select>
                    )}
        </FormItem>

        <FormItem {...formItemLayout} label="电话" >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入员工电话!' }],
          })(
            <Input type="text" placeholder="请输入员工电话" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="邮箱" >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入员工邮箱!' }],
          })(
            <Input type="text" placeholder="请输入员工邮箱" />
          )}
        </FormItem>
     
        <div style={{border: "1px #f50 dashed",padding: "5px",margin: "0 30px 20px"}}>
            <p><span style={{color: "#f50"}}>提示 ：</span>新建帐号密码默认与帐号相同，请员工登录后立即修改密码。</p>
        </div>
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
    confirmDirty: false,//验证密码
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
              content: '编辑员工成功！',
        });
  }
   
    //取消编辑 并重置表单
  handleCancel=()=>{
    this.setState({
        data:{},
        "employee.name":null,
    });
    this.props.handleEditCancel();
    this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = this.state.data;
        let params = {};
        if(data.name)
          if(params.employee){
              params.employee.name=data.name;
          }else{
            params.employee={name:data.name};
          }
        if(data.user)params.user=data.user;
        if(data.dp)
          if(params.employee){
            params.employee.dp={id:data.dp};
          }else{
            params.employee={dp:{id:data.dp}};            
          }
        if(data.phone)
          if(params.employee){
            params.employee.phone=data.phone;
          }else{
            params.employee={phone:data.phone};            
          }
        if(data.email)
          if(params.employee){
            params.employee.email = data.email;
          }else{
            params.employee = {email:data.email};            
          }
        if(data.password)params.password = data.password;
        if(params.employee || params.user || params.password){
          let param = {
            condition: {employee:{id:this.props.record.employeeId}},
            entity: params
          }
          fetch2(employeeUpdate,this.onComplate,param);
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

    //
    employeeListUpdata=(data)=>{
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
            let list = data.entity;
            for (let i = 0; i < list.length; i++) {
                children.push(<Option key={list[i].id}>{list[i].name}</Option>);
            }
        }
        
    }
    componentDidMount=()=>{
        fetch(departmentGetPager,this.employeeListUpdata,{pageNO:1,pageSize:1000,ifGetCount:1})
    }

  nameOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.name =e.target.value;
    this.setState({
      data:tempData
    });
  }
  userOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.user = e.target.value;
    this.setState({
      data:tempData
    });
  }
  dpOnChange=(value)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
      tempData.dp=value;
    this.setState({
      data:tempData
    });
  }
 
  phoneOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.phone =e.target.value;      
    this.setState({
      data:tempData
    });
  }
  emailOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.email =e.target.value;      
    this.setState({
      data:tempData
    });
  } 
  passwordOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.password = e.target.value;
    this.setState({
      data:tempData
    });
  }
  rePasswordOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.rePassword = e.target.value;
    this.setState({
      data:tempData
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['rePassword'], { force: true });
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >

         <FormItem {...formItemLayout} label="员工姓名" required>
                {getFieldDecorator('level', {initialValue: this.props.record.name,
                     })(
            <Input type="text" onChange={this.nameOnChange} placeholder="请输入员工姓名" />
                     
                    )}
        </FormItem>

        <FormItem {...formItemLayout} label="登录帐号" >
          {getFieldDecorator('company', {
              initialValue: this.props.record.user,
            rules: [{ required: true, message: '请输入员工登录帐号!' }],
          })(
            <Input type="text" onChange={this.userOnChange} placeholder="请输入员工登录帐号!" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="所属部门" required>
                {getFieldDecorator('salesUser', {initialValue: this.props.record.dp,
                     })(
                    <Select
                       showSearch
                       onChange={this.dpOnChange}
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       filterOption={(value, option) => option.props.children.indexOf(value)!=-1}
                     >
                       {children}
                     </Select>
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

        <FormItem {...formItemLayout} label="密码" >
          {getFieldDecorator('password', {
              initialValue: this.props.record.password,            
            rules: [{
              required: true, message: '请输入员工帐号密码!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" onChange={this.passwordOnChange} placeholder="请输入员工帐号密码" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="重复密码"  >
          {getFieldDecorator('rePassword', {
              initialValue: this.props.record.password,            
            rules: [{
              required: true, message: '请重复输入员工帐号密码!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password"  onChange={this.rePasswordOnChange} placeholder="请重复员工帐号密码" 
                  onBlur={this.handleConfirmBlur} />
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

const WrapAddModalForm = Form.create()(AddModalForm);
const WrapEditModalForm = Form.create()(EditModalForm);
class EmployeeManager extends React.Component {
    constructor(props) { super(props); }

    state = {
        data: [],
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
        fetch(employeeGetPager,this.callbackDate,{pageNO:pager.current,pageSize:pager.pageSize,ifGetCount:1});
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
                "user":tempArray[i].user,
                "password":tempArray[i].password,
                "disable":tempArray[i].disable,
                "disableName":tempArray[i].disable?"已禁用":"正常",                
                "employeeId":tempArray[i].employee && tempArray[i].employee.id,
                "name":tempArray[i].employee && tempArray[i].employee.name,
                "phone":tempArray[i].employee && tempArray[i].employee.phone,
                "email":tempArray[i].employee && tempArray[i].employee.email,
                "dp":tempArray[i].employee && tempArray[i].employee.dp && tempArray[i].employee.dp.name,
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
        fetch(employeeGetPager,this.callbackDate,{pageNO:1,pageSize:10,ifGetCount:1})
    }
    //新建员工
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

 
    //启用禁用员工行回调
    enableDisableUpdate=(data)=>{
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
            this.componentDidMount();
            Modal.success({
                  title: '成功',
                  content: '当前操作成功！',
                });
    }
    //禁用员工     
    disableOk=(record)=>{
      let disable=null;
      if(record.disable === 1){
        disable=0;
      }else{
        disable=1
      }
      fetch(employeeDisable,this.enableDisableUpdate,{"userId":record.employeeId,"disable":disable});
    }     
    
   
    

    render() {
         //伙伴表 字段
        const Columns = [{
          title: '序号',
          dataIndex: 'serial',
        }, {
          title: '登录账户',
          dataIndex: 'user',
        },{
          title: '员工姓名',
          dataIndex: 'name',
        },  {
          title: '所属部门',
          dataIndex: 'dp',
        }, {
          title: '电话',
          dataIndex: 'phone',
        }, {
          title: '邮箱',
          dataIndex: 'email',
        }, {
          title: '状态',
          dataIndex: 'disableName',
        },{
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                   <div>
                     <a onClick={()=>this.editRow(record)}>编辑</a>{" | "}
                     <Popconfirm placement="left" title={record.disable === 1?"您确定要启用该员工吗?":"您确定要禁用该员工吗?"} 
                         onConfirm={()=>this.disableOk(record)} 
                         okText="确认" cancelText="取消">
                     <a>{record.disable === 1?"启用":"禁用"}</a>
                     </Popconfirm>
                   </div>
                  );
              }, 
        }];

        return (
            <div>
                <div style={{position:'relative',marginBottom:"5px"}}>
                <h2 style={{display:'inline-block'}}>员工管理</h2>
                <Button type="primary" onClick={this.createNewItem} style={{position:"absolute",right:0}}>新建员工</Button>
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
              title="新建员工"
              //onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
              footer={null}>
               <WrapAddModalForm handleAddCancel={this.handleAddCancel} 
                                 componentDidMount={this.componentDidMount}
                                />
            </Modal>

            <Modal
              visible={this.state.editModal.visibleEdit}
              title="修改员工"
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
export default EmployeeManager;
