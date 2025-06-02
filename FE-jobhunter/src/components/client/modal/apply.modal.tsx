import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Divider, Modal, Row, Upload, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from 'antd/lib/locale/en_US';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { callCreateResume, callUploadSingleFile } from "@/config/api";
import { useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';


interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, jobDetail } = props;
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [urlCV, setUrlCV] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);


    const navigate = useNavigate();

    const handleOkButton = async () => {
        setLoading(true); // Start loading process

        try {
            if (!urlCV && isAuthenticated) {
                message.error("Vui lòng upload CV!");
                setLoading(false);
                return;
            }

            if (!isAuthenticated) {
                setIsModalOpen(false);
                navigate(`/login?callback=${window.location.href}`);
            } else {
                if (!urlCV) {
                    message.error("Vui lòng chọn file CV!");
                    setLoading(false);
                    return;
                }
                // Proceed to create resume
                if (jobDetail) {
                    const res = await callCreateResume(urlCV, jobDetail?.id, user.email, user.id);
                    if (res.data) {
                        message.success("Rải CV thành công!");
                        setFileList([]);       // 🔁 Reset giao diện Upload
                        setUrlCV("");          // 🔁 Reset url CV đã upload
                        setIsModalOpen(false);
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                }
            }
        } finally {
            setLoading(false); // Stop loading
        }
    }

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        accept: ".pdf,.doc,.docx",

        beforeUpload: (file) => {
            const isLt5M = file.size && file.size / 1024 / 1024 < 5;
            const isNotEmpty = file.size > 0;
            const isValidType = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ].includes(file.type);
            const forbiddenChars = /[\\/:*?"<>|]/;
            const containsSpace = /\s/; // Kiểm tra có khoảng trắng
            const isValidFileName = file.name && file.name.trim().length > 0 && !forbiddenChars.test(file.name) && !containsSpace.test(file.name);
            if (!isValidFileName) {
                message.error("Tên file không hợp lệ!");
                setUrlCV("");
                return false;
            }

            if (!isValidType) {
                message.error("Chỉ hỗ trợ file PDF, DOC, DOCX!");
                setUrlCV("");
                return false;
            }
            if (!isNotEmpty) {
                message.error("File bị rỗng!");
                setUrlCV("");
                return false;
            }

            if (!isLt5M) {
                message.error("File phải nhỏ hơn 5MB!");
                setUrlCV("");
                return false;
            }

            return true;
        },

        customRequest: async ({ file, onSuccess, onError }: any) => {
            const res = await callUploadSingleFile(file, "resume");
            if (res && res.data) {
                setUrlCV(res.data.fileName);
                if (onSuccess) onSuccess('ok');
            } else {
                setUrlCV("");
                if (onError) {
                    const error = new Error(res.message);
                    onError({ event: error });
                }
            }
        },

        onChange(info) {
            const file = info.file;

            // Kiểm tra lại size, nếu vượt quá thì không cho vào danh sách
            if (!file.size || file.size / 1024 / 1024 > 5) {
                setFileList([]); // xóa khỏi giao diện
                setUrlCV("");
                return;
            }
            const forbiddenChars = /[\\/:*?"<>|]/;
            const containsSpace = /\s/; // Kiểm tra có khoảng trắng
            const isValidFileName = file.name && file.name.trim().length > 0 && !forbiddenChars.test(file.name) && !containsSpace.test(file.name);
            if (!isValidFileName) {
                setFileList([]); // xóa khỏi giao diện nếu tên file không hợp lệ
                setUrlCV("");
                return;
            }

            // Nếu hợp lệ, cập nhật lại fileList
            if (file.status === "done") {
                message.success(`${file.name} đã tải lên thành công`);
                setFileList([file]);
            } else if (file.status === "error") {
                message.error(file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.");
                setFileList([]); // xóa khỏi giao diện
                setUrlCV("");
            } else {
                setFileList([file]);
            }
        },

        fileList: fileList, // Liên kết với state
    };


    return (
        <>
            <Modal
                title="Ứng Tuyển Job"
                open={isModalOpen}
                onOk={handleOkButton}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                okText={isAuthenticated ? (loading ? "Đang rải CV..." : "Rải CV Nào") : "Đăng Nhập Nhanh"}
                cancelButtonProps={{ style: { display: "none" } }}
                destroyOnClose={true}
            >
                <Divider />
                {isAuthenticated ? (
                    <div>
                        <ConfigProvider locale={enUS}>
                            <ProForm
                                submitter={{
                                    render: () => <></>
                                }}
                            >
                                <Row gutter={[10, 10]}>
                                    <Col span={24}>
                                        <div>
                                            Bạn đang ứng tuyển công việc <b>{jobDetail?.name} </b>tại <b>{jobDetail?.company?.name}</b>
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <ProFormText
                                            fieldProps={{
                                                type: "email"
                                            }}
                                            label="Email"
                                            name={"email"}
                                            labelAlign="right"
                                            disabled
                                            initialValue={user?.email}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <ProForm.Item
                                            label={"Upload file CV"}
                                            rules={[{ required: true, message: 'Vui lòng upload file!' }]}
                                        >
                                            <Upload {...propsUpload}>
                                                <Button icon={<UploadOutlined />}>Tải lên CV của bạn ( Hỗ trợ *.doc, *.docx, *.pdf, và &lt; 5MB )</Button>
                                            </Upload>
                                        </ProForm.Item>
                                    </Col>
                                </Row>
                            </ProForm>
                        </ConfigProvider>
                    </div>
                ) : (
                    <div>
                        Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Rải CV" bạn nhé!
                    </div>
                )}
                <Divider />
            </Modal>
        </>
    );
}

export default ApplyModal;
