import React from 'react';
import { Table,Calendar } from 'antd';

import OrderTable from '../components/OrderTable.js';
import PartnerCURDTable from '../components/PartnerCURDTable.js';

class DynamicContent extends React.Component {
    constructor(props) { super(props); }

    state = {
        menuKey : "1" //根据不同的菜单，展现不同的内容
        //,buttonKey: "default" //如果后面要扩展，比如根据点击按钮展现不同内容，参考menuKey类似做法即可
    };

    static propTypes = {
        Topics: React.PropTypes.object.isRequired,
        PubSub: React.PropTypes.object.isRequired
    };

    componentDidMount() {
        let cb = (topic, param) => {
            this.setState({
                menuKey: param.menuKey
            });
        };
        this.pubsub = this.props.PubSub.subscribe(this.props.Topics.OnMenu, cb);
    }

    componentWillUnmount() {
        this.props.PubSub.unsubscribe(this.pubsub);
    }

    dynamicContent() {
        let commonProps = {
            Topics: this.props.Topics,
            PubSub: this.props.PubSub,
            ServerRootURL: this.props.ServerRootURL
        };

        if(this.state.menuKey == 'OrderList') {
            return <OrderTable {...commonProps} />;
        }
        else if(this.state.menuKey == 'AddPartner')
            return <PartnerCURDTable />;
        else
            return <h1>{this.state.menuKey}</h1>;
    }

    render() {
        console.dir('DynamicContent.render');

        return (
            <div style={this.props.style}>
                {this.dynamicContent()}
            </div>
        );
    }
}

//导出组件
export default DynamicContent;