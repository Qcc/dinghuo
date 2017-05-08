import React from 'react';
import { Table } from 'antd';
import {fetch} from '../../utils/connect';

class AddPartner extends React.Component{
    constructor(props){
        super(props);
        this.state={
           loading:false, 
        }
    }


    render(){
        return(<h1>添加伙伴</h1>);
    }
}

export default AddPartner;