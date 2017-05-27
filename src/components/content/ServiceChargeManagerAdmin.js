import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,InputNumber,Select,Popconfirm,Tooltip,DatePicker} from 'antd';
import {fetch,fetch2,getAfterSalesPager,serviceCreate} from '../../utils/connect';

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
const Search = Input.Search;
class EditModalForm extends React.Component {

  state={
    loading:false,
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
              content: '更新服务费记录成功！',
        });
  }
   
    //取消编辑 并重置表单
  handleCancel=()=>{
    console.log("111");
    this.props.handleEditCancel();
    this.props.form.resetFields();
  }
  
 
handleSubmit = (e) => {
  e.preventDefault();
  this.props.form.validateFields((err, values) => {
    if (!err) {
        const  params = {
        'customer.id': values['customerID'],
        'license':values['license'], 
        'money':values['money'], 
        'serviceExpirationDate': values['serviceExpirationDate'].format('YYYY-MM-DD'),
          };
          fetch(serviceCreate,this.onComplate,params);
          this.setState({
            loading:true,
          });
      }
  });
  this.props.form.resetFields();      
}
 
 

  

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >
        <FormItem {...formItemLayout}   >
          {getFieldDecorator('customerID', {
              initialValue: this.props.record.customerID,
            rules: [{ required: false, message: '' }],
          })(
            <input type="hidden" disabled="disabled"  />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="公司名称" >
          {getFieldDecorator('company', {
              initialValue: this.props.record.company,
            rules: [{ required: false, message: '请输入公司名称!' }],
          })(
            <Input type="text" disabled  />
          )}
        </FormItem>
 

        <FormItem {...formItemLayout} label="授权码" >
          {getFieldDecorator('license', {
              initialValue: this.props.record.license,
            rules: [{ required: false, message: '请输入授权码!' }],
          })(
            <Input type="text" disabled  />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="站点数" >
          {getFieldDecorator('userNumber', {
              initialValue: this.props.record.userNumber,
            rules: [{ required: false, message: '请输入站点数!' }],
          })(
            <Input type="text" disabled  />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="服务费" >
          {getFieldDecorator('money', {
              initialValue: this.props.record.money,
            rules: [{ required: true, message: '请输入收取的维护费金额!' }],
          })(
            <InputNumber placeholder="请输入收取的维护费金额" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="服务到期时间" >
          {getFieldDecorator('serviceExpirationDate', {
            rules: [{ type: 'object', required: true, message: '请选择服务到期日期!' }]
          })(
            <DatePicker/>
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
class ServiceChargeManager extends React.Component {
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
        fetch(getAfterSalesPager,this.callbackDate,{pageNO:pager.current,pageSize:pager.pageSize,ifGetCount:1});
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
          if(tempArray[i].ifCanClaim === 1){
            sourceData.unshift({ 
                "serial":i+1,
                "license":tempArray[i].key,
                "userNumber":tempArray[i].userNumber,
                "product":tempArray[i].product && tempArray[i].product.productName,
                "company":tempArray[i].customer && tempArray[i].customer.company,
                "name":tempArray[i].customer && tempArray[i].customer.name,
                "phone":tempArray[i].customer && tempArray[i].customer.phone,   
                "email":tempArray[i].customer && tempArray[i].customer.email, 
                "customerID":tempArray[i].customer && tempArray[i].customer.id,                                               
                "ifCanClaimName":tempArray[i].ifCanClaim===1?"可收取":"",
                "ifCanClaim":tempArray[i].ifCanClaim,                
                "money":tempArray[i].money,                
                "datetime":tempArray[i].datetime,
                "serviceExpirationDate":tempArray[i].serviceExpirationDate,                
                "salesuser": tempArray[i].customer && tempArray[i].salesUser && tempArray[i].salesUser.employee &&
                        tempArray[i].salesUser.employee.name,
            });
          }else{
            sourceData.push({ 
                "serial":i+1,
                "license":tempArray[i].key,
                "userNumber":tempArray[i].userNumber,
                "product":tempArray[i].product && tempArray[i].product.productName,
                "company":tempArray[i].customer && tempArray[i].customer.company,
                "name":tempArray[i].customer && tempArray[i].customer.name,
                "phone":tempArray[i].customer && tempArray[i].customer.phone,   
                "email":tempArray[i].customer && tempArray[i].customer.email, 
                "customerID":tempArray[i].customer && tempArray[i].customer.id,                                               
                "ifCanClaimName":tempArray[i].ifCanClaim===1?"可收取":"服务期内",
                "ifCanClaim":tempArray[i].ifCanClaim,                
                "money":tempArray[i].money,                
                "datetime":tempArray[i].datetime,
                "serviceExpirationDate":tempArray[i].serviceExpirationDate,                
                "salesuser": tempArray[i].customer && tempArray[i].salesUser && tempArray[i].salesUser.employee &&
                        tempArray[i].salesUser.employee.name,
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
    
    //首次加载组件 获取数据
    componentDidMount=()=>{
        // 真实api加 参数查询分页 {pageNO:1,size:10,ifGetCount:1}
        fetch(getAfterSalesPager,this.callbackDate,{pageNO:1,pageSize:10,ifGetCount:1});
    }
   
   
  
    onSearchCustomer=(value)=>{
      if(value){
        fetch(getAfterSalesPager,this.callbackDate,{pageNO:1,pageSize:10,ifGetCount:1,keyword:value});
      }
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

     //删除表格行
    enableRow=(record)=>{
        let state = {...this.state.deleteModal};
            state.visibleDelete=true;
            //深拷屏
            Object.assign(state.data,record);
        this.setState({
            deleteModal:state,
        });
    }
    //启用禁用伙伴行回调
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
     


    render() {
         //伙伴表 字段
        const Columns = [{
          title: '授权码',
          dataIndex: 'license',
        }, {
          title: '产品',
          dataIndex: 'product',
        },{
          title: '用户数',
          dataIndex: 'userNumber',
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
          title: '服务费',
          dataIndex: 'money',
        }, {
          title: '最后缴费日期',
          dataIndex: 'datetime',
        }, {
          title: '服务到期',
          dataIndex: 'serviceExpirationDate',
        }, {
          title: '是否可收取',
          dataIndex: 'ifCanClaimName',
        },{
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                    <a onClick={()=>this.editRow(record)}>收维护费</a> 
                  );
              }, 
        }];

        return (
            <div>
                <div style={{position:'relative',marginBottom:"5px"}}>
                <h2 style={{display:'inline-block'}}>售后服务管理</h2>
                <span> —— </span>
                <Search
                  placeholder="搜索授权码或公司名称"
                  style={{ width: 250 }}
                  size="large"
                  onSearch={this.onSearchCustomer}
                />
            </div>
            <Table bordered columns={Columns}
                rowKey={record => record.serial}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
                dataSource={this.state.data}
                pagination={this.state.pagination}  //Table.pagination：分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                loading={this.state.loading}        //Table.loading：页面是否加载中
                onChange={this.handleTableChange}  //Table.onChange：分页、排序、筛选变化时触发
            />
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
 
            </div>);
    }
}

//导出组件
export default ServiceChargeManager;
