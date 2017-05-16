import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'antd';

import LoginForm from './components/LoginForm.js';
var urlRoot = 'http://192.168.200.104:8080/dinghuo/';
const LoginFormProps = {
    actionURL: urlRoot + "public/user/koutonlogin.api",
    loginSuccessURL: urlRoot + "protected/kouton/main.html",    
    validateCodeImgURL: urlRoot + "public/user/validateCodeImg.api",
    checkValidateCodeURL: urlRoot + "public/user/checkValidateCode.api"
};

const WrappedLoginForm = Form.create()(LoginForm);
ReactDOM.render( <WrappedLoginForm {...LoginFormProps} />, document.getElementById('root'));