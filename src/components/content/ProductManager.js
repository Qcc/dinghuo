import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,InputNumber,Select,Popconfirm } from 'antd';
import {fetch2,fetch,productGetPager,productCreate,productUpdate,productDelete} from '../../utils/connect';

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
              content: '添加产品成功！',
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
          fetch(productCreate,this.onComplate,values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >

        <FormItem {...formItemLayout} label="产品名称" >
          {getFieldDecorator('productName', {
            rules: [{ required: true, message: '请输入产品名称!' }],
          })(
            <Input type="text" onChange={this.nameOnChange} placeholder="请输入产品名称!" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="产品版本" >
          {getFieldDecorator('productVersion', {
            rules: [{ required: true, message: '请输入产品版本!' }],
          })(
            <Input type="phone" onChange={this.phoneOnChange} placeholder="请输入产品版本!" />
          )}
        </FormItem>
 

        <FormItem {...formItemLayout} label="市场价" >
          {getFieldDecorator('productPrice', {
            rules: [{ required: true, message: '请输入产品市场价!' }],
          })(
            <Input type="text" onChange={this.addressOnChange} placeholder="请输入产品市场价!" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="服务费" >
          {getFieldDecorator('servicechargerate', {
              initialValue: 10,
            rules: [{ required: true, message: '请输入产品服务费比例!' }],
          })(
            <InputNumber 
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            min={0}
            type="text" onChange={this.serviceChargerateOnChange} placeholder="请输入产品服务费比例!" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="质保期" >
          {getFieldDecorator('serviceperiod', {
              initialValue: 365,
            rules: [{ required: true, message: '请输入产品质保周期!' }],
          })(
            <InputNumber 
            type="text" min={1} 
            formatter={value => `${value}天`}
            parser={value => value.replace('天', '')}
            onChange={this.servicEperiodOnChange} placeholder="请输入产品质保周期!" />
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
              content: '编辑产品成功！',
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
        console.log(data);
        if(data.productPrice || data.productName || data.productVersion ||data.servicechargerate ||
data.serviceperiod){
          let param = {
            condition: {productId:this.props.record.productId},
            entity: this.state.data
          }
          fetch2(productUpdate,this.onComplate,param);
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

  productNameOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.productName = e.target.value;
    this.setState({
      data:tempData
    });
   
    
  }
  productVersionOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.productVersion = e.target.value;
    this.setState({
      data:tempData
    });
  } 
  productPriceOnChange=(e)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.productPrice = e.target.value;
    this.setState({
      data:tempData
    });
  }
  serviceChargerateOnChange=(value)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.servicechargerate =value;
    this.setState({
      data:tempData
    });
  }
  servicEperiodOnChange=(value)=>{
    let tempData = {}
    Object.assign(tempData,this.state.data);
    tempData.serviceperiod =value;
    this.setState({
      data:tempData
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} >

        <FormItem {...formItemLayout} label="产品名称" >
          {getFieldDecorator('productName', {
              initialValue: this.props.record.productName,
            rules: [{ required: true, message: '请输入产品名称!' }],
          })(
            <Input type="text" onChange={this.productNameOnChange} placeholder="请输入产品名称!" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="产品版本" >
          {getFieldDecorator('productVersion', {
              initialValue: this.props.record.productVersion,
            rules: [{ required: true, message: '请输入产品版本!' }],
          })(
            <Input type="phone" onChange={this.productVersionOnChange} placeholder="请输入产品版本!" />
          )}
        </FormItem>
 

        <FormItem {...formItemLayout} label="市场价" >
          {getFieldDecorator('productPrice', {
              initialValue: this.props.record.productPrice,
            rules: [{ required: true, message: '请输入产品市场价!' }],
          })(
            <Input type="text" onChange={this.productPriceOnChange} placeholder="请输入产品市场价!" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="服务费" >
          {getFieldDecorator('servicechargerate', {
              initialValue: this.props.record.servicechargerate,
            rules: [{ required: true, message: '请输入产品服务费比例!' }],
          })(
            <InputNumber 
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            min={0}
            type="text" onChange={this.serviceChargerateOnChange} placeholder="请输入产品服务费比例!" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="质保期" >
          {getFieldDecorator('serviceperiod', {
              initialValue: this.props.record.serviceperiod,
            rules: [{ required: true, message: '请输入产品质保周期!' }],
          })(
            <InputNumber 
            type="text" min={1} 
            formatter={value => `${value}天`}
            parser={value => value.replace('天', '')}
            onChange={this.servicEperiodOnChange} placeholder="请输入产品质保周期!" />
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
class ProductManager extends React.Component {
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
        fetch(productGetPager,this.callbackDate,{pageNO:pager.current,pageSize:pager.pageSize,ifGetCount:1});
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
                "productId": tempArray[i].productId,
                "productName": tempArray[i].productName,
                "productVersion": tempArray[i].productVersion,
                "productPrice": tempArray[i].productPrice,
                "servicechargerate":tempArray[i].servicechargerate,
                "serviceperiod":tempArray[i].serviceperiod,
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
        fetch(productGetPager,this.callbackDate,{pageNO:1,pageSize:10,ifGetCount:1})
    }
    //新建产品
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
        //深拷贝
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

    //删除产品行回调
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
            //表格重新加载数据
            this.componentDidMount();
            Modal.success({
                  title: '成功',
                  content: '删除成功！',
                });
    }
  
    //删除产品
    deleteProduct=(record)=>{
      fetch(productDelete,this.deleteUpdate,{"productId":record.productId});      
    }
 

    render() {
         //产品表 字段
        const Columns = [{
          title: '序号',
          dataIndex: 'serial',
        }, {
          title: '产品ID',
          dataIndex: 'productId',
        },{
          title: '产品名称',
          dataIndex: 'productName',
        },  {
          title: '版本',
          dataIndex: 'productVersion',
        }, {
          title: '市场价(￥)',
          dataIndex: 'productPrice',
        }, {
          title: '服务费',
          dataIndex: 'servicechargerate',
        }, {
          title: '质保期(天)',
          dataIndex: 'serviceperiod',
        }, {
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                    <div>
                        <a onClick={()=>this.editRow(record)}>编辑</a>{" | "} 
                        <Popconfirm placement="left" title="您确认要删除该产品吗？" 
                          onConfirm={()=>this.deleteProduct(record)} 
                          okText="确认" cancelText="取消">
                        <a >删除</a>                      
                        </Popconfirm>
                    </div>
                  );
              }, 
        }];

        return (
            <div>
                <div style={{position:'relative',marginBottom:"5px"}}>
                <h2 style={{display:'inline-block'}}>产品管理</h2>
                <Button type="primary" onClick={this.createNewItem} style={{position:"absolute",right:0}}>添加产品</Button>
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
              title="添加产品"
              //onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
              footer={null}>
               <WrapAddModalForm handleAddCancel={this.handleAddCancel} 
                                 componentDidMount={this.componentDidMount}
                                />
            </Modal>

            <Modal
              visible={this.state.editModal.visibleEdit}
              title="修改产品"
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
export default ProductManager;
