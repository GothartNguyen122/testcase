import { Button, Col, Form, Input, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume, ISubscribers } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callCreateSubscriber, callFetchAllSkill, callUpdateUser, callFetchResumeByUser, callGetSubscriberSkills, callUpdateSubscriber } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";
import { ProForm } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}
interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: "companyName",

        },
        {
            title: 'Job title',
            dataIndex: ["job", "name"],

        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Ngày rải CV',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = () => {
    const [form] = ProForm.useForm();
    const navigate = useNavigate();
    const user = useAppSelector(state => state.account.user); // Assuming user info is in Redux state
    const [userInfo, setUserInfo] = useState<any>(user); // Set initial user info
    const [optionsSkills, setOptionsSkills] = useState<ISkillSelect[]>([]); // Options for skills

    useEffect(() => {
        const init = async () => {
            const temp = await fetchSkillList();
            setOptionsSkills(temp);
        }
        init(); // Gọi hàm init
    }, []);

    // Fill lại form mỗi khi userInfo thay đổi (khi mở modal hoặc cập nhật xong)
    useEffect(() => {
        console.log('userInfo:', userInfo);
        if (userInfo) {
            form.setFieldsValue({
                ...userInfo,
                skills: userInfo?.skills?.map((item: any) => item.id.toString()),
            });
        }
    }, [userInfo, form]);

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

    // Handle form submission
    const submitUserInfo = async (values: any) => {
        try {
            const { name, email, age, gender, address, salary, level, skills } = values;
            const arrSkills = values?.skills?.map((item: string) => { return { id: +item } })
            const id = user.id;
            const userUpdate = {
                id,
                name,
                email,
                age: +age,
                gender,
                address,
                salary,
                level,
                skills: arrSkills
            };
            const res = await callUpdateUser(userUpdate);
            if (res && res.message) {
                message.success("Cập nhật thông tin thành công!");
                setUserInfo(values);
                navigate("");
            }
            else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: "Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.",
                });
            }

        } catch (error) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: "Không thể kết nối tới máy chủ.",
            });
        }
    };

    // Handle reset
    const handleCancel = () => {
        form.resetFields();
    };

    return (
        <ProForm
            form={form}
            onFinish={submitUserInfo} // Form submission handler
            initialValues={{
                ...userInfo,
                skills: userInfo?.skills?.map((item: any) => item.id.toString()),
            }}
            submitter={{
                searchConfig: {
                    submitText: "Cập nhật", // Set submit button text
                    resetText: "Hủy", // Change reset button text to "Hủy"
                },
                onReset: handleCancel, // Reset form when cancel is clicked
            }}
        >
            {/* Họ tên */}
            <ProForm.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Họ tên không được để trống!" }]}
            >
                <Input placeholder="Nhập họ tên" />
            </ProForm.Item>

            {/* Email */}
            <ProForm.Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
            >
                <Input disabled />
            </ProForm.Item>

            {/* Tuổi */}
            <ProForm.Item
                label="Tuổi"
                name="age"
                rules={[
                    { required: true, message: "Tuổi không được để trống!" },
                    { pattern: /^[0-9]+$/, message: "Chỉ được nhập số" }
                ]}
            >
                <Input type="number" placeholder="Nhập tuổi" />
            </ProForm.Item>

            {/* Giới tính */}
            <ProForm.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Giới tính không được để trống!" }]}
            >
                <Select
                    options={[
                        { label: "Nam", value: "MALE" },
                        { label: "Nữ", value: "FEMALE" },
                        { label: "Khác", value: "OTHER" },
                    ]}
                    placeholder="Chọn giới tính"
                />
            </ProForm.Item>

            {/* Địa chỉ */}
            <ProForm.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Địa chỉ không được để trống!" }]}
            >
                <Input placeholder="Nhập địa chỉ" />
            </ProForm.Item>

            {/* Lương */}
            <ProForm.Item
                label="Lương"
                name="salary"
                rules={[
                    { required: true, message: "Lương không được để trống!" },
                    { pattern: /^[0-9]+$/, message: "Chỉ được nhập số" }
                ]}
            >
                <Input type="number" placeholder="Nhập lương" />
            </ProForm.Item>

            {/* Cấp bậc */}
            <ProForm.Item
                label="Cấp bậc"
                name="level"
                rules={[{ required: true, message: "Cấp bậc không được để trống!" }]}
            >
                <Select
                    options={[
                        { label: "JUNIOR", value: "JUNIOR" },
                        { label: "MIDDLE", value: "MIDDLE" },
                        { label: "SENIOR", value: "SENIOR" },
                        { label: "INTERN", value: "INTERN" },
                        { label: "FRESHER", value: "FRESHER" },
                    ]}
                    placeholder="Chọn cấp bậc"
                />
            </ProForm.Item>

            {/* Kỹ năng */}
            <ProForm.Item
                label="Kỹ năng"
                name="skills"
                rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 kỹ năng!" }]}
            >
                <Select
                    mode="multiple"
                    allowClear
                    suffixIcon={null}
                    style={{ width: "100%" }}
                    placeholder={<>Tìm theo kỹ năng...</>}
                    optionLabelProp="label"
                    options={optionsSkills}
                />
            </ProForm.Item>
        </ProForm>
    );
};

// const JobByEmail = (props: any) => {
//     const [form] = Form.useForm();
//     const user = useAppSelector(state => state.account.user);
//     const [optionsSkills, setOptionsSkills] = useState<{
//         label: string;
//         value: string;
//     }[]>([]);

//     const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);

//     useEffect(() => {
//         const init = async () => {
//             await fetchSkill();
//             const res = await callGetSubscriberSkills();
//             if (res && res.data) {
//                 setSubscriber(res.data);
//                 const d = res.data.skills;
//                 const arr = d.map((item: any) => {
//                     return {
//                         label: item.name as string,
//                         value: item.id + "" as string
//                     }
//                 });
//                 form.setFieldValue("skills", arr);
//             }
//         }
//         init();
//         fetchSkill();
//     }, [])

//     const fetchSkill = async () => {
//         let query = `page=1&size=100&sort=createdAt,desc`;

//         const res = await callFetchAllSkill(query);
//         if (res && res.data) {
//             const arr = res?.data?.result?.map(item => {
//                 return {
//                     label: item.name as string,
//                     value: item.id + "" as string
//                 }
//             }) ?? [];
//             setOptionsSkills(arr);
//         }
//     }

//     const onFinish = async (values: any) => {
//         const { skills } = values;

//         const arr = skills?.map((item: any) => {
//             if (item?.id) return { id: item.id };
//             return { id: item }
//         });

//         if (!subscriber?.id) {
//             //create subscriber
//             const data = {
//                 email: user.email,
//                 name: user.name,
//                 skills: arr
//             }

//             const res = await callCreateSubscriber(data);
//             if (res.data) {
//                 message.success("Cập nhật thông tin thành công");
//                 setSubscriber(res.data);
//             } else {
//                 notification.error({
//                     message: 'Có lỗi xảy ra',
//                     description: res.message
//                 });
//             }


//         } else {
//             //update subscriber
//             const res = await callUpdateSubscriber({
//                 id: subscriber?.id,
//                 skills: arr
//             });
//             if (res.data) {
//                 message.success("Cập nhật thông tin thành công");
//                 setSubscriber(res.data);
//             } else {
//                 notification.error({
//                     message: 'Có lỗi xảy ra',
//                     description: res.message
//                 });
//             }
//         }


//     }

//     return (
//         <>
//             <Form
//                 onFinish={onFinish}
//                 form={form}
//             >
//                 <Row gutter={[20, 20]}>
//                     <Col span={24}>
//                         <Form.Item
//                             label={"Kỹ năng"}
//                             name={"skills"}
//                             rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}

//                         >
//                             <Select
//                                 mode="multiple"
//                                 allowClear
//                                 suffixIcon={null}
//                                 style={{ width: '100%' }}
//                                 placeholder={
//                                     <>
//                                         <MonitorOutlined /> Tìm theo kỹ năng...
//                                     </>
//                                 }
//                                 optionLabelProp="label"
//                                 options={optionsSkills}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                         <Button onClick={() => form.submit()}>Cập nhật</Button>
//                     </Col>
//                 </Row>
//             </Form>
//         </>
//     )
// }

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Rải CV`,
            children: <UserResume />,
        },
        // {
        //     key: 'email-by-skills',
        //     label: `Nhận Jobs qua Email`,
        //     children: <JobByEmail />,
        // },
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: `//todo`,
        },
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;