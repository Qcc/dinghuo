import React from 'react';
import { Spin } from 'antd';

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : (props.loading === 1) ? 1 : 0
        };
    }

    static defaultProps = {
        size : 'large',
        tip : '加载中...',
        loading: 0
    };

    static propTypes = {
        PubSub: React.PropTypes.object.isRequired
    };

    componentDidMount() {
        let cb = (topic, loading) => {
            this.setState({
                loading: loading?(this.state.loading+1):(this.state.loading-1)
            });
        };
        this.pubsub = this.props.PubSub.subscribe(this.props.Topics.Loading, cb);
    }

    componentWillUnmount() {
        this.props.PubSub.unsubscribe(this.pubsub);
    }

    render() {

        let display = (this.state.loading>0) ? 'block' : 'none';
        let style1 = {left:'0px', top:'0px', position:'fixed', width:'100%', height:'100%', display:display};
        let style2 = {left:'0px', top:'0px', position:'fixed', width:'100%', height:'100%', backgroundColor:'#f5f5f5',opacity:0.5,zIndex:10000};
        let style3 = {left:'45%', top:'45%', position:'fixed', textAlign:'center', zIndex:10001};
        return (
            <div style={style1}>
                <div style={style2}></div>
                <Spin size={this.props.size} tip={this.props.tip} spinning={(this.state.loading>0)} style={style3} />
            </div>
        );
    }
}

//导出组件
export default Loading;
