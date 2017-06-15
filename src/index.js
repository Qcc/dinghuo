import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'antd';
import {ROOTURL,loginSuccessURL,actionURL} from './utils/connect';

import LoginForm from './components/LoginForm.js';
 
const LoginFormProps = {
    loginSuccessURL:loginSuccessURL,
    actionURL:actionURL,
    validateCodeImgURL: ROOTURL + "public/user/validateCodeImg.api",
    checkValidateCodeURL: ROOTURL + "public/user/checkValidateCode.api"
};

const WrappedLoginForm = Form.create()(LoginForm);
ReactDOM.render( <WrappedLoginForm {...LoginFormProps} />, document.getElementById('root'));