import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,Select } from 'antd';
import {fetch,fetch2,partnerCreate,partnerUpdate,partnerDelete,partnerGetPager} from '../../utils/connect';

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
              content: '添加伙伴成功！伙伴登录地址为http://www.kouton.com,伙伴登录账户密码都是手机号,请登录后立即修改密码。',
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
          fetch(partnerCreate,this.onComplate,values,"POST");
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >

         <FormItem {...formItemLayout} label="代理商级别" required>
                {getFieldDecorator('level', {initialValue: 'ordinary',
                     })(
                    <Select>
                       <Option value="ordinary">普通代理</Option>
                       <Option value="gold">金牌代理</Option>                       
                       <Option value="isv">ISV合作</Option>
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
    if(data.entity !== null){
        //成功拿到数据
        //表格重新加载数据
        this.props.handleEditCancel();
        this.props.componentDidMount();
        Modal.success({
              title: '成功',
              content: '编辑伙伴成功！',
        });
     
    }
    this.props.form.resetFields();
  }
   
    //取消编辑 并重置表单
  handleCancel=()=>{
      this.props.handleEditCancel();
      this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          let param = {
            condition: {id:this.props.record.id},
            entity: values
          }
          fetch2(partnerUpdate,this.onComplate,param,"POST");
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >

         <FormItem {...formItemLayout} label="代理商级别" required>
                {getFieldDecorator('level', {initialValue: 'ordinary',
                     })(
                    <Select>
                       <Option value="ordinary">普通代理</Option>
                       <Option value="gold">金牌代理</Option>                       
                       <Option value="isv">ISV合作</Option>
                     </Select>
                    )}
        </FormItem>

        <FormItem {...formItemLayout} label="公司名称" >
          {getFieldDecorator('company', {
              initialValue: this.props.record.company,
            rules: [{ required: true, message: '请输入代理商公司名称!' }],
          })(
            <Input type="text" placeholder="请输入代理商公司名称" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="联系人" >
          {getFieldDecorator('name', {
              initialValue: this.props.record.name,
            rules: [{ required: true, message: '请输入代理商联系人姓名!' }],
          })(
            <Input type="text" placeholder="请输入代理商联系人" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="电话" >
          {getFieldDecorator('phone', {
              initialValue: this.props.record.phone,
            rules: [{ required: true, message: '请输入代理商联系人电话!' }],
          })(
            <Input type="phone" placeholder="请输入代理商电话" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="邮箱" >
          {getFieldDecorator('enail', {
              initialValue: this.props.record.email,
            rules: [{ required: true, message: '请输入代理商邮箱地址!' },
             {type:"email",message:"输入的邮箱不正确!"}],
          })(
            <Input type="mail" placeholder="请输入代理商邮箱" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="地址" >
          {getFieldDecorator('address', {
              initialValue: this.props.record.address,
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
          <Button type="primary" htmlType="submit"  style={{width:"110px"}}>确定</Button>          
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
        loading: false, //表格加载中
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
        deleteModal:{
                visibleDelete:false, //删除按钮  模态框 是否可见
                loadingDelete:false,
                data:{},//待删除行对象                                        
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
    //处理伙伴等级
    partnerLevel=(level)=>{
      let s ='';
      switch(level){
        case "ordinary":s="普通代理";
          break; 
        case "gold": s="金牌代理";                      
          break;
        case "isv":s="ISV合作";
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
                "name":tempArray[i].name,
                "address":tempArray[i].address,
                "company":tempArray[i].company,
                "level":this.partnerLevel(tempArray[i].level),
                "email":tempArray[i].email,
                "phone":tempArray[i].phone,                
                "user":tempArray[i].salesUser && tempArray[i].salesUser.employee &&
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
    // //切换模块时，重新获取数据
    // componentWillReceiveProps=(nextProps)=>{
    //     console.log("接受了新的props",nextProps);
    //     this.setState({
    //         loading:true,
    //     });
    //     // 真实api加 参数查询分页 {pageNO:1,size:10,ifGetCount:1}
    //     fetch(nextProps.GetPager,this.callbackDate);
    // }
    //首次加载组件 获取数据
    componentDidMount=()=>{
        this.setState({
            loading:true,
        });
        // 真实api加 参数查询分页 {pageNO:1,size:10,ifGetCount:1}
        fetch(partnerGetPager,this.callbackDate);
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
    // handleEditOk=()=>{
    //     let state = {...this.state.editModal};
    //         state.loadingEdit=true;
    //     this.setState({
    //         editModal:state,
    //     });
    // }
    handleEditCancel=()=>{
        let state = {...this.state.editModal};
            state.visibleEdit=false;
            state.loadingEdit=false;            
        this.setState({
            editModal:state,
        });
    }    

     //删除表格行
    deleteRow=(record)=>{
        let state = {...this.state.deleteModal};
            state.visibleDelete=true;
            //深拷屏
            Object.assign(state.data,record);
        this.setState({
            deleteModal:state,
        });
    }
    //删除行回调
    deleteUpdate=(data)=>{
        this.handleDeleteCancel();
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
            //表格重新加载数据
            this.componentDidMount();
            Modal.success({
                  title: '成功',
                  content: '删除伙伴成功！',
                });
        
        }
    }
    handleDeleteOk=()=>{
        let state = {...this.state.deleteModal};
            state.loadingDelete=true;
        this.setState({
            deleteModal:state,
        });
        fetch(partnerDelete,this.deleteUpdate,{"id":this.state.deleteModal.data.id},"POST");
    }
    handleDeleteCancel=()=>{
        let state = {...this.state.deleteModal};
            state.visibleDelete=false;
            state.loadingDelete=false;
        this.setState({
            deleteModal:state,
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
          title: '代理商级别',
          dataIndex: 'level',
        }, {
          title: '销售代表',
          dataIndex: 'user',
        },{
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                    <div>
                        <a onClick={()=>this.editRow(record)}>编辑</a>
                        { " / " }<a onClick={()=>this.deleteRow(record)}>删除</a>
                    </div> 
                  );
              }, 
        }];

        return (
            <div>
                <div style={{position:'relative',marginBottom:"5px"}}>
                <h2 style={{display:'inline-block'}}>伙伴管理</h2>
                <Button type="primary" onClick={this.createNewItem} style={{position:"absolute",right:0}}>新建伙伴</Button>
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
              title="新建伙伴"
              //onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
              footer={null}>
               <WrapAddModalForm handleAddCancel={this.handleAddCancel} 
                                 componentDidMount={this.componentDidMount}
                                />
            </Modal>

            <Modal
              visible={this.state.editModal.visibleEdit}
              title="修改伙伴"
              //onOk={this.handleEditOk}
              onCancel={this.handleEditCancel}
              footer={null}
            >
               <WrapEditModalForm record={this.state.editModal.data} 
                                  handleEditCancel={this.handleEditCancel} 
                                  componentDidMount={this.componentDidMount}
                                 />
            </Modal>

            <Modal
              visible={this.state.deleteModal.visibleDelete}
              title="删除伙伴"
              onOk={this.handleDeleteOk}
              onCancel={this.handleDeleteCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleDeleteCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.deleteModal.loadingDelete} onClick={this.handleDeleteOk}>
                  确认
                </Button>,
              ]}
            >
            <div style={{lineHeight:"34px",height:"34px"}}>
              <Icon style={{margin:"20px",color:"#ffbf00",fontSize:"24px"}} type="exclamation-circle" />
                    您确认要删除该该代理商吗？</div>
            </Modal>
            </div>);
    }
}

//导出组件
export default PartnerManager;
