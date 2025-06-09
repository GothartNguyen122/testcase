import { callFetchCompany } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { ICompany } from '@/types/backend';
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';

interface IProps {
    showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompany();
    }, [current, pageSize, filter, sortQuery]);

    const fetchCompany = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchCompany(query);
        if (res && res.data) {
            setDisplayCompany(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: ICompany) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/company/${slug}?id=${item.id}`)
        }
    }

    return (
        <div className={`${styles["company-section"]}`}>
            <div className={styles["company-content"]}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Nhà Tuyển Dụng Hàng Đầu</span>
                                {!showPagination &&
                                    <Link to="company">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayCompany?.map((item, idx) => (
                            <Col span={24} md={6} key={item.id}>
                                <div className={styles["card-customize"]} onClick={() => handleViewDetailJob(item)} style={{ cursor: 'pointer' }}>
                                    {/* Badge Top lớn */}
                                    {idx < 4 && (
                                        <div className={styles["company-badge"]} style={{ background: idx === 0 ? 'linear-gradient(90deg, #FFD700 0%, #FFB300 100%)' : idx === 1 ? 'linear-gradient(90deg, #B0B0B0 0%, #B0B0B0 100%)' : idx === 2 ? 'linear-gradient(90deg, #CD7F32 0%, #CD7F32 100%)' : 'linear-gradient(90deg, #26d0ce 0%, #1a2980 100%)' }}>
                                            <span style={{fontSize: 20, marginRight: 6}}>🏆</span>Top {idx + 1}
                                        </div>
                                    )}
                                    {/* Logo công ty */}
                                    <img
                                        className={styles["company-logo"]}
                                        alt="logo"
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.logo}`}
                                    />
                                    {/* Tên công ty */}
                                    <div className={styles["company-title"]}>{item.name}</div>
                                    {/* Thông tin phụ */}
                                    <div className={styles["company-info"]}>Ngành nghề: <span style={{color:'#26d0ce'}}>Công nghệ thông tin</span></div>
                                    <div className={styles["company-info"]}>Đang tuyển: <span style={{color:'#ff9800'}}>12 vị trí</span></div>
                                    {/* Link chi tiết */}
                                    <div style={{marginTop: 10}}>
                                        <a href="#" className={styles["company-link"]} onClick={e => { e.stopPropagation(); handleViewDetailJob(item); }}>View details</a>
                                    </div>
                                </div>
                            </Col>
                        ))}

                        {(!displayCompany || displayCompany && displayCompany.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default CompanyCard;