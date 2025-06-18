import { useState, useEffect } from 'react';
import { CodeOutlined, ContactsOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined, RiseOutlined, TwitterOutlined, HomeOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from 'antd';
import { Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    // Debug: Log user role and permissions
    useEffect(() => {
        console.log('User:', user);
        console.log('User role:', user.role);
        console.log('User permissions:', user.role?.permissions);
        console.log('Can access admin:', user.role?.permissions?.length || user.role?.name === 'ADMIN' || user.role?.name === 'SUPER_ADMIN');
    }, [user]);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc Làm IT</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/company'}>Top Công ty IT</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        }
    ];



    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        ...(user.role?.permissions?.length || user.role?.name === 'ADMIN' || user.role?.name === 'SUPER_ADMIN' ? [{
            label: <Link
                to={"/admin"}
            >Trang Quản Trị</Link>,
            key: 'admin',
            icon: <FireOutlined />
        },] : []),

        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles['brand']} >
                                <FaReact onClick={() => navigate('/')} title='Job Hunter' />
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#ff9800',
                                            colorBgContainer: 'rgba(26,26,26,0.96)',
                                            colorText: '#ffeaea',
                                            colorTextBase: '#ffeaea',
                                            colorTextHeading: '#fff176',
                                            fontFamily: 'Montserrat, Arial, sans-serif',
                                        },
                                        components: {
                                            Menu: {
                                                itemColor: '#ffeaea',
                                                itemHoverColor: '#fff176',
                                                itemSelectedColor: '#ff9800',
                                                itemSelectedBg: 'rgba(255,255,255,0.08)',
                                                itemBg: 'rgba(26,26,26,0.96)',
                                                horizontalItemBorderRadius: 10,
                                                horizontalItemHoverBg: 'rgba(255,255,255,0.06)',
                                            }
                                        }
                                    }}
                                >

                                    <Menu
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                        style={{
                                            background: 'rgba(26,26,26,0.96)',
                                            borderRadius: 12,
                                            boxShadow: '0 2px 12px rgba(183,28,28,0.10)',
                                            fontFamily: 'Montserrat, Arial, sans-serif',
                                            fontWeight: 600,
                                            fontSize: 17,
                                            minHeight: 48,
                                            marginTop: 6,
                                        }}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <Link to={'/login'}>Đăng Nhập</Link>
                                        :
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                            <Space style={{ cursor: "pointer" }}>
                                                <span>Welcome {user?.name}</span>
                                                <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                                            </Space>
                                        </Dropdown>
                                    }

                                </div>

                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']}>
                            <span>Your APP</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>
            <Drawer title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    )
};

export default Header;