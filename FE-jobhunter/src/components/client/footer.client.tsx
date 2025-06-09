import styles from 'styles/client.module.scss';
import { PhoneOutlined } from "@ant-design/icons";

const Footer = () => {
    return (
        <footer className={styles['custom-footer']}>
            <div className={styles['footer-content']}>
                <div className={styles['footer-bottom']}>
                    <div className={styles['footer-right']}>
                        <div className={styles['footer-col']}>
                            <p style={{ color: '#fff176', fontWeight: 600 }}>Liên hệ</p>
                            <p><span style={{ color: '#ff9800' }}>Địa chỉ:</span> 123 Đường Số 1, Quận 1, TP. Hồ Chí Minh</p>
                            <p><span style={{ color: '#ff9800' }}>Hotline:</span> 1900 1234</p>
                            <p><span style={{ color: '#ff9800' }}>Email:</span> <a href="mailto:support@jobhunter.vn" style={{color:'#ff9800'}}>support@jobhunter.vn</a></p>
                            <p><span style={{ color: '#ff9800' }}>MST:</span> 0312192258</p>
                        </div>
                        <div className={styles['footer-col']}>
                            <p style={{ color: '#fff176', fontWeight: 600 }}>JobHunter</p>
                            <p style={{marginTop: 8, color: '#ffeaea'}}>Việc làm IT - Kết nối cơ hội, phát triển tương lai</p>
                            <p style={{margin: 0, color: '#ffeaea'}}>Copyright &copy; {new Date().getFullYear()} JobHunter</p>
                            <p style={{margin: 0, color: '#ffeaea'}}>All rights reserved.</p>
                        </div>
                        <div className={styles['footer-col']}>
                            <p style={{ color: '#fff176', fontWeight: 600 }}>Kết nối với chúng tôi</p>
                            <div style={{marginTop: 8}}>
                                <a href="#" style={{color:'#ff9800', marginRight: 18, fontSize: 22, textDecoration:'none'}}>Facebook</a>
                                <a href="#" style={{color:'#ff9800', marginRight: 18, fontSize: 22, textDecoration:'none'}}>LinkedIn</a>
                                <a href="#" style={{color:'#ff9800', fontSize: 22, textDecoration:'none'}}>YouTube</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles['footer-divider']}></div>
            </div>
        </footer>
    );
};

export default Footer;
