import React from 'react';
import { Menu, Icon, Modal } from 'antd';
import {fetch,dynamicMenuApi} from '../utils/connect';
import Loading from './Loading';
const { SubMenu } = Menu;
 

class DynamicMenu extends React.Component {

    constructor(props) { 
        super(props); 
        this.state = {
            //初始菜单项为空，根据登录用户权限的不同，ajax动态获取不同的菜单项。
            // 菜单项格式为{name:'UserManager', title:'用户管理'}或{name:'UserManager', title:'用户管理', children:[{...}]}
            menuItems : [],
            loading: true,
            defaultSelectedKeys: [], //默认选中的菜单Item
            defaultOpenKeys: [] //默认打开的菜单组
        };
    }

    static propTypes = {
        Topics: React.PropTypes.object.isRequired,
        PubSub: React.PropTypes.object.isRequired
    };
    
     //建立菜单层级关系, DynamicBreadcrumb中要用到
    recursive=(menuItems, parent)=>{
        let firstItem;
         for(let i = 0; i < menuItems.length;i++) {
             let item = menuItems[i];
             item.parent = parent;
             if(item.children && item.children.length > 0) {
                 recursive(item.children, item);
             }
             else {
                 if(!firstItem)
                     firstItem = item;
             }
         }
     }
     //回调，将动态菜单映射到 state  
    menuUpdata=(data)=>{
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
                this.props.PubSub.publish(this.props.Topics.Loading, false);
                 var groups = this.state.defaultOpenKeys;
                 var keys = this.state.defaultSelectedKeys;
                 if(data.entity.length > 0) {
                     //默认页面 
                     keys.push(data.entity[0].children[1].name);
                     groups.push(data.entity[0].name);
                 }
                this.props.PubSub.publish(this.props.Topics.OnMenu, {menuKey:keys[0], menuItems:this.state.menuItems});
                 this.setState({
                        loading: false, 
                        menuItems: data.entity,
                    });
            }
    }
  
  //获取动态菜单
    componentDidMount() {
        fetch(dynamicMenuApi,this.menuUpdata);
    }

    triggerMenuEvent(key) {
        this.props.PubSub.publish(this.props.Topics.OnMenu, {menuKey:key, menuItems:this.state.menuItems});
    }

    dynamicContent(items=this.state.menuItems) {
        var items = items.map((item) => {
            if(Array.isArray(item.children) && item.children.length > 0) {
                return (
                    <SubMenu key={item.name} title={<span><Icon type={item.icon} />{item.title}</span>}>
                         {this.dynamicContent(item.children)}
                    </SubMenu>
                )
            }
            else {
                    return <Menu.Item key={item.name}>{item.title}</Menu.Item>;
                }
        });
        return items;
    }

    
    render() {
        return (
            <Menu
            mode="inline"
            defaultSelectedKeys={this.state.defaultSelectedKeys} //默认选中的菜单Item
            defaultOpenKeys={this.state.defaultOpenKeys}  //默认打开的菜单组
            style={{ height: '100%' }}
            onSelect={ (e) => { this.triggerMenuEvent(e.key) } }
            >
                {this.dynamicContent()}
            </Menu>
        );
    }





}

//导出组件
export default DynamicMenu;
