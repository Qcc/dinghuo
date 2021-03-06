import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon, Button,Modal } from 'antd';
import PubSub from 'pubsub-js';
import Loading from './components/Loading.js';
import DynamicMenu from './components/DynamicMenu.js';
import DynamicContent from './components/DynamicContent.js';
import DynamicBreadcrumb from './components/DynamicBreadcrumb.js';
import KtFooter from './components/Footer.js';
import {fetch,isLoggedIn,logoutApi,indexURL} from './utils/connect';
import styles from "./styles/main.css";


const { Header, Content, Footer, Sider } = Layout;
const confirm = Modal.confirm;
const Topics = {
    Loading: 'PageLoadingStateChange',
    OnMenu: 'MenuSelectChange'
};

const CommonProps = {
    Topics: Topics,
    PubSub: PubSub,
};

 


//确认是否退出
    function showConfirm(){
      confirm({
        title: '请确认',
        content: '要退出当前登录的账户吗？',
        onOk() {
          fetch(logoutApi,(data)=>{
            if(data.errorCode === 0){
              window.location.href = indexURL;      
            }
          });
        },
        onCancel() {
        },
      }); 
    };
class IsLoggedIn extends React.Component{
    state={
        time:5,
    }
    timer =()=> setInterval(()=>{fetch(isLoggedIn,this.isLoggedInUpdate);},600000);
    componentDidMount=()=>{
       this.timer();
        fetch(isLoggedIn,this.isLoggedIn);           
    }

    isLoggedIn=(data)=>{
        if(!data){
            return;
        }
        if(data.entity === 1){
           window.isLoggedIn=true; 
        }
       if(data.entity === 0){
         window.isLoggedIn=false;  
         Modal.error({
         title: '错误！',
         content: "您还未登录，点击按钮返回主页。",
         onOk() {window.location.pathname ='/index.html'; },
          });
                         
        } 
    }
    
    isLoggedInUpdate=(data)=>{
        if(data === null){
        return;    
        };
        if(data.errorCode !== 0){
        return;
        }
       if(data.entity === 0){
           clearInterval(this.timer);
           Modal.error({title: '错误！',content:`当前帐号已退出，${this.state.time}秒后返回主页！`});            
          let time = setInterval(()=>{
               this.setState({
                   time:this.state.time-1,
               });
               if(this.state.time<0){
                clearInterval(time);
                 window.location.pathname ='/index.html';  

               }
           },1000);
        } 
    }
    render(){
        return null;
    }
}
    

  

ReactDOM.render(
    <div>
    <Layout>
        <Header className={styles.header}>
            <div className={styles.logo} />
            <Menu
                theme="dark"
                mode="horizontal"
                style={{ lineHeight: '64px' }}
                >
              <Menu.Item key="home">首页</Menu.Item>
              <Menu.Item key="neworders">最新订单</Menu.Item>
              <Menu.Item key="logout" style={{float:'right'}}><span  onClick= {showConfirm }  ><Icon type="logout" />退出</span></Menu.Item>
            </Menu>
        </Header>
        <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
                <DynamicMenu {...CommonProps} />
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <DynamicBreadcrumb style={{ margin: '12px 0' }} {...CommonProps} />
                <DynamicContent style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }} {...CommonProps}/>
            </Layout>
        </Layout>
        <Loading {...CommonProps} />
    </Layout>
    <KtFooter/>
    <IsLoggedIn/>
    </div>,
document.getElementById('root'));
