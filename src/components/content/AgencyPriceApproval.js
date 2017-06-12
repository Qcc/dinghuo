import React from 'react';
import { Table,Icon,Button,Modal,Form,Input,InputNumber,Tooltip,Radio } from 'antd';
import {fetch,priceGetPager,priceApproval} from '../../utils/connect';
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
const RadioGroup = Radio.Group;
class AgencyPriceApproval extends React.Component {
    constructor(props) { super(props); }

    state = {
        data: [],
        pagination: { //分页器
                showSizeChanger:true, //是否可设置每页显示多少行
                defaultCurrent:1, //默认页码
                pageSize:10, //页显示多少行
                total:0, //总行数
                showQuickJumper:true, //可快速跳转到指定页码
                pageSizeOptions:['10','50','200','500','1000']//每页可显示多少行
            }, //分页器
        editPrice:{
                visibleEdit:false, //编辑按钮  模态框 是否可见        
                loadingEdit:false,     
                validateStatus:'',
                help:'',
                data:{},//待编辑行对象                                                                   
            },
        loading: false
    };

    handleTableChange = (pagination, filters, sorter) => { //当点击页面下标时，这里传入的pagination.current指向了新页面
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.total =pagination.total;
        this.setState({
            pagination: pager,
        });
        fetch(priceGetPager,this.priceUpdate,{pageNO:pager.current,pageSize:pager.size,ifGetCount:1});
    }

    //编辑表格行
    editRow=(record)=>{
        let state = {...this.state.editPrice};
            state.visibleEdit=true;
            state.data.tempValue=record.value, 
        //深拷屏
        Object.assign(state.data,record);
        //临时存放value 判断value是否有修改
        this.setState({
            editPrice:state,
        });
        console.log("state ",this.state.editPrice.data)
    }

    handlePriceCancel=()=>{
        let state = {...this.state.editPrice};
            state.visibleEdit=false;
            state.loadingEdit=false;            
        this.setState({
            editPrice:state,
        });
    } 

    //获取数据后映射到 table state
    priceUpdate = (data) => {
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
        
        function state(state){
            let s='';
            switch(state){
                case -1 :s='审核不通过';
                    break;
                case 0 :s='待审核';
                    break;
                case 1 :s='审核通过';
                    break;
                default:s='未申请';
            }
            return s;
        }
        let pager = {...this.state.pagination};
            pager.total=data.entity.count;
        let tempArray = data.entity.list;
        let sourceData=[];
        for(let i=0;i<tempArray.length;i++){
              sourceData.push({ 
                "serial":i+1,
                "id":tempArray[i].partner && tempArray[i].partner.id,
                "company":tempArray[i].partner && tempArray[i].partner.company,
                "productName":tempArray[i].product && tempArray[i].product.productName,
                "productVersion":tempArray[i].product && tempArray[i].product.productVersion,
                "productId":tempArray[i].product && tempArray[i].product.productId,                
                "value":tempArray[i].value,               
                "balance":tempArray[i].partner && tempArray[i].partner.balance,                
                "status":state(tempArray[i].state),
                "state":tempArray[i].state,                
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
        fetch(priceGetPager,this.priceUpdate,{pageNO:1,pageSize:10,ifGetCount:1});
    }


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
        this.componentDidMount();
        Modal.success({
              title: '成功',
              content: '价格审核成功。',
        });
    
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.handlePriceCancel();
    if(this.state.editPrice.data.pass === undefined){
        let state = {...this.state.editPrice};
            state.validateStatus = 'error';
            state.help = '请选择是否通过该价格审核.';
        this.setState({
           editPrice:state,
        });
        return;
    }
    fetch(priceApproval,this.onComplate,{"product.productId":this.state.editPrice.data.productId,
        "partner.id":this.state.editPrice.data.id,
        "value":this.state.editPrice.data.value,
         "pass":this.state.editPrice.data.pass},"POST");
  }
  
  onStateChange=(e)=>{
     let state = {...this.state.editPrice}
     state.data.pass =  e.target.value;
     state.validateStatus = '';
     state.help = '';
     this.setState({
        editPrice:state,
     });
  }
    
    render() {
        //伙伴表 字段
        const columns = [,{
          title: '序号',
          dataIndex: 'serial',
        }, {
          title: '代理商',
          dataIndex: 'company',
        },{
          title: '产品名称',
          dataIndex: 'productName',
        },  {
          title: '产品版本',
          dataIndex: 'productVersion',
        }, {
          title: '申请价格',
          dataIndex: 'value',
        }, {
          title: '压款余额',
          dataIndex: 'balance',
        }, {
          title: '价格状态',
          dataIndex: 'status',
        },{
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index) => {
                  return (
                    <div>
                         {record.state === 0?<a onClick={()=>this.editRow(record)}>审核</a>:''}
                    </div> 
                  );
              }, 
        }];

        return(<div>
                <Table bordered columns={columns}
                    rowKey={record => record.serial}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
                    dataSource={this.state.data}
                    pagination={this.state.pagination}  //Table.pagination：分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                    loading={this.state.loading}        //Table.loading：页面是否加载中
                    onChange={this.handleTableChange}  //Table.onChange：分页、排序、筛选变化时触发
                />
                <Modal
                  visible={this.state.editPrice.visibleEdit}
                  title="审核伙伴订货价格"
                  onCancel={this.handlePriceCancel}
                  footer={null}
                >
                   <Form onSubmit={this.handleSubmit} >
                      <FormItem {...formItemLayout} label="公司名称" >
                          <Input type="text" value={this.state.editPrice.data.company} disabled/>            
                      </FormItem>
                  
                      <FormItem {...formItemLayout} label="产品名称" >
                          <Input type="text" value={this.state.editPrice.data.productName} disabled/>
                      </FormItem>
                  
                      <FormItem {...formItemLayout} label="产品版本" >
                          <Input type="phone" value={this.state.editPrice.data.productVersion} disabled />
                      </FormItem>
                  
                      <FormItem {...formItemLayout} label="设置价格" >
                              <InputNumber 
                                disabled
                                style={{width:"150px"}}
                                value={this.state.editPrice.data.value}
                              />
                              <Tooltip title="此处为单价,请确认价格是否合适。">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                      </FormItem>
                     
                      <FormItem {...formItemLayout} 
                          hasFeedback
                          validateStatus={this.state.editPrice.validateStatus}
                          help={this.state.editPrice.help} 
                          label="审核价格" >
                          <RadioGroup onChange={this.onStateChange} value={this.state.editPrice.data.pass}>
                            <Radio value={1}>通过</Radio>
                            <Radio value={0}>不通过</Radio>
                          </RadioGroup>
                      </FormItem>
                     
                      <br />
                      <FormItem>
                      <div style={{textAlign:"center"}}>
                        <Button style={{width:"110px",marginRight:"10px"}} onClick={this.handlePriceCancel}>取消</Button>
                        <Button type="primary" htmlType="submit"  style={{width:"110px"}}>确认</Button>          
                      </div>  
                      </FormItem>
                  
                    </Form>
                </Modal>
                </div>);
    }               
}               

//导出组件              
export default AgencyPriceApproval;
