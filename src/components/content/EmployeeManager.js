import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,Select,Popconfirm } from 'antd';
import {fetch,employeeCreate,employeeUpdate,employeeDisable,employeeGetPager} from '../../utils/connect';

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
    if(data){
        //表格重新加载数据
        this.props.handleAddCancel();
        this.props.componentDidMount();
        Modal.success({
              title: '成功',
              content: '添加伙伴成功！,请登录后立即修改密码。',
        });
    }else{
        this.props.handleAddCancel();
        Modal.error({
              title: '错误',
              content: '服务器错误，伙伴添加失败，请稍后重试！',
            });
    }
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
          fetch(employeeCreate,this.onComplate,values,"POST");
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >

         <FormItem {...formItemLayout} label="代理商级别" required>
                {getFieldDecorator('level', {initialValue: '普通代理',
                     })(
                    <Select>
                       <Option value="普通代理">普通代理</Option>
                       <Option value="金牌代理">金牌代理</Option>                       
                       <Option value="ISV合作">ISV合作</Option>
                     </Select>
                    )}
        </FormItem>

        <FormItem {...formItemLayout} label="公司名称" >
          {getFieldDecorator('company', {
            rules: [{ required: true, message: '请输入代理商公司名称!' }],
          })(
            <Input type="text" placeholder="请输入代理商公司名称" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="联系人" >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入代理商联系人姓名!' }],
          })(
            <Input type="text" placeholder="请输入代理商联系人" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="电话" >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入代理商联系人电话!' }],
          })(
            <Input type="phone" placeholder="请输入代理商电话" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="邮箱" >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入代理商邮箱地址!' },
             {type:"email",message:"输入的邮箱不正确!"}],
          })(
            <Input type="mail" placeholder="请输入代理商邮箱" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="地址" >
          {getFieldDecorator('address', {
            rules: [{ required: true, message: '请输入代理商地址!' }],
          })(
            <Input type="text" placeholder="请输入代理商地址" />
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
const children=[];
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
              content: '编辑员工成功！',
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
          fetch2(partnerUpdate,this.onComplate,param);
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
            let list = data.entity.list;
            for (let i = 0; i < data.entity.count; i++) {
              if(list[i].dp && list[i].dp.id === 3){
                children.push(<Option key={list[i].id}>{list[i].name}</Option>);
              }
            }
        }
        console.log(children); 
    }
    componentDidMount=()=>{
        fetch(employeeGetPager,this.employeeListUpdata,{pageNO:1,pageSize:1000,ifGetCount:1})
    }

  levelOnChange=(value)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.level = value;
    this.setState({
      data:tempData
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
  salesUserOnChange=(value)=>{
    let tempData = {}
    let salesUser = {};
    Object.assign(tempData,this.state.data);
    salesUser.id = value;
    tempData.salesUser=salesUser;
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

         <FormItem {...formItemLayout} label="代理商级别" required>
                {getFieldDecorator('level', {initialValue: '普通代理',
                     })(
                    <Select onChange={this.levelOnChange}>
                       <Option value="普通代理">普通代理</Option>
                       <Option value="金牌代理">金牌代理</Option>                       
                       <Option value="ISV合作">ISV合作</Option>
                     </Select>
                    )}
        </FormItem>

        <FormItem {...formItemLayout} label="公司名称" >
          {getFieldDecorator('company', {
              initialValue: this.props.record.company,
            rules: [{ required: true, message: '请输入代理商公司名称!' }],
          })(
            <Input type="text" onChange={this.companyOnChange} placeholder="请输入代理商公司名称" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="销售代表" required>
                {getFieldDecorator('salesUser', {initialValue: this.props.record.salesUser,
                     })(
                    <Select
                       showSearch
                       onChange={this.salesUserOnChange}
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       filterOption={(value, option) => option.props.children.indexOf(value)!=-1}
                     >
                       {children}
                     </Select>
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

const WrapAddModalForm = Form.create()(AddModalForm);
const WrapEditModalForm = Form.create()(EditModalForm);
class PartnerManager extends React.Component {
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
        fetch(partnerGetPager,this.callbackDate);
    }
    //处理员工等级
    partnerLevel=(level)=>{
      let s ='';
      switch(level){
        case "普通代理":s="普通代理";
          break; 
        case "金牌代理": s="金牌代理";                      
          break;
        case "ISV合作":s="ISV合作";
          break;
      }
      return s;
    }
     //处理员工状态
    partnerState=(state)=>{
      let s ='';
      switch(state){
        case 0:s="正常";
          break; 
        case 1: s="禁用";                      
          break;
        case 2:s="不再合作";
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
            sourceData.push({ 
                "serial":i+1,
                "id":tempArray[i].id,
                "user":tempArray[i].user,
                "password":tempArray[i].password,
                "disable":tempArray[i].disable,
                "employeeId":tempArray[i].employee && tempArray[i].employee,
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
      fetch(partnerdisable,this.enableDisableUpdate,{"partnerId":record.id,"state":1});
    }     
    //启用员工   
    enableOk=(record)=>{
      fetch(partnerdisable,this.enableDisableUpdate,{"partnerId":record.id,"state":0});      
    }
    //删除员工
    deleteOk=(record)=>{
      fetch(partnerdisable,this.enableDisableUpdate,{"partnerId":record.id,"state":2});      
    }
    //恢复员工
    unDeleteRow=(record)=>{
      fetch(partnerdisable,this.enableDisableUpdate,{"partnerId":record.id,"state":0});      
    }
    //根据员工当前状态操作员工
    handleTable=(record)=>{
      if(record.state === 0){
        return(
          <div>
            <a onClick={()=>this.editRow(record)}>编辑</a>{" | "}
            <Popconfirm placement="left" title="您确定要禁用该代理商吗?禁用后该代理商将不能再登录伙伴系统。" 
                onConfirm={()=>this.disableOk(record)} 
                okText="确认" cancelText="取消">
            <a>禁用</a>{" | "}
            </Popconfirm>
            <Popconfirm placement="left" title="您确定不再与代理商合作吗?确认后该伙伴将不能再登录系统,伙伴的客户将转为直销客户。" 
                onConfirm={()=>this.deleteOk(record)} 
                okText="确认" cancelText="取消">
            <a>不再合作</a>
            </Popconfirm>
          </div>
        );
      }else if(record.state === 1){
        return(
          <div>
            <a onClick={()=>this.editRow(record)}>编辑</a>{" | "}
            <Popconfirm placement="left" title="您确定要启用该代理商吗?启用后该代理商可以正常登录伙伴系统。" 
                onConfirm={()=>this.enableOk(record)} 
                okText="确认" cancelText="取消">
            <a>启用</a>{" | "}
            </Popconfirm>
            <Popconfirm placement="left" title="您确定不再与代理商合作吗?确认后该伙伴将不能再登录系统,伙伴的客户将转为直销客户。" 
                onConfirm={()=>this.deleteOk(record)} 
                okText="确认" cancelText="取消">
            <a>不再合作</a>
            </Popconfirm>
          </div>
        );
      }else if(record.state === 2){
        return(
            <Popconfirm title="您确定要恢复代理商合作吗?确认后该伙伴可以正常登录系统,伙伴的客户将转为伙伴客户。" 
                onConfirm={()=>this.unDeleteRow(record)} 
                okText="确认" cancelText="取消">
            <a>恢复合作</a>
            </Popconfirm>
        );
      }

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
          title: '员工',
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
          dataIndex: 'disable',
        },{
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                    this.handleTable(record) 
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
export default PartnerManager;
