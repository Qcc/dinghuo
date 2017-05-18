import React from 'react';
import { Form, InputNumber, Input,Col,Button,Select,Tooltip,Icon,Modal } from 'antd';
import {fetch,fetch2,orderCreate,partnerGetPager} from '../../utils/connect';
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

const children=[];

class CreateOrder extends React.Component{
    constructor(props){
        super(props);
        this.state={
           loading:false,  //提交按钮加载icon
           submit:false,  // 订单是否重复
           data:{
                partner:{id:null},
                product:{productId:3},
                points:50,
                money:null,
                comment:'',
            },
            partnerIdValid:"",
            partnerIdHelp:"",            
            pointsValid:"",
            pointsHelp:"",            
            moneyValid:"",
            moneyHelp:"",            
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
                children.push(<Option key={list[i].id}>{list[i].company}</Option>);
            }
        } 
    }
    componentDidMount=()=>{
        fetch(partnerGetPager,this.partnerListUpdata,{pageNO:1,pageSize:1000,ifGetCount:1})
    }
    //选择公司
    handlePartnerChange=(value)=>{
        let state = {...this.state.data};
            state.partner.id = +value;
            this.setState({
                data:state,
                partnerIdValid:"",
                partnerIdHelp:"",
                submit:false,        
            });
    }
    //选择产品
    handleProductChange=(value)=>{
        let state = {...this.state.data};
            state.product.productId=value;
            this.setState({
                data:state,
                submit:false,
            });
    }
   //设置站点数
   handlePointsChange=(value)=>{
     let state = {...this.state.data}
     state.points=value;
     this.setState({
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
        if(!this.state.data.partner.id){
            this.setState({
                partnerIdValid:"error",
                partnerIdHelp:"代理商公司名称不能为空", 
            });
            flag=false;
        }
        if(!this.state.data.points){
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
        if(flag){
            this.setState({
                loading:true,
            });
            fetch2(orderCreate,this.orderCreateUpdata,this.state.data)
        }
    }

    render(){
        return(<Form onSubmit={this.handleSubmit} >
                <FormItem
                  {...formItemLayout}
                  label="代理商"
                  required
                  validateStatus={this.state.partnerIdValid}
                  help={this.state.partnerIdHelp}
                >
                    <Select
                       showSearch
                       style={{ width: 200 }}
                       style={{ width: '100%' }}
                       onChange={this.handlePartnerChange}
                       filterOption={(value, option) => option.props.children.indexOf(value)!=-1}
                     >
                       {children}
                     </Select>
                </FormItem>
            
                <FormItem
                  {...formItemLayout}
                  label="产品"
                  required
                >
                  <Select defaultValue='沟通云桌面' style={{ width: 150 }} onChange={this.handleProductChange}>
                      <Option value={3}>沟通云桌面</Option>
                      <Option value={1}>CTBS高级版</Option>
                      <Option value={2}>CTBS企业版</Option>
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
                  <InputNumber onChange={this.handlePointsChange} defaultValue={this.state.data.points} min={1} max={10000} style={{ width: 150 }}  />
                </FormItem>
            
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
                                max={10000}
                                style={{width:"150px"}}
                                defaultValue={this.state.data.money}
                                formatter={value => `￥ ${value}`}
                                parser={value => value.replace(/\￥\s?/g, '')}
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
                  <Input defaultValue={this.state.data.comment} onChange={this.onCommentChange} type="textarea" rows={4} placeholder="订单特别说明" id="tips" />
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