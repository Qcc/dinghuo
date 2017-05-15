import React from 'react';
import {Button,Table, Input,InputNumber,Date, 
        Icon,Modal,Form,Radio,Tooltip} from 'antd';
import {licenseCountPager,generateTrail,getSumDelayDays,addUserNumberAndDelay,fetch} from '../../utils/connect';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
//修改授权码模态框
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

//复制申请的临时授权码，小按钮
class CopyIcon extends React.Component{
    state={
        product:this.props.cdk.product?this.props.cdk.product.productName:'null',
        cdk:this.props.cdk.key,
        number:this.props.cdk.userNumber,
        trail:this.props.cdk.isTrail == 1?'临时授权':'正版授权',
        date:this.props.cdk.expirationDate,
        copy:'复制',
        icon:'copy',
    }
    //props参数校验
    static propTypes = {
        cdk: React.PropTypes.object.isRequired,
    };
    handleCopy=(e)=>{
      var txt=document.getElementById("cdkey");
      txt.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.setState({
          copy:'已复制',
          icon:'check',
        });
    }
    handleMoseOut=()=>{
      this.setState({
        copy:'复制授权',
        icon:'copy',        
      });
    }

    render(){
      return(
           <div  onMouseOut ={this.handleMoseOut} style={{textAlign:"center",position:"relative"}}>
              <Input type="textarea" cols="20" rows="5" id="cdkey" 
                  value= {
                 "适用产品:"+this.state.product +
                  "\n授权码:"+this.state.cdk +
                  "\n用户数:"+this.state.number +
                  "\n类型:"+this.state.trail +
                  "\n过期时间:"+this.state.date
                }/>
                <br />
                <Tooltip  placement="topRight" title={this.state.copy}>
                  <Icon style={{position:"absolute",top:"10px",right:"10px"}} 
                        onClick={this.handleCopy} 
                        type={this.state.icon}/>
                </Tooltip>
           </div>
      );
    }
}


//申请临时授权界面
class AskTemlLicModal extends React.Component{
  constructor(){
    super();
    this.state={
      askTempLoading: false, //修改申请授权模态框加载状态
      askTempVisible: false, //修改申请模态框是否可见
      productId:3,// 1.CTBS高级版 2.CTBS企业版 3.云桌面
      endUserCompany:'',//终端用户公司名称
      endUserEmail:'',//终端用户邮箱
      endUserName:'',//终端用户联系人
      endUserPhone:'',//终端用户电话
      userCompanyValid:'',
      userCompanyHelp:'',
      emailValid:'',
      emailHelp:'',
      nameValid:'',
      nameHelp:'',
      phoneValid:'',
      phoneHelp:'',
    };
  }
  
  //表单input数据映射到state
  endUserCompany=(e)=>{this.setState({endUserCompany:e.target.value});}
  endUserEmail=(e)=>{this.setState({endUserEmail:e.target.value});}
  endUserName=(e)=>{this.setState({endUserName:e.target.value});}
  endUserPhone=(e)=>{this.setState({endUserPhone:e.target.value});}

  //显示申请临时授权模态框界面
  showModal = () => {
    this.setState({
      askTempVisible: true,
    });
  }
 //申请临时授权回调
  trailUpdate=(data)=>{
    console.log("申请临时授权码："+JSON.stringify(data,null,4));
    this.setState({ askTempLoading: false, askTempVisible: false });
    if(!data){
      Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
      return;    
    };
     Modal.success({title: '成功！',content:<CopyIcon cdk={data.entity}/>});
     //申请成功，清除表单数据。
     this.setState({
      endUserCompany:'',//终端用户公司名称
      endUserEmail:'',//终端用户邮箱
      endUserName:'',//终端用户联系人
      endUserPhone:'',//终端用户电话
     });  
  }
  //确认申请临时授权
  handleOk = () => {
    let {productId,
         endUserCompany,
         endUserEmail,
         endUserName,
         endUserPhone,
         userCompanyValid,
         emailValid,
         nameValid,
         phoneValid,
        }=this.state;
    this.setState({ askTempLoading: true });
    //用户信息必填
    if(endUserCompany !== ''){
      userCompanyValid='success';
      this.setState({
        userCompanyValid:'success',
      });
    }else{
      this.setState({
        userCompanyValid:'error',
        userCompanyHelp:'请输入用户公司名称',
        askTempLoading: false,
      });
    }
    if(endUserEmail !== ''){
         emailValid='success';
      this.setState({
        emailValid:'success',
      });
    }else{
      this.setState({
        emailValid:'error',
        emailHelp:'请输入用户邮箱',
        askTempLoading: false,
      });
      }
    if(endUserName !== ''){
         nameValid='success';
      this.setState({
        nameValid:'success',
      });
    }else{
      this.setState({
        nameValid:'error',
        nameHelp:'请输入用户姓名',
        askTempLoading: false,
      });
      }
    if(endUserPhone !== ''){
         phoneValid='success';
      this.setState({
        phoneValid:'success',
      });
    }else{
      this.setState({
        phoneValid:'error',
        phoneHelp:'请输入用户手机号码',
        askTempLoading: false,
      });
    }
    if(userCompanyValid ==='success' && emailValid ==='success' && nameValid ==='success' && phoneValid ==='success'){    
      let params = {productId:productId,
          endUserCompany:endUserCompany,
          endUserEmail:endUserEmail,
          endUserName:endUserName,
          endUserPhone:endUserPhone,}
          //请求数据
          fetch(generateTrail,this.trailUpdate,params);
      }

  }
  //取消申请临时授权
  handleCancel = () => {
    this.setState({ askTempVisible: false });
  }
  //选择申请授权的产品
  handleProductChange = (e)=>{
    this.setState({
      productId: e.target.value,
    });
  }
  render() {
    return (
       <Modal
        visible={this.state.askTempVisible}
              title="申请临时授权"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.askTempLoading} onClick={this.handleOk}>
                  申请
                </Button>,
              ]}>
               <Form>
                   <FormItem
                     {...formItemLayout}
                     label="产品"
                     required
                     validateStatus="success"
                   >
                       <RadioGroup onChange={this.handleProductChange} value={this.state.productId}>
                          <Radio value={3}>沟通云桌面</Radio>
                          <Radio value={1}>CTBS高级版</Radio>
                          <Radio value={2}>CTBS企业版</Radio>
                        </RadioGroup>
                   </FormItem>
                 
                   <FormItem
                     {...formItemLayout}
                     required
                     label="站点数"
                     hasFeedback
                     validateStatus="success"
                   >
                     <InputNumber disabled defaultValue={3} min={1} max={100}  id="validating" />
                   </FormItem>
                 
                   <FormItem
                     {...formItemLayout}
                     label="试用时间(天)"
                     required
                     hasFeedback
                     validateStatus="success"
                   >
                     <InputNumber disabled defaultValue={15} min={1} max={15}  id="validating" />
                   </FormItem>
                   
                   <FormItem
                     {...formItemLayout}
                     label="公司名称"
                     required
                     hasFeedback
                     validateStatus={this.state.userCompanyValid}
                     help={this.state.userCompanyHelp}
                   >
                     <Input onChange={this.endUserCompany} value={this.state.endUserCompany} placeholder="客户公司名称" id="error" />
                   </FormItem>
                   
                   <FormItem
                     {...formItemLayout}
                     label="邮箱"
                     hasFeedback
                     required
                     validateStatus={this.state.emailValid}
                     help={this.state.emailHelp}
                   >
                     <Input onChange={this.endUserEmail} value={this.state.endUserEmail} placeholder="客户邮箱" id="warning" />
                   </FormItem>

                   <FormItem
                     {...formItemLayout}
                     label="联系人"
                     hasFeedback
                     required
                     validateStatus={this.state.nameValid}
                     help={this.state.nameHelp}
                   >
                     <Input onChange={this.endUserName} value={this.state.endUserName} placeholder="客户联系人" id="error" />
                   </FormItem>
                   
                   <FormItem
                     {...formItemLayout}
                     label="手机"
                     hasFeedback
                     required
                     validateStatus={this.state.phoneValid}
                     help={this.state.phoneHelp}
                   >
                     <Input onChange={this.endUserPhone} value={this.state.endUserPhone} placeholder="客户手机" id="error" />
                   </FormItem>
             </Form>
             <div style={{border: "1px #f50 dashed",padding: "5px",margin: "0 30px"}}>
                <p><span style={{color: "#f50"}}>提示 ：</span>请务必将信息正确填写完整，当前填写信息将作为以后找回授权码、解除绑定等重要操作的依据。</p>
             </div>
        </Modal>
    );
  }
}



class ModCdkModal extends React.Component{
    constructor(){
    super();
    this.state={
      modCdkloading: false, //修改授权模态框加载状态
      modCdkvisible: false, //修改授权模态框是否可见
      defaultExpirationDate:0, //默认延期0天
      newExpirationDate:'',//新的有效期
      remainingDate:15,//剩余可延期的天数
      allowDay:15, //默认允许延期的最大天数 
      //每行CDK数据
      activation:"",
      endUserCompany:"",
      expirationDate:"",
      key:"",
      productName:"",
      userNumber:'',
      oldNumber:'',//保存原始站点数
    }
  }

  //props参数校验
    static propTypes = {
        modTableCdk: React.PropTypes.func.isRequired,
    };
  //获取延期天数回调
  extensionDay=(data)=>{
    if(data.errorCode ===0){
      this.setState({
        remainingDate:data.entity[0],//剩余可延期的天数
        allowDay:data.entity[1], //默认允许延期的最大天数
        modCdkloading: false, //修改授权模态框加载状态 
      });
    }
  }
  

  //显示修改cdkey模态框界面
  showModal = (record) => {
    fetch(getSumDelayDays,this.extensionDay,{"licKey":record.key});//请求还可延期的天数    
    this.setState({
      modCdkloading:true, 
      activation:record.activation,//是否激活
      endUserCompany:record.endUserCompany, //客户公司名称
      expirationDate:record.expirationDate,//到期时间
      newExpirationDate:record.expirationDate,//延期后 新的有效期
      key:record.key,//授权码
      productName:record.productName, //产品版本
      userNumber:record.userNumber,//激活数
      oldNumber:record.userNumber,//保存原始站点数     
      modCdkvisible: true,
    });
    console.log("模态框--完",this.state.cdk);
  }
  //授权站点数与延期
  onUserNumberChange=(value)=>{this.setState({ userNumber: value });}
  onExpirationDateChange=(value)=>{ 
    this.setState({ 
      defaultExpirationDate: value,
      newExpirationDate:this.handleDate(value,this.state.expirationDate),
    });
}  

  //加点 延期，回调处理
  numberAndDelayUpdate=(data)=>{
    this.setState({modCdkloading:false});    
    if(data.status !== 200){
      Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
      return;    
    };
    if(data.errorCode === 0){
      Modal.success({title: '成功！',content:'操作完成！'});
      //通过父组件 表格传入的 props 函数更新表格
      this.props.modTableCdk(this.state.key,this.state.newExpirationDate,this.state.userNumber);
      }else{
        Modal.error({title: '错误！',content:'服务器错误,'+data.message});      
      }
    this.handleCancel();      
  }
  //修改完成后，当点击保存按钮时，更新cdkey
  handleOk = () => {
    this.setState({ modCdkloading: true });
    let params = {};
    if(this.state.defaultExpirationDate){
      params.licKey=this.state.key;
      params.delayDays=this.state.defaultExpirationDate;
    }
    if(this.state.userNumber !== this.state.oldNumber){
      params.licKey=this.state.key;      
      params.addUserNumber = this.state.userNumber;
    }
    if(params.licKey){
      fetch(addUserNumberAndDelay,this.numberAndDelayUpdate,params);
    }else{
      this.handleCancel();
    }
  }
  //取消修改
  handleCancel = () => {
    this.setState({ 
      modCdkvisible: false, //修改授权模态框是否可见
      defaultExpirationDate:0, //默认延期0天
      newExpirationDate:'',//新的有效期
      remainingDate:15,//剩余可延期的天数
      allowDay:15, //默认允许延期的最大天数 
      //每行CDK数据
      activation:"",
      endUserCompany:"",
      expirationDate:"",
      key:"",
      productName:"",
      userNumber:'',
      oldNumber:'',
       });
  }
  //日期处理,根据输入的天数，返回延期后的日期，从当前日期开始算
  handleDate=(day,expirationDate)=>{
    let oldTime = new Date(expirationDate).getTime();
    let nowTime = new Date().getTime();  
    //如果授权已过期，根据当前时间延期
    let oldMillisecond = oldTime<nowTime?nowTime:oldTime;
    let dayMillisecond = day*(1000*60*60*24);
    let newDate = new Date(oldMillisecond+dayMillisecond);
    return newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
  }

  render(){
    return(
      <Modal
              visible={this.state.modCdkvisible}
              title="授权加点与延期"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.modCdkloading} onClick={this.handleOk}>
                  保存
                </Button>,
              ]}>
               
              <Form>
                 <FormItem
                   {...formItemLayout}
                   label="用户"
                   hasFeedback
                   validateStatus="success"
                   required
                 >
                   <Input id="user" disabled value={this.state.endUserCompany} />
                 </FormItem>
            
                 <FormItem
                    {...formItemLayout}
                    label="产品"
                    hasFeedback
                    validateStatus="success"
                    required
                  >
                    <Input id="product" disabled value={this.state.productName} />
                  </FormItem>
                  
                  <FormItem
                   {...formItemLayout}
                   label="授权码"
                   hasFeedback
                   validateStatus="success"
                   required
                 >
                   <Input id="cdk" disabled value={this.state.key}/>
                 </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="站点数"
                    hasFeedback
                    validateStatus="warning"
                    required
                  >
                    <InputNumber min={1} max={100} id="license" 
                      onChange={this.onUserNumberChange}
                      value={this.state.userNumber} /><span>可授权站点范围1~100</span>
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="延期天数"
                    hasFeedback
                    validateStatus="warning"
                    required
                  >
                    <InputNumber min={0} max={this.state.remainingDate} id="license" 
                        value={this.state.defaultExpirationDate}
                        onChange={this.onExpirationDateChange} 
                        /><span>{this.state.defaultExpirationDate?`有效期至${this.state.newExpirationDate}`
                              :`还可延期${this.state.remainingDate}天`}</span>
                  </FormItem>
                  <FormItem
                   {...formItemLayout}
                   label="激活状态"
                   required
                 >
                     <Radio.Group disabled value={this.state.activation}>
                      <Radio value="已激活">已激活</Radio>
                      <Radio value="未激活">未激活</Radio>
                    </Radio.Group>
                 </FormItem>
               </Form>
               <div className='temp-lic-tips'><p><span>提示 ：</span>临时授权站点数最少1个最多可授权100个站点，每个授权最多只能延期15天(累计)。</p></div>
            </Modal>
    );
  }
}

//数据表
class FilterTable extends React.Component {
  constructor(){
    super();
    this.state = {
      filterCdkVisible:false, //cdk筛选input 是否可见
      filterCustomerVisible: false,  //客户名称筛选input是否可见
      searchCdkText: '', //筛选CDK input value
      searchCustomerText: '',  //筛选客户名称 input value  
      cdkFiltered: false, //cdk筛选cdk input value
      customerFiltered: false, //客户名称筛选 input value
      loading: false, //表格加载状态
      doubleClick:false,//模拟表格双击事件
      pagination: { //分页器
                    showSizeChanger:true, //是否可设置每页显示多少行
                    defaultCurrent:1, //默认页码
                  // defaultPageSize:5,//默认每页显示多少行
                    pageSize:10, //页显示多少行
                    total:0, //总行数
                    showQuickJumper:true, //可快速跳转到指定页码
                    pageSizeOptions:['10','50','200','500','1000']//每页可显示多少行
                  }, //分页器
      data: [] //表数据
      
    };
  }
    //表格变化后重新加载数据 筛选 排序 翻页 除自定义筛选外
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      loading:true,  
    });
    let params = {"type":0,
                  "pageNO":pagination.current,
                  "size":pagination.pageSize,
                  //"activation":,  //激活状态，产品暂不实现网络查询，server端未实现and查询功能
                  //'product.productId':
                };
    fetch(licenseCountPager,this.licPagerUpdate,params);
  }
  //获取表数据， 填充数据  加工数据展示
  licPagerUpdate=(data)=>{
    this.setState({loading:false});    
    if(!data){
      Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
      return;    
    };
     this.setState({
         pagination:{
             total:data.entity.count,
         }
     });
    let entity = data.entity.list;
    let tableData=[];
    for(let i = 0;i < entity.length;i++){
      tableData.push({'key':entity[i].key,
                      'expirationDate':entity[i].expirationDate,
                      'userNumber':entity[i].userNumber,
                      'productName':entity[i].product.productName,
                      'activation':entity[i].activation?'已激活':'未激活',
                      'endUserCompany':entity[i].endUserCompany,
                });
    }
    this.setState({
        data:tableData
    });
  }
  //加点 延期后 更新表格内容通过props 修改回调 modTableCdk
  modTableCdk=(key,date,userNumber)=>{
    console.log('修改了 key',key,"延期",date,"加点",userNumber);
    let tableData = this.state.data;
    for(let i=0 ;i<tableData.length;i++){
      if(tableData[i].key === key){
          tableData[i].userNumber = userNumber;
          tableData[i].expirationDate = date;
          this.setState({
              data:tableData,
          });
        return;
      }
    }
  }

  //表格组件加载时加载数据
  componentDidMount() {
    this.setState({loading:true});    
    fetch(licenseCountPager,this.licPagerUpdate,{type:0,pageNO:1,size:10}); //默认获取第一页，每页10行    
  }

  //表头筛选部分
  //清空授权码输入框
    emitEmpty = (e) => {
            e.target.focus();
            this.setState({ searchCdkText: '',searchCustomerText:'' });
    }
  //绑定搜索cdk input 
  onCdkChange = (e) => {
    this.setState({ searchCdkText: e.target.value });
  }
  
  //绑定搜索cdk button
  onCdkSearch = (e) => {
    const { searchCdkText } = this.state;
    if(!searchCdkText){
      this.setState({
        filterCdkVisible: false,
        cdkFiltered: !!searchCdkText,
      });
     return;
    }
    //筛选后重新加载数据
    this.setState({loading:true});    
    //根据搜索cdk筛选查询cdk
    fetch(licenseCountPager,this.licPagerUpdate,{type:0,pageNO:1,size:10,key:searchCdkText});
    //清空筛选框
    this.setState({
      filterCdkVisible: false,
      cdkFiltered: !!searchCdkText,
    });
  }
   //绑定搜索 Customer input
  onCustomerChange = (e) => {
    this.setState({ searchCustomerText: e.target.value });
  }
  //绑定搜索最终用户公司名称 Customer button
  onCustomerSearch = (e) => {
    const { searchCustomerText } = this.state;
    if(!searchCustomerText){
      this.setState({
        filterCustomerVisible: false,
        customerFiltered: !!searchCustomerText,
        });
     return;
    }
    //筛选后重新加载数据
    this.setState({loading:true});    
    //根据搜索 公司名称 筛选查询cdk
    fetch(licenseCountPager,this.licPagerUpdate,{type:0,pageNO:1,size:10,endUserCompany:searchCustomerText});
    //清空筛选框
    this.setState({
      filterCustomerVisible: false,
      customerFiltered: !!searchCustomerText,
    });
  }
  //根据产品筛选
  onProductSearch=(value, record)=>{
    console.log('onProductSearch',value, record);
  }
  //根据激活状态筛选
  onActivationSearch=(value, record)=>{
    console.log('onActivationSearch',value, record);
  }
 
  //编辑某行
  // onRowEdit=(text, record, index)=>{
  //   console.log("text------",text,"record------",record, "index----- ", index)
  //     return(<a onClick={this.onRowEditClick(text)}>加点与延期</a>);
  // }
  // onRowEditClick=(text)=>{
  //   console.log("====text===",text);
  // }
  

  render() {
    //筛选input后缀，清除数据
    const columns = [{
      title: '授权码',
      dataIndex: 'key',
      key: 'key',
      //搜索CDK筛选
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchCdkInput = ele}
            placeholder="搜索授权码"
            value={this.state.searchCdkText}
            onChange={this.onCdkChange}
            onPressEnter={this.onCdkSearch}
          />
          <Button type="primary" onClick={this.onCdkSearch}>搜索</Button>
        </div>
      ),
      filterIcon: <Icon type="filter" style={{ color: this.state.cdkFiltered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterCdkVisible,
      onFilterDropdownVisibleChange: visible => this.setState({ filterCdkVisible: visible }, () => this.searchCdkInput.focus()),
    }, {
      title: '客户名称',
      dataIndex: 'endUserCompany',
      key: 'endUserCompany',
      //搜索客户名称筛选
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchCustomerInput = ele}
            placeholder="搜索客户公司名"
            value={this.state.searchCustomerText}
            onChange={this.onCustomerChange}
            onPressEnter={this.onCustomerSearch}
          />
          <Button type="primary" onClick={this.onCustomerSearch}>搜索</Button>
        </div>
      ), // color: this.state.customerFiltered ? '#108ee9' : '#aaa' 
      filterIcon: <Icon type="filter" style={{ color: this.state.customerFiltered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterCustomerVisible,
      onFilterDropdownVisibleChange: visible => this.setState({ filterCustomerVisible: visible }, () => this.searchCustomerInput.focus()),
    }, {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      filters: [{ //表头的筛选菜单
        text: '云桌面',
        value: '云桌面',
      }, {
        text: 'CTBS高级版',
        value: 'CTBS高级版',
      }, {
        text: 'CTBS企业版',
        value: 'CTBS企业版',
      }],
      onFilter: (value, record) => record.productName.indexOf(value) === 0,
    }, {
      title: '试用到期',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      sorter: (a, b) => a.expirationDate - b.expirationDate,
    }, {
      title: '站点数',
      dataIndex: 'userNumber',
      key: 'userNumber',
      sorter: (a, b) => a.userNumber - b.userNumber,
    }, {
      title: '激活状态',
      dataIndex: 'activation',
      key: 'activation',
      filters: [{ //表头的筛选菜单
        text: '已激活',
        value: '已激活',
      }, {
        text: '未激活',
        value: '未激活',
      }],
      onFilter: (value, record) => record.activation.indexOf(value) === 0,
    },{ title: '操作', 
        dataIndex: '', 
        key: 'x', 
        //编辑行
        render: (text, record, index) => {
          return (
            this.state.data.length > 1 ?(<Button  onClick={()=>{this.refsModCdkModal.showModal(record);console.log("表格行",record);}} >加点与延期</Button>) : null
          );
      }, 
      }];

    
    return (

        <div>
          <Table 
              columns={columns} 
              //onRowClick={this.onRowClick} // 点击行 修改cdk模态框
              dataSource={this.state.data} 
              size="small"
              rowKey={record => record.key}  //表格行 key 的取值，可以是字符串或一个函数
              pagination={this.state.pagination}   //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
              loading={this.state.loading}   //页面是否加载中
              onChange={this.handleTableChange} /> 
            <ModCdkModal modTableCdk={this.modTableCdk} ref={(node)=>this.refsModCdkModal=node}/>   
        </div>
    );
  }
}


 
class LicenseManager extends React.Component{
    //申请临时授权
    handleAskTempLic(){
      this.refsAskTemlLicModal.showModal();
    }
    
    render(){
        return(
            <div>
                <div style={{position: "relative",borderBottom: "1px solid #ccc",height: "32px",marginBottom: "10px"}}>
                    <h2>临时授权</h2> 
                    <Button style={{position: "absolute",right: "10px",bottom: "5px"}} onClick={()=>{this.handleAskTempLic()}} type="primary">申请临时授权</Button>
                </div>
                <FilterTable />
                <AskTemlLicModal ref={(node)=>this.refsAskTemlLicModal=node}/>
            </div>
        );
    }
}

export default LicenseManager;