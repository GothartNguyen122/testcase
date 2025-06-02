import { Button, Divider, Form, Input, Row, Select, message, notification, Col } from 'antd';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister, callFetchAllSkill } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser, ISkill } from '@/types/backend';
import { MonitorOutlined } from "@ant-design/icons";
import { ProFormSelect, ProFormDigit } from "@ant-design/pro-components";

const { Option } = Select;

interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const [skills, setSkills] = useState<ISkillSelect[]>([]);

    useEffect(() => {
        const init = async () => {
            const temp = await fetchSkillList();
            setSkills(temp);
        }
        init(); // Gọi hàm init
    }, []);

    async function fetchSkillList(): Promise<ISkillSelect[]> {
        const res = await callFetchAllSkill(`page=1&size=100`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: `${item.id}` as string
                }
            })
            return temp;
        } else return [];
    }


    const onFinish = async (values: any) => {
        const { name, email, password, age, gender, address, salary, level, skills } = values;
        const arrSkills = values?.skills?.map((item: string) => { return { id: +item } })
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age, gender, address, salary, level, arrSkills);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };


    return (
        <div className={styles["register-page"]} >

            <main className={styles.main} >
                <div className={styles.container} >
                    <section className={styles.wrapper} >
                        <div className={styles.heading} >
                            <h2 className={`${styles.text} ${styles["text-large"]}`}> Đăng Ký Tài Khoản </h2>
                            < Divider />
                        </div>
                        < Form<IUser>
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Họ tên"
                                name="name"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                labelCol={{ span: 24 }
                                } //whole column
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input type='email' />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Tuổi"
                                name="age"
                                rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
                            >
                                <Input type='number' />
                            </Form.Item>


                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                            >
                                <Select
                                    // placeholder="Select a option and change input text above"
                                    // onChange={onGenderChange}
                                    allowClear
                                >
                                    <Option value="MALE">Nam</Option>
                                    <Option value="FEMALE">Nữ</Option>
                                    <Option value="OTHER">Khác</Option>
                                </Select>
                            </Form.Item>


                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mức lương mong muốn"
                                name="salary"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            >
                                <ProFormDigit
                                    placeholder="Nhập mức lương"
                                    fieldProps={{
                                        addonAfter: " đ",
                                        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                        parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={"Kỹ năng hiện có"}
                                name={"skills"}
                                rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}

                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    suffixIcon={null}
                                    style={{ width: '100%' }}
                                    placeholder={
                                        <>
                                            <MonitorOutlined /> Tìm theo kỹ năng...
                                        </>
                                    }
                                    optionLabelProp="label"
                                    options={skills}
                                />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                name="level"
                                label="Trình độ">
                                <ProFormSelect

                                    valueEnum={{
                                        INTERN: 'INTERN',
                                        FRESHER: 'FRESHER',
                                        JUNIOR: 'JUNIOR',
                                        MIDDLE: 'MIDDLE',
                                        SENIOR: 'SENIOR',
                                    }}
                                    placeholder="Please select a level"
                                    rules={[{ required: true, message: 'Vui lòng chọn level!' }]}
                                />
                            </Form.Item>

                            < Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit} >
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider> Or </Divider>
                            <p className="text text-normal" > Đã có tài khoản ?
                                <span>
                                    <Link to='/login' > Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage;