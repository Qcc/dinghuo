import React from 'react';
import { Form, InputNumber, Input,Col,Button,Select,Tooltip,Icon,Modal,Radio } from 'antd';
import {fetch,fetch2,orderCreate,partnerGetPager,customerGetPager,productGetPager,rechargeCreate} from '../../utils/connect';
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const childrenProduct=[];
const childrenPartner=[];
const childrenCustomer=[];

class CreateOrder extends React.Component{
    constructor(props){
        super(props);
        this.state={
           loading:false,  //提交按钮加载icon
           submit:false,  // 订单是否重复
           orderType:'partnerOrder',
           data:{},
           partnerIdValid:"",
           partnerIdHelp:"",            
           pointsValid:"",
           pointsHelp:"",
           productIdValid:"",
           productIdHelp:"",
           customerIdValid:"",
           customerIdHelp:"",           
           moneyValid:"",
           moneyHelp:"", 
           //表单数据
           partner:"",
           points:"",
           product:"",
           customer:"",
           money:"",
           comment:"",           
        }
    }

    partnerListUpdata=(data)=>{
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
                childrenPartner.push(<Option key={list[i].id}>{list[i].company}</Option>);
            }
        } 
    }
    customerListUpdata=(data)=>{
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
                childrenCustomer.push(<Option key={list[i].id}>{list[i].company}</Option>);
            }
        } 
    }
    productListUpdata=(data)=>{
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
                childrenProduct.push(<Option key={list[i].productId}>{list[i].productName}</Option>);
            }
        } 
    }
    componentDidMount=()=>{
        fetch(partnerGetPager,this.partnerListUpdata,{pageNO:1,pageSize:1000,ifGetCount:1});
        fetch(customerGetPager,this.customerListUpdata,{pageNO:1,pageSize:10000,ifGetCount:1});     
        fetch(productGetPager,this.productListUpdata,{pageNO:1,pageSize:1000,ifGetCount:1});                  
    }
    //选择公司
    handlePartnerChange=(value)=>{
        let state = {...this.state.data};
            state.partner={id:+value};
            this.setState({
                partner:value,
                data:state,
                partnerIdValid:"",
                partnerIdHelp:"",
                submit:false,        
            });
    }
    //选择客户
    handleCustomerChange=(value)=>{
        let state = {...this.state.data};
            state.customer = {id:+value};
            this.setState({
                customer:value,
                data:state,
                customerIdValid:"",
                customerIdHelp:"",
                submit:false,        
            });
    }
    //选择产品
    handleProductChange=(value)=>{
        let state = {...this.state.data};
            state.product={productId:+value};
            this.setState({
                product:value,
                data:state,
                productIdValid:"",
                productIdHelp:"",
                submit:false,
            });
    }
   //设置站点数
   handlePointsChange=(value)=>{
     let state = {...this.state.data}
     state.points=value;
     this.setState({
         points:value,
        data:state,
        pointsValid:"",
        pointsHelp:"",
        submit:false,        
     });  
   }
  //设置价格
  onPriceChange=(value)=>{
     let state = {...this.state.data}
     state.money=value;
     this.setState({
         money:value,
        data:state,
        moneyValid:"",
        moneyHelp:"", 
        submit:false,        
     });
    }
    //设置备注
  onCommentChange=(e)=>{
     let state = {...this.state.data}
     state.comment=e.target.value;
     this.setState({
         comment:e.target.value,
        data:state,
     });
    }
    //获取订单列表回调
    orderCreateUpdata=(data)=>{
        this.setState({
            loading:false,
            submit:true,
        });
           if(data === null){
    Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
    return;    
    };
    if(data.errorCode !== 0){
        Modal.error({title: '错误！',content:'服务器错误,'+data.message});
        return;
    }
     
        //成功拿到数据
        Modal.success({
              title: '成功',
              content: '创建订单成功！等待财务审核。',
        });
        
     
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        if(this.state.submit){
            Modal.error({
              title: '错误',
              content: '请不要重复提交订单！',
            });
            return;
        }
        let flag=true;
        if(!this.state.data.partner && this.state.orderType !== "customerOrder"){
            this.setState({
                partnerIdValid:"error",
                partnerIdHelp:"客户公司名称不能为空", 
            });
            flag=false;
        }
        if(!this.state.data.points && this.state.orderType !== "partnerCashOrder"){
            this.setState({
                pointsValid:"error",
                pointsHelp:"站点数不能为空", 
            });
            flag=false;
        }
        if(!this.state.data.money){
            this.setState({
                moneyValid:"error",
                moneyHelp:"金额不能为空", 
            });
            flag=false;
        }
        if(!this.state.data.product && this.state.orderType !== "partnerCashOrder"){
            this.setState({
                productIdValid:"error",
                productIdHelp:"请选择产品！", 
            });
            flag=false;
        }
        if(!this.state.data.customer && this.state.orderType === "customerOrder"){
            this.setState({
                customerIdValid:"error",
                customerIdHelp:"请选择终端客户！", 
            });
            flag=false;
        }
        if(flag){
            this.setState({
                loading:true,
            });
        fetch2(orderCreate,this.orderCreateUpdata,this.state.data)
        }
    }
    //订单类型
    handleFormLayoutChange = (e) => {
        this.setState({ 
            data:{}, 
            orderType: e.target.value, 
            partner:"",
            points:"",
            product:"",
            customer:"",
            money:"",
           comment:"",                       
        });
    }
    dynamicForm=()=>{
        
        if(this.state.orderType === "partnerOrder"){
            return(
                <div>
                <FormItem
                  {...formItemLayout}
                  label="代理商"
                  required
                  validateStatus={this.state.partnerIdValid}
                  help={this.state.partnerIdHelp}
                >
                    <Select
                       showSearch
                       value={this.state.partner}                       
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       onChange={this.handlePartnerChange}
                       filterOption={(value, option) => option.props.children.indexOf(value)!=-1}
                     >
                       {childrenPartner}
                     </Select>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="产品"
                  validateStatus={this.state.productIdValid}
                  help={this.state.productIdHelp}
                  required
                >
                  <Select
                       value={this.state.product}                  
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       onChange={this.handleProductChange}
                     >
                       {childrenProduct}
                  </Select>
                </FormItem>
            
                <FormItem
                  {...formItemLayout}
                  label="站点数"
                  hasFeedback
                  required
                  validateStatus={this.state.pointsValid}
                  help={this.state.pointsHelp}
                >
                  <InputNumber onChange={this.handlePointsChange} value={this.state.points} min={1} max={10000} style={{ width: 150 }}  />
                </FormItem>
                </div>
            );
        }else if(this.state.orderType === "partnerCashOrder"){
            return(
                <FormItem
                  {...formItemLayout}
                  label="代理商"
                  required
                  validateStatus={this.state.partnerIdValid}
                  help={this.state.partnerIdHelp}
                >
                    <Select
                       showSearch
                       value={this.state.partner}
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       onChange={this.handlePartnerChange}
                       filterOption={(value, option) => option.props.children.indexOf(value)!=-1}
                     >
                       {childrenPartner}
                     </Select>
                </FormItem>
            );

        }else if(this.state.orderType === "customerOrder"){
            return(
                <div>
                <FormItem
                  {...formItemLayout}
                  label="客户名称"
                  required
                  validateStatus={this.state.customerIdValid}
                  help={this.state.customerIdHelp}
                >
                    <Select
                       showSearch
                       value={this.state.customer}                       
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       onChange={this.handleCustomerChange}
                       filterOption={(value, option) => option.props.children.indexOf(value)!=-1}
                     >
                       {childrenCustomer}
                     </Select>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="产品"
                  required
                  validateStatus={this.state.productIdValid}
                  help={this.state.productIdHelp}
                >
                   <Select
                       value={this.state.product}                   
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       onChange={this.handleProductChange}
                     >
                       {childrenProduct}
                     </Select>
                </FormItem>
            
                <FormItem
                  {...formItemLayout}
                  label="站点数"
                  hasFeedback
                  required
                  validateStatus={this.state.pointsValid}
                  help={this.state.pointsHelp}
                >
                  <InputNumber onChange={this.handlePointsChange} value={this.state.points} min={1}  style={{ width: 150 }}  />
                </FormItem>
                </div>
            );
        }   
    }  

    render(){
        return(<Form onSubmit={this.handleSubmit} >
                <FormItem
                       required
                   label="订单类型"
                   {...formItemLayout}
                 >
                   <Radio.Group defaultValue="partnerOrder" onChange={this.handleFormLayoutChange}>
                     <Radio.Button value="partnerOrder">伙伴订货</Radio.Button>
                     <Radio.Button value="partnerCashOrder">伙伴压款</Radio.Button>
                     <Radio.Button value="customerOrder">直销客户</Radio.Button>
                   </Radio.Group>
                 </FormItem>
                {this.dynamicForm()}
                <FormItem
                  {...formItemLayout}
                  label="总金额"
                  hasFeedback
                  required
                  validateStatus={this.state.moneyValid}
                  help={this.state.moneyHelp}
                >
                  <InputNumber 
                                min={0}
                                style={{width:"150px"}}
                                value={this.state.money}
                                formatter={value => `￥${value}`}
                                parser={value => value.replace('￥', '')}
                                onChange={this.onPriceChange}
                              />
                              <Tooltip title="此处为总价,请设置一个购买所有站点的总金额。">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                </FormItem>
            
                <FormItem
                  {...formItemLayout}
                  label="备注"
                >
                  <Input value={this.state.comment} onChange={this.onCommentChange} type="textarea" rows={4} placeholder="订单特别说明" id="tips" />
                </FormItem>
                <br/>
                <FormItem>
                  <div style={{textAlign:"center"}}>
                        <Button type='primary' loading={this.state.loading}  htmlType="submit" style={{width:"250px"}}>确定</Button>                   
                    </div> 
                </FormItem>
        </Form>);
    }
}

export default CreateOrder;