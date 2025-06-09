import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
dayjs.extend(relativeTime)


const ClientJobDetailPage = (props: any) => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
                                </div>
                                <div style={{marginTop:12}}>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles["btn-apply"]}
                                    >Ứng tuyển ngay</button>
                                </div>
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
        </div>
    )
}
export default ClientJobDetailPage;