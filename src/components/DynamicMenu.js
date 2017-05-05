import React from 'react';
import { Menu, Icon, Modal } from 'antd';
import {fetch,dynamicMenuApi} from './utils/ajax';
const { SubMenu } = Menu;

import reqwest from 'reqwest';

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
    menuUpdata=(data)=>{
        if(data){    
            var firstItem;
            recursive(resp.entity);
         var groups = that.state.defaultOpenKeys;
         var keys = that.state.defaultSelectedKeys;
         var initial = false;
         if(keys.length < 1) {
             //首次取得菜单的情况
             initial = true;
             keys.push(firstItem.name);
             groups.push(firstItem.parent.name);
        
         that.setState({loading: false, menuItems: resp.entity,
             defaultSelectedKeys:keys,
             defaultOpenKeys:groups
         }
         if(initial == true)
             that.triggerMenuEvent(firstItem.name);
     }
     else {
         Modal.error({
             title: '异常2',
             content: '访问菜单失败，请刷新页面重试'
         });
     }
            }
                that.props.PubSub.publish(that.props.Topics.Loading, false);
        });
    }
        }
    }

    componentDidMount() {
        fetch(dynamicMenuApi,);
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
        console.dir("render ...");
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
