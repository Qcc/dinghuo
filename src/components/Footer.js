import React from 'react';
import styles from '../styles/footer.css';

class KtFooter extends React.Component{
    render(){
        return(
            <div className={styles.footer}>
                <div className={styles.about}>
                    <span>关于我们</span>
                    <span>商务合作</span>
                    <span>合作案例</span>
                    <span>商务联系</span>
                    <span>注册协议</span>
                </div>
                <div>
                    <span>Copyright © kouton.com All Rights Reserved. 2003-2018 粤ICP备06069852号</span>
                </div>
            </div>
        );
    }
}

export default KtFooter;
