import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,Select } from 'antd';
import {fetch,partnerCreate,partnerUpdate,partnerDelete,partnerGetPager} from '../../utils/connect';

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

    //添加成功数据后的回调
  onComplate=(data)=>{
    if(!data){
        Modal.error({
              title: '错误',
              content: '服务器错误，伙伴添加失败，请稍后重试！',
            });
            return;
        }
        //表格重新加载数据
    this.props.componentDidMount();
    Modal.success({
              title: '成功',
              content: '添加伙伴成功！',
            });
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
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
          {getFieldDecorator('enail', {
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

        <FormItem>
        <div style={{textAlign:"center"}}>
          <Button type="dashed" style={{width:"130px",marginRight:"10px"}} onClick={this.props.handleAddCancel}>取消</Button>
          <Button type="primary" htmlType="submit"  style={{width:"130px"}}>确定</Button>          
        </div>  
        </FormItem>

      </Form>
    );
  }
}
const WrapAddModalForm = Form.create()(AddModalForm);
class PartnerManagerTable extends React.Component {
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
            },
        deleteModal:{
                visibleDelete:false, //删除按钮  模态框 是否可见
                loadingDelete:false,                                        
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
                "id":tempArray[i].id+1,
                "name":tempArray[i].name,
                "address":tempArray[i].address,
                "company":tempArray[i].company,
                "level":tempArray[i].level,
                "email":tempArray[i].email,
                "phone":tempArray[i].phone,                
                "user":tempArray[i].salesUser.name,
            });
        }
        this.setState({
            loading:false,
            data:sourceData,
            pagination:pager,
        });
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
    componentDidMount() {
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
        console.log(this.state.addModal,state);
    }
    
   
    //添加 编辑 删除 模态框控制
    // handleAddOk=()=>{
    //     let state = {...this.state.addModal};
    //         state.loadingAdd=true;
    //     this.setState({
    //         addModal:state,
    //     });
    // }
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
        this.setState({
            editModal:state,
        });
    }
    handleEditOk=()=>{
        let state = {...this.state.editModal};
            state.loadingEdit=true;
        this.setState({
            editModal:state,
        });
    }
    handleEditCancel=()=>{
        let state = {...this.state.editModal};
            state.visibleEdit=false;
        this.setState({
            editModal:state,
        });
    }    
     //删除表格行
    deleteRow=(record)=>{
        let state = {...this.state.deleteModal};
            state.visibleDelete=true;
        this.setState({
            deleteModal:state,
        });
    }

    handleDeleteOk=()=>{
        let state = {...this.state.deleteModal};
            state.loadingDelete=true;
        this.setState({
            deleteModal:state,
        });
    }
    handleDeleteCancel=()=>{
        let state = {...this.state.deleteModal};
            state.visibleDelete=false;
        this.setState({
            deleteModal:state,
        });
    }


    render() {
         //伙伴表 字段
        const Columns = [{
          title: 'ID',
          dataIndex: 'id',
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
                rowKey={record => record.id}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
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
               <WrapAddModalForm handleAddCancel={this.handleAddCancel} componentDidMount={this.componentDidMount}/>
            </Modal>

            <Modal
              visible={this.state.editModal.visibleEdit}
              title="修改伙伴"
              onOk={this.handleEditOk}
              onCancel={this.handleEditCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleEditCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.editModal.loadingEdit} onClick={this.handleEditOk}>
                  确认
                </Button>,
              ]}
            >
               
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
              <Icon style={{color:"#ffbf00",fontSize:"28px",margin:"20px"}} type="exclamation-circle" /><span>您确认要删除该行记录吗？</span>
            </Modal>
            </div>);
    }
}

//导出组件
export default PartnerManagerTable;
