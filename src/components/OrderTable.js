import React from 'react';
import { Table } from 'antd';
import ajax from '../utils/ajax.js';

class OrderTable extends React.Component {
    constructor(props) { super(props); }

    state = {
        data: [],
        pagination: {
            total: 0,            //数据总数
            current:1,          //当前页数
            pageSize: 1        //每页条数
        },
        loading: false
    };

    static propTypes = {
        Topics: React.PropTypes.object.isRequired,
        PubSub: React.PropTypes.object.isRequired
    };

    handleTableChange = (pagination, filters, sorter) => { //当点击页面下标时，这里传入的pagination.current指向了新页面
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch();
    }

    fetch = () => {
        this.setState({ loading: true });
        let url = this.props.ServerRootURL + "protected/order/getOrderCountAndPager.api";
        ajax(url, {pageNO: this.state.pagination.current, size: this.state.pagination.pageSize}, null, (error, resp)=> {
            const pagination = { ...this.state.pagination };
            let data = [];
            if(error == null && resp.errorCode == 0) {
                pagination.total = resp.entity.count;
                data = resp.entity.list;
            }
            this.setState({
                loading: false,
                data: data,
                pagination
            });
        });
    }

    componentDidMount() {
        this.fetch();
    }

    render() {
        const columns = [{
            title: '编号',
            dataIndex: 'id'
        }, {
            title: '创建时间',
            dataIndex: 'createDatetime'
        }];

        return <Table bordered columns={columns}
                rowKey={record => record.id}          //Table.rowKey：表格行 key 的取值，可以是字符串或一个函数 （我的理解：给每一行一个唯一标识）
                dataSource={this.state.data}
                pagination={this.state.pagination}  //Table.pagination：分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                loading={this.state.loading}        //Table.loading：页面是否加载中
                onChange={this.handleTableChange}  //Table.onChange：分页、排序、筛选变化时触发
            />;
    }
}

//导出组件
export default OrderTable;
