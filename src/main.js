import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon, Button,Modal } from 'antd';
import PubSub from 'pubsub-js';
import Loading from './components/Loading.js';
import DynamicMenu from './components/DynamicMenu.js';
import DynamicContent from './components/DynamicContent.js';
import DynamicBreadcrumb from './components/DynamicBreadcrumb.js';
import KtFooter from './components/Footer.js';
import {fetch,logoutApi} from './utils/connect';
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

 

let indexURL = "http://192.168.200.104:8000/dinghuo/kouton/index.html";
//let indexURL = "http://localhost:8000/index.html";



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
                onClick= {showConfirm }>
              <Menu.Item key="home">首页</Menu.Item>
              <Menu.Item key="neworders">最新订单</Menu.Item>
              <Menu.Item key="logout" style={{float:'right'}}><Icon type="logout" />退出</Menu.Item>
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
    </div>,
document.getElementById('root'));
