import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined, TrophyOutlined } from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
import ManageAccount from "@/components/client/modal/manage.account";
dayjs.extend(relativeTime)

// Helper function để hiển thị level
const getLevelDisplay = (level: string) => {
    switch (level?.toUpperCase()) {
        case 'INTERN':
            return { text: 'Thực tập sinh', color: '#87d068' };
        case 'FRESHER':
            return { text: 'Mới tốt nghiệp', color: '#52c41a' };
        case 'JUNIOR':
            return { text: 'Junior', color: '#1890ff' };
        case 'MIDDLE':
            return { text: 'Middle', color: '#722ed1' };
        case 'SENIOR':
            return { text: 'Senior', color: '#fa8c16' };
        default:
            return { text: level || 'Không yêu cầu', color: '#d9d9d9' };
    }
};

const ClientJobDetailPage = (props: any) => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateInfoModalOpen, setIsUpdateInfoModalOpen] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchJobById(id);
                if (res?.data) {
                    setJobDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    // Lắng nghe event để mở modal cập nhật thông tin
    useEffect(() => {
        const handleOpenUpdateInfoModal = () => {
            setIsUpdateInfoModalOpen(true);
        };

        window.addEventListener('openUpdateInfoModal', handleOpenUpdateInfoModal);

        return () => {
            window.removeEventListener('openUpdateInfoModal', handleOpenUpdateInfoModal);
        };
    }, []);

    // Callback khi cập nhật thông tin thành công
    const handleUpdateInfoSuccess = () => {
        setIsUpdateInfoModalOpen(false);
        // Mở lại modal apply sau khi cập nhật thành công
        setTimeout(() => {
            setIsModalOpen(true);
        }, 500);
    };

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                jobDetail && jobDetail.id && (
                    <div className={styles["company-detail-wrapper"]}>
                        {/* Header: Logo, tên job, badge, info hàng ngang */}
                        <div className={styles["company-detail-header"]}>
                            <div className={styles["company-detail-logo-block"]}>
                                <img
                                    className={styles["company-detail-logo"]}
                                    alt="logo"
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company?.logo}`}
                                />
                            </div>
                            <div className={styles["company-detail-header-info"]}>
                                <div className={styles["company-detail-title"]}>
                                    <span>{jobDetail.name}</span>
                                    <span className={styles["company-detail-badge"]}><DollarOutlined style={{color:'#FFD700', marginRight:4}}/>Hot Job</span>
                                </div>
                                <div className={styles["company-detail-meta"]}>
                                    <span><EnvironmentOutlined style={{ color: '#58aaab', marginRight:4 }} />{getLocationName(jobDetail.location)}</span>
                                    <span><DollarOutlined style={{color:'#26d0ce', marginRight:4}}/> {(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                    <span><HistoryOutlined style={{color:'#aaa', marginRight:4}}/> {jobDetail.updatedAt ? dayjs(jobDetail.updatedAt).locale("en").fromNow() : dayjs(jobDetail.createdAt).locale("en").fromNow()}</span>
                                </div>
                                <div className={styles["company-detail-meta"]}>
                                    <span style={{fontWeight:600, color:'#1a2980'}}>Công ty: {jobDetail.company?.name}</span>
                                    {jobDetail.level && (
                                        <span><TrophyOutlined style={{color:'#ff6b35', marginRight:4}}/> Yêu cầu kinh nghiệm: <Tag color="orange">{getLevelDisplay(jobDetail.level).text}</Tag></span>
                                    )}
                                </div>
                                <div className={styles["company-detail-meta"]}>
                                    <span style={{fontWeight:600, color: jobDetail.active ? '#52c41a' : '#ff4d4f'}}>
                                        Trạng thái: {jobDetail.active ? 'Đang tuyển' : 'Đã đóng'}
                                    </span>
                                </div>
                                <div style={{marginTop:12}}>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles["btn-apply"]}
                                        disabled={!jobDetail.active}
                                    >
                                        {jobDetail.active ? 'Ứng tuyển ngay' : 'Đã đóng tuyển dụng'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section thông tin yêu cầu */}
                        <div className={styles["company-detail-section"]}>
                            <h3 className={styles["company-detail-section-title"]}>Thông tin yêu cầu</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                {jobDetail.level && (
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        padding: '8px 16px', 
                                        backgroundColor: '#fff7e6', 
                                        borderRadius: 8, 
                                        border: '1px solid #ffd591' 
                                    }}>
                                        <TrophyOutlined style={{ color: '#ff6b35', marginRight: 8 }} />
                                        <span style={{ fontWeight: 500 }}>Kinh nghiệm:</span>
                                        <Tag color="orange" style={{ marginLeft: 8 }}>{getLevelDisplay(jobDetail.level).text}</Tag>
                                    </div>
                                )}
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '8px 16px', 
                                    backgroundColor: '#f6ffed', 
                                    borderRadius: 8, 
                                    border: '1px solid #b7eb8f' 
                                }}>
                                    <DollarOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                    <span style={{ fontWeight: 500 }}>Mức lương:</span>
                                    <span style={{ marginLeft: 8, color: '#52c41a', fontWeight: 600 }}>
                                        {(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                    </span>
                                </div>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '8px 16px', 
                                    backgroundColor: '#e6f7ff', 
                                    borderRadius: 8, 
                                    border: '1px solid #91d5ff' 
                                }}>
                                    <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                                    <span style={{ fontWeight: 500 }}>Địa điểm:</span>
                                    <span style={{ marginLeft: 8, color: '#1890ff' }}>
                                        {getLocationName(jobDetail.location)}
                                    </span>
                                </div>
                                {jobDetail.quantity && (
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        padding: '8px 16px', 
                                        backgroundColor: '#f9f0ff', 
                                        borderRadius: 8, 
                                        border: '1px solid #d3adf7' 
                                    }}>
                                        <span style={{ color: '#722ed1', marginRight: 8 }}>👥</span>
                                        <span style={{ fontWeight: 500 }}>Số lượng:</span>
                                        <span style={{ marginLeft: 8, color: '#722ed1', fontWeight: 600 }}>
                                            {jobDetail.quantity} người
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section kỹ năng yêu cầu */}
                        <div className={styles["company-detail-section"]}>
                            <h3 className={styles["company-detail-section-title"]}>Kỹ năng yêu cầu</h3>
                            <div className={styles["skills"]}>
                                {jobDetail?.skills?.map((item, index) => (
                                    <Tag key={`${index}-key`} color="gold" >
                                        {item.name}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        {/* Section mô tả công việc */}
                        <div className={styles["company-detail-section"]}>
                            <h3 className={styles["company-detail-section-title"]}>Mô tả công việc</h3>
                            <div className={styles["company-detail-desc"]}>{parse(jobDetail.description)}</div>
                        </div>
                    </div>
                )
            }
            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                jobDetail={jobDetail}
            />
            <ManageAccount
                open={isUpdateInfoModalOpen}
                onClose={setIsUpdateInfoModalOpen}
                onSuccess={handleUpdateInfoSuccess}
            />
        </div>
    )
}
export default ClientJobDetailPage;