import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon, Button,Modal } from 'antd';
import PubSub from 'pubsub-js';
import Loading from './components/Loading.js';
import DynamicMenu from './components/DynamicMenu.js';
import DynamicContent from './components/DynamicContent.js';
import DynamicBreadcrumb from './components/DynamicBreadcrumb.js';
import KtFooter from './components/Footer.js';
import {fetch,logoutApi,isLoggedIn} from './utils/connect';
import styles from "./styles/main.css";

const confirm = Modal.confirm;
const { Header, Content, Footer, Sider } = Layout;
const Topics = {
    Loading: 'PageLoadingStateChange',
    OnMenu: 'MenuSelectChange'
};

const CommonProps = {
    Topics: Topics,
    PubSub: PubSub,
};

 

//let indexURL = "http://192.168.200.104:8000/dinghuo/kouton/index.html";
let indexURL = "http://localhost:8000/index.html";



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

    timer =()=> setInterval(()=>{fetch(isLoggedIn,this.isLoggedInUpdate);},600000);
    componentDidMount=()=>{
       this.timer();
    }
    
    isLoggedInUpdate=(data)=>{
        if(data === null){
        Modal.error({title: '错误！',content:'网络错误，请刷新（F5）后重试。'});  
        return;    
        };
        if(data.errorCode !== 0){
            Modal.error({title: '错误！',content:'服务器错误,'+data.message});
            return;
        }
       if(data.entity === 0){
           Modal.error({title: '错误！',content:'当前帐号已退出，点击按钮返回主页！'});            
           clearInterval(this.timer);
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
