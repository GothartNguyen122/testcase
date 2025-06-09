import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany } from "@/types/backend";
import { callFetchCompanyById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined, MailOutlined, GlobalOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { FaBuilding, FaMedal } from "react-icons/fa";


const ClientCompanyDetailPage = (props: any) => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCompanyById(id);
                if (res?.data) {
                    setCompanyDetail(res.data)
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
                companyDetail && companyDetail.id && (
                    <div className={styles["company-detail-wrapper"]}>
                        {/* Header: Logo, tên, badge, ngành nghề, địa chỉ */}
                        <div className={styles["company-detail-header"]}>
                            <div className={styles["company-detail-logo-block"]}>
                                <img
                                    className={styles["company-detail-logo"]}
                                    alt="logo"
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${companyDetail?.logo}`}
                                />
                            </div>
                            <div className={styles["company-detail-header-info"]}>
                                <div className={styles["company-detail-title"]}>
                                    <span>{companyDetail.name}</span>
                                    {/* Badge Top giả lập */}
                                    <span className={styles["company-detail-badge"]}><FaMedal style={{color:'#FFD700', marginRight:4}}/>Top Company</span>
                                </div>
                                <div className={styles["company-detail-meta"]}>
                                    <span><FaBuilding style={{color:'#26d0ce', marginRight:4}}/> Công nghệ thông tin</span>
                                    {companyDetail.address && <span style={{marginLeft:16}}><EnvironmentOutlined style={{ color: '#58aaab', marginRight:4 }} />{companyDetail.address}</span>}
                                </div>
                                {/* Website giả lập */}
                                <div className={styles["company-detail-meta"]}>
                                    <span><GlobalOutlined style={{color:'#1a2980', marginRight:4}}/> <a href="#" style={{color:'#1a2980'}}>www.company.com</a></span>
                                </div>
                            </div>
                        </div>

                        {/* Section mô tả công ty */}
                        <div className={styles["company-detail-section"]}>
                            <h3 className={styles["company-detail-section-title"]}><HomeOutlined style={{color:'#26d0ce', marginRight:6}}/>Giới thiệu công ty</h3>
                            <div className={styles["company-detail-desc"]}>{parse(companyDetail?.description ?? "")}</div>
                        </div>

                        {/* Section thông tin liên hệ */}
                        <div className={styles["company-detail-section"]}>
                            <h3 className={styles["company-detail-section-title"]}><PhoneOutlined style={{color:'#26d0ce', marginRight:6}}/>Thông tin liên hệ</h3>
                            <div className={styles["company-detail-contact"]}>
                                <span><MailOutlined style={{color:'#1a2980', marginRight:4}}/> Email: <a href="mailto:info@company.com" style={{color:'#1a2980'}}>info@company.com</a></span>
                                <span style={{marginLeft:16}}><PhoneOutlined style={{color:'#1a2980', marginRight:4}}/> Hotline: 1900 1234</span>
                            </div>
                        </div>

                        {/* Section việc làm đang tuyển (placeholder) */}
                        <div className={styles["company-detail-section"]}>
                            <h3 className={styles["company-detail-section-title"]}><FaBuilding style={{color:'#26d0ce', marginRight:6}}/>Việc làm đang tuyển</h3>
                            <div style={{color:'#aaa'}}>Chức năng hiển thị việc làm sẽ bổ sung sau...</div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
export default ClientCompanyDetailPage;