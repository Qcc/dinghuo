import React from 'react';
import {Button,Icon,Form,Modal,Input,Row,Col } from 'antd';
import {fetch} from '../../utils/connect';
import '../../styles/accountinfo.css';
const FormItem = Form.Item;

//修改密码模态框
class PwdModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modPwdVisible:false, //整个模态框是否可见
            loading:false,//提交按钮 加载中
            oldPwdInputValue: '', //旧密码
            newPwdInputValue: '', //新密码
            newRepPwdInputValue: '', //重复新密码
            validCodeInputValue:'',//验证码
            validateMode: 0, //修改密码错误超过3次需要验证码
            //修改密码表单组件状态
            formValid:{oldpwdValidateStatus:'',
                       oldpwHelp:'',
                       newPwdValidateStatus:'',
                       newPwdHelp:'',
                       repPwdValidateStatus:'',
                       repPwdHelp:'',
                       validateCodeValidateStatus:'',
                       validateCodeHelp:'',
                    }
        };
    }

    //关闭修改密码模态框
    modPwdCancel=(e)=>{this.setState({modPwdVisible:false,loading:false})}
    //打开修改密码模态框，父组件调用
    modPwdOpen=(e)=>{
        this.setState({modPwdVisible:true});
    }
    //清空三个密码框
    emptyAll=()=>{
        this.oldPwdInput.focus();
        this.setState({ 
            oldPwdInputValue: '',
            newPwdInputValue: '',
            newRepPwdInputValue: '' 
                    });             
    }
    //绑定state与input的value
    onChangeOldPwdValue = (e) => {
        this.setState({ oldPwdInputValue: e.target.value });
    }
    //绑定state与input的value
    onChangeNewPwdValue = (e) => {
        this.setState({ newPwdInputValue: e.target.value });
    }
    //绑定state与input的value
    onChangeNewRepPwdValue = (e) => {
        this.setState({ newRepPwdInputValue: e.target.value });
    }
    //绑定验证码输入框
    onChangeValidCodeValue = (e)=>{
        this.setState({ validCodeInputValue: e.target.value });
    } 
    //修改密码回调处理函数
    update =(data)=>{
        this.setState({
            modPwdVisible:false,
            loading:false,
        });
        if(data.status !== 200 || data.errorCode !== 0){
            Modal.error({title: '错误！',content: '密码未修改,'+data.message});
            this.setState({
                    validateMode:this.state.validateMode+1,
                });
            return;
        }else{
            Modal.success({title: '完成！',content: '密码修改成功。'});            
        }
    }
    //确定修改密码
    makeModPwd=(e)=>{
        const {oldPwdInputValue,newPwdInputValue,newRepPwdInputValue,validCodeInputValue,validateMode} = this.state;
        if(!oldPwdInputValue){ //验证是否输入旧密码
            this.setState({
                formValid:{
                    oldpwdValidateStatus:'error',
                       oldpwHelp:'请输入密码',
                }});
            return;
        }else if(!newPwdInputValue){ //验证是否输入新密码
            this.setState({
                formValid:{
                       newPwdValidateStatus:'error',
                       newPwdHelp:'请输入新密码',
                }});
            return;
        }else if(!newRepPwdInputValue){ //验证是否输入确认新密码
            this.setState({
                formValid:{     
                       repPwdValidateStatus:'error',
                       repPwdHelp:'请确认密码',
                    }
            });
            return;
        }else if(this.state.newRepPwdInputValue !== this.state.newPwdInputValue){ //确定新密码两次输入是否一样
                this.setState({
                formValid:{
                       newPwdValidateStatus:'error',
                       newPwdHelp:'两次输入的密码不一致，请检查后重新输入。',
                       repPwdValidateStatus:'error',
                       repPwdHelp:'两次输入的密码不一致，请检查后重新输入。',
                }});
            return;
        }
        if(!(validateMode<3) && !validCodeInputValue){  // 如果有 验证是否输入验证码
            this.setState({
                formValid:{     
                       validateCodeValidateStatus:'error',
                       validateCodeHelp:'请输入验证码',
                    }
            });
            return;
        }
        //接口参数
        let params ={oldPassword:oldPwdInputValue,
                    newPassword:newRepPwdInputValue,
                    validateCode:validCodeInputValue}
        fetch(modifyPassword,this.update,params);
        this.setState({
            loading:true,
            oldPwdInputValue: '', //旧密码
            newPwdInputValue: '', //新密码
            newRepPwdInputValue: '', //重复新密码
            validCodeInputValue:'',//验证码
            //修改密码表单组件状态
            formValid:{oldpwdValidateStatus:'',
                       oldpwHelp:'',
                       newPwdValidateStatus:'',
                       newPwdHelp:'',
                       repPwdValidateStatus:'',
                       repPwdHelp:'',
                       validateCodeValidateStatus:'',
                       validateCodeHelp:'',
                    }
        });
        this.refreshValidateCode();//刷新验证码
    }
    //刷新验证码
    refreshValidateCode = (e) => {
        var img = document.getElementById('validate-code-img');
        if(img){
            img.src = validateCodeImgURL + "?nocache=" + new Date().getTime();
        }
    }
    //验证码Form.Item 输入密码错误三次 需要输入验证码
    visibaleValidateCode=()=>{
        if(this.state.validateMode<3)return;
        return(
            <FormItem
               label="验证码"
               hasFeedback
               validateStatus={this.state.formValid.validateCodeValidateStatus}
               help={this.state.formValid.validateCodeHelp}
               >
                <Row gutter={8}>
                    <Col span={12}>  
                        <Input 
                            value={this.state.validCodeInputValue}
                            onChange={this.onChangeValidCodeValue}
                            ref={node => this.validCodeInput = node}
                            prefix={<Icon type="question-circle-o" style={{ fontSize: 13 }} />} placeholder="验证码" />
                    </Col>
                    <Col span={12}>
                        <img src={validateCodeImgURL} id="validate-code-img" title="点击刷新验证码" alt="验证码" style={{cursor: "pointer"}} onClick={this.refreshValidateCode} />
                    </Col>
                </Row>
            </FormItem>
                );
    }
    render(){
        const { oldPwdInputValue,newPwdInputValue,newRepPwdInputValue} = this.state;
        return(
        <Modal title="需要验证当前密码才能继续"
           maskClosable={false} //点击遮罩层不允许关闭模态框 
           visible={this.state.modPwdVisible} //模态框是否可见
           onCancel={this.modPwdCancel}
           footer={<div>
                     <Button size='large' onClick={this.modPwdCancel}>取消</Button>
                     <Button size='large'  type="dashed" onClick={this.emptyAll}>重置</Button>
                     <Button size='large'  type="primary" 
                        loading={this.state.loading} 
                        onClick={this.makeModPwd} >确定</Button></div>}
           > 
           <Form>
                <FormItem
                    label="旧密码"
                    hasFeedback
                    validateStatus={this.state.formValid.oldpwdValidateStatus}
                    help={this.state.formValid.oldpwHelp}
                    >
                    <Input
                        style={{marginTop:5,marginBottom:5}}
                        placeholder="请输入密码"
                        type='password'
                        prefix={<Icon type="unlock" />}
                        value={oldPwdInputValue}
                        onChange={this.onChangeOldPwdValue}
                        ref={node => this.oldPwdInput = node}
                />
                </FormItem>
                <FormItem
                    label="新密码"
                    hasFeedback
                    validateStatus={this.state.formValid.newPwdValidateStatus}
                    help={this.state.formValid.newPwdHelp}
                    >
                    <Input
                        style={{marginTop:5,marginBottom:5}}
                        placeholder="请输入新密码,建议6~14位"
                        type='password'
                        prefix={<Icon type="unlock" />}
                        value={newPwdInputValue}
                        onChange={this.onChangeNewPwdValue}
                        ref={node => this.newPwdInput = node}
                />
                </FormItem>
                <FormItem
                    label="确认密码"
                    hasFeedback
                    validateStatus={this.state.formValid.repPwdValidateStatus}
                    help={this.state.formValid.repPwdHelp}
                    >
                <Input
                    style={{marginTop:5,marginBottom:5}}
                    placeholder="请确认密码，6~14位"
                    type='password'
                    prefix={<Icon type="unlock" />}
                    value={newRepPwdInputValue}
                    onChange={this.onChangeNewRepPwdValue}
                    ref={node => this.newRepPwdInput = node}
                />
                </FormItem>
                    {this.visibaleValidateCode()} 
            </Form>
        </Modal>
        );
    }
}

class AccountInfo extends React.Component{
    state = {
        account:'销售经理',
        company:'', //代理商公司名称
        phone:'',
        contact:'',
        avatar:require('../../assets/avatar.jpg'), //用户头像
        level:'销售经理',
    }

    infoUpdate=(data)=>{
        this.setState({
            company:data.entity.name,
            phone:data.entity.phone,
        });
    }
    accountUpdate=(data)=>{
        this.setState({
            contact:data.entity.name,
        });
    }
    componentDidMount() {
        //fetch(partenrInfo,this.infoUpdate);
        //fetch(partenrAccount,this.accountUpdate);        
    }
    //弹出修改密码模态框,以下三行调用的是同ref回调传入父组件中的 子组件的引用
    modPwdClick=(e)=>{this.userModPwdModal.modPwdOpen();}
    //弹出修改邮箱模态框
    modMailClick=(e)=>{this.userModMailModal.modMailOpen();}
    //弹出修改安全问题模态框
    securityQuestionClick=(e)=>{this.userModSecurityModal.modSecurityOpen();}

    render(){
        return(
                <div >
                    <div style={{borderBottom:"1px solid #ccc"}}>
                        <h2 style={{display:"inline-block"}}>账户信息</h2> 
                        <Button disabled style={{float:"right"}}><Icon type="edit" />编辑</Button>
                    </div>
                    <div style={{position:"relative",width: "150px",height: "150px",margin: "10px",display:"inline-block"}}>
                        <img style={{position:"absolute",left: "50%",top: "50%",marginLeft: "-40px",marginTop: "-40px"}} src={this.state.avatar} alt='头像'/>
                    </div>
                    <div  style={{display: "inline-block"}}>
                        <div style={{margin: "30px 0"}}><span className='usermod-info-title'>职位 : </span><span>{this.state.account}</span><br/></div>
                        <div style={{margin: "30px 0"}}><span className='usermod-info-title'>所属部门 : </span><span>{this.state.company}</span><br/></div>
                        <div style={{margin: "30px 0"}}><span className='usermod-info-title'>手机 : </span><span>{this.state.phone}</span><br/></div>
                        <div style={{margin: "30px 0"}}><span className='usermod-info-title'>姓名: </span><span>{this.state.contact}</span><br/></div>                                                
                    </div>
                    <div style={{borderBottom:"1px solid #ccc"}}>
                        <h2 style={{display:"inline-block"}}>账户安全</h2>
                    </div>
                    <div>
                        <div style={{position: "relative",margin: "40px 0",padding: "5px 0",borderBottom: "1px solid #eee"}}>
                            <Icon style={{marginRight:"20px",fontSize:"36px",display: "inline-block"}} type="unlock" />
                            <div style={{display: "inline-block"}}>
                                <h3>帐号密码</h3>
                                <p>用于保护帐号信息和登录安全</p>
                            </div>
                            <Button style={{position: "absolute",right: "10px"}} onClick={this.modPwdClick}>修改</Button>
                        </div>
                        <div style={{position: "relative",margin: "40px 0",padding: "5px 0",borderBottom: "1px solid #eee"}}>
                            <Icon style={{marginRight:"20px",fontSize:"36px",display: "inline-block"}} type="mail" />
                            <div style={{display: "inline-block"}}>
                                <h3>邮箱安全</h3>
                                <p>安全邮箱可以用于登录，找回密码，修改其他密保信息，接收授权之用</p>
                            </div>
                            <Button style={{position: "absolute",right: "10px"}} disabled onClick={this.modMailClick}>修改</Button>
                        </div>
                        <div style={{position: "relative",margin: "40px 0",padding: "5px 0",borderBottom: "1px solid #eee"}}>
                            <Icon style={{marginRight:"20px",fontSize:"36px",display: "inline-block"}} type="solution" />
                            <div style={{display: "inline-block"}}>
                                <h3>密保问题</h3>
                                <p>密保问题，可用于找回密码，验证身份之用</p>
                            </div>
                            <Button style={{position: "absolute",right: "10px"}} disabled onClick={this.securityQuestionClick}>修改</Button>
                        </div>                                            
                    </div>
                    <PwdModal  ref={node=>this.userModPwdModal=node}></PwdModal>
                    </div>
                    // ref 属性为回调，将子组件的引用传回到父组件的一个属性中，这样父组件通过该属性就可以操作子组件了。
                    
        );
    }
}

export default AccountInfo;