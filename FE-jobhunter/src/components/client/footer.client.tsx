import styles from 'styles/client.module.scss';
import { PhoneOutlined } from "@ant-design/icons";

const Footer = () => {
    return (
        <footer className={styles['custom-footer']}>
            <div className={styles['footer-content']}>
                <div className={styles['footer-bottom']}>
                    <div className={styles['footer-right']}>
                        <p>
                            <PhoneOutlined style={{ color: "#1677ff", marginRight: 8 }} />
                            Hồ Chí Minh: (+84) 123 456 789
                        </p>
                        <p>
                            <PhoneOutlined style={{ color: "#1677ff", marginRight: 8 }} />
                            Hà Nội: (+84) 987 654 321
                        </p>
                    </div>
                </div>

                <div className={styles['footer-divider']}></div>

                <div className={styles['footer-top']}>
                    <div className={styles['footer-left']}>
                        <p>Copyright &copy; Việc làm IT</p>
                        <p>MST: 0312192258</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
