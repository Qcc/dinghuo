import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,Select,Popconfirm,Tooltip} from 'antd';
import {fetch,fetch2,partnerCreate,partnerdisable,partnerUpdate,partnerGetPager} from '../../utils/connect';

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
          fetch(partnerCreate,this.onComplate,values,"POST");
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


const WrapAddModalForm = Form.create()(AddModalForm);
class PartnerManager extends React.Component {
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
          if(tempArray[i].state === 1) continue;
            sourceData.push({ 
                "serial":i+1,
                "id":tempArray[i].id,
                "name":tempArray[i].name,
                "address":tempArray[i].address,
                "company":tempArray[i].company,
                "level":this.partnerLevel(tempArray[i].level),
                "email":tempArray[i].email,
                "phone":tempArray[i].phone,   
                "statusName":tempArray[i].state?"已禁用":"正常",
                "status":tempArray[i].state,                                             
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
    
    //首次加载组件 获取数据
    componentDidMount=()=>{
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

    parnterUpdate=(data)=>{
      if(data === null){
          Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
          return;    
          };
          if(data.errorCode !== 0){
              Modal.error({title: '错误！',content:'服务器错误,'+data.message});
              return;
          }
          Modal.success({title: '成功',content:'操作成功'});
          this.componentDidMount();
    }
    //禁用启用
    handleEnableOk=(record)=>{
      console.log("确定",record);      
      record.status= record.status === 2?0:2;
        fetch(partnerdisable,this.parnterUpdate,{"partnerId":record.id,"state":record.status},"POST");
    }
    editTable=(record)=>{
      return <Popconfirm title={record.status === 1?"您确定要该启用代理商吗?":"您确定要该禁用代理商吗?"} 
                onConfirm={()=>this.handleEnableOk(record)} 
                okText="确认" cancelText="取消">
                <a>{record.status===2?"启用":"禁用"}</a>
              </Popconfirm>;
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
          title: '状态',
          dataIndex: 'statusName',
        }, {
          title: '销售代表',
          dataIndex: 'user',
        },{
          title: <Tooltip placement="left" title='禁用后代理商将不能再登录伙伴系统'>操作</Tooltip>,
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
                <div style={{position:'relative',marginBottom:"5px"}}>
                <h2 style={{display:'inline-block'}}>直销客户管理</h2>
                <Button type="primary" onClick={this.createNewItem} style={{position:"absolute",right:0}}>新建直销客户</Button>
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
 
            </div>);
    }
}

//导出组件
export default PartnerManager;
