import React from 'react';
import { Breadcrumb } from 'antd';

class DynamicBreadcrumb extends React.Component {
    constructor(props) { super(props); }

    state = {
        menu: {
            menuKey:'',
            menuItems:[]
        } //根据不同的菜单，展现不同的内容
    };

    static propTypes = {
        Topics: React.PropTypes.object.isRequired,
        PubSub: React.PropTypes.object.isRequired
    };

    componentDidMount() {
        let cb = (topic, menu) => {
            this.setState({
                menu: menu
            });
        };
        this.pubsub = this.props.PubSub.subscribe(this.props.Topics.OnMenu, cb);
    }

    componentWillUnmount() {
        this.props.PubSub.unsubscribe(this.pubsub);
    }

    render() {

        function recursiveFind(menuItems, target) {
            for(var i = 0; i < menuItems.length;i++) {
                var item = menuItems[i];
                if(item.name == target)
                    return item;
                if(item.children && item.children.length > 0) {
                    var r = recursiveFind(item.children, target);
                    if(r != null)
                        return r;
                }
            }
            return null;
        }
        var menuItem = recursiveFind(this.state.menu.menuItems, this.state.menu.menuKey);

        var list = (p) => {
            var i = i;
            var res = [];
            do {
                if(p) {
                    res.unshift(<Breadcrumb.Item key={i++}>{p.title}</Breadcrumb.Item>);
                    p = p.parent;
                }
            } while(p);
            return res;
        }
        return (
            <Breadcrumb style={this.props.style}>
                <Breadcrumb.Item>沟通订货系统 - 后台</Breadcrumb.Item>
                { list(menuItem) }
            </Breadcrumb>
        );
    }
}

//导出组件
export default DynamicBreadcrumb;
