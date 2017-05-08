import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon, Button } from 'antd';
import PubSub from 'pubsub-js';
import Loading from './components/Loading.js';
import DynamicMenu from './components/DynamicMenu.js';
import DynamicContent from './components/DynamicContent.js';
import DynamicBreadcrumb from './components/DynamicBreadcrumb.js';
import KtFooter from './components/Footer.js';
import {fetch,logoutApi} from './utils/connect';
import styles from "./styles/main.css";

const { Header, Content, Footer, Sider } = Layout;
const Topics = {
    Loading: 'PageLoadingStateChange',
    OnMenu: 'MenuSelectChange'
};

const CommonProps = {
    Topics: Topics,
    PubSub: PubSub,
};

// window.singleton = { //新的方式，实现在所有组件间共享对象、共享配置
//     share: {
//         Topics: Topics,
//         PubSub: PubSub
//     },
//     config: {
//         ServerRootURL: 'http://192.168.200.104:8080/dinghuo/'
//     }
// }

let indexURL = "http://192.168.200.104:8000/main.html";

function onClickMenu(e) {
    if(e.key == 'logout') {
        fetch(logoutApi,(resp)=> {
            if(resp.errorCode == 0)
                window.location.href = indexURL;
        },{});
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
                onClick= { onClickMenu }>
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
