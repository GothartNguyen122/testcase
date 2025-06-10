import { Button, Divider, Form, Input, message, notification, Checkbox } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    useEffect(() => {
        //đã login => redirect to '/'
        if (isAuthenticated) {
            // navigate('/');
            window.location.href = '/';
        }
    }, [])

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        try {
            const res = await callLogin(username, password);
            setIsSubmit(false);

            if (res?.data) {
                localStorage.setItem('access_token', res.data.access_token);
                dispatch(setUserLoginInfo(res.data.user));
                message.success('Đăng nhập tài khoản thành công!');
                window.location.href = callback ? callback : '/';
            } else {
                notification.error({
                    message: "Đăng nhập thất bại!",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                });
            }
        } catch (error: any) {
            setIsSubmit(false);
            let backendMsg = error?.response?.data?.message;
            let userMsg = "Có lỗi xảy ra, vui lòng thử lại.";
            if (backendMsg === "Bad credentials") {
                userMsg = "Tài khoản hoặc mật khẩu không đúng!";
            } else if (backendMsg) {
                userMsg = backendMsg;
            }
            notification.error({
                message: "Đăng nhập thất bại!",
                description: userMsg,
                duration: 5
            });
        }
    };


    return (
        <div className={styles["login-layout"]}>
            <div className={styles["login-banner"]}>
                <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=90"
                    alt="IT Banner"
                    className={styles["banner-img"]}
                />
                <div className={styles["banner-overlay"]}></div>
            </div>
            <div className={styles["login-form-block"]}>
                <div className={styles["login-info"]}>
                    {/* Đã xóa slogan, chỉ giữ lại các thành phần cần thiết */}
                </div>
                <main className={styles.main}>
                    <div className={styles.container}>
                        <section className={styles.wrapper}>
                            <div className={styles.loginWrapper}>
                                <div className={styles.loginHeader}>
                                    <span className={styles.logoText}>IT</span>
                                    <span className={styles.platformName}>JOBHUNTER</span>
                                </div>
                                <h2 className={styles.welcomeTitle}>Chào mừng bạn đến với JobHunter</h2>
                                <Form name="basic" onFinish={onFinish} autoComplete="off" className={styles.loginForm}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Email"
                                        name="username"
                                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                    >
                                        <Input.Password size="large" />
                                    </Form.Item>
                                    <div className={styles.loginOptions}>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox>Nhớ mật khẩu</Checkbox>
                                        </Form.Item>
                                        <Link to="/forgot-password" className={styles.forgot}>Quên mật khẩu?</Link>
                                    </div>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={isSubmit} block className={styles.loginBtn}>
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>
                                </Form>
                                <div className={styles.policy}>
                                    Bằng việc đăng nhập, bạn đồng ý với <a href="#">Điều khoản</a> & <a href="#">Chính sách bảo mật</a> của JobHunter.
                                </div>
                                <div className={styles.contact}>
                                    <Divider />
                                    <div>Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></div>
                                    <div>
                                        <span>Liên hệ: </span>
                                        <a href="mailto:support@jobhunter.vn">support@jobhunter.vn</a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default LoginPage;