import { callFetchJob, callUserSearchAndFilterJobs } from '@/config/api';
import { convertSlug, getLocationName } from '@/config/utils';
import { IJob } from '@/types/backend';
import { EnvironmentOutlined, ThunderboltOutlined, CodeOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Spin, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import { sfIn } from "spring-filter-query-builder";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


interface IProps {
    showPagination?: boolean;
}

const JobCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery, location]);

    const fetchJob = async () => {
        setIsLoading(true)
        
        // Kiểm tra xem có search/filter parameters không
        const queryKeyword = searchParams.get("keyword");
        const queryCompanyName = searchParams.get("companyName");
        const queryLocation = searchParams.get("location");
        const querySkills = searchParams.get("skills");
        const queryLevel = searchParams.get("level");
        const queryMinSalary = searchParams.get("minSalary");
        const queryMaxSalary = searchParams.get("maxSalary");

        // Nếu có search/filter parameters, sử dụng API mới
        if (queryKeyword || queryCompanyName || queryLocation || querySkills || 
            queryLevel || queryMinSalary || queryMaxSalary) {
            
            let query = `page=${current}&size=${pageSize}`;
            if (sortQuery) {
                query += `&${sortQuery}`;
            }

            // Thêm các parameters vào query
            if (queryKeyword) query += `&keyword=${encodeURIComponent(queryKeyword)}`;
            if (queryCompanyName) query += `&companyName=${encodeURIComponent(queryCompanyName)}`;
            if (queryLocation) query += `&location=${encodeURIComponent(queryLocation)}`;
            if (querySkills) query += `&skills=${encodeURIComponent(querySkills)}`;
            if (queryLevel) query += `&level=${encodeURIComponent(queryLevel)}`;
            if (queryMinSalary) query += `&minSalary=${queryMinSalary}`;
            if (queryMaxSalary) query += `&maxSalary=${queryMaxSalary}`;

            const res = await callUserSearchAndFilterJobs(query);
            if (res && res.data) {
                setDisplayJob(res.data.result);
                setTotal(res.data.meta.total)
            }
        } else {
            // Sử dụng API cũ nếu không có search/filter
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total)
        }
        }
        
        setIsLoading(false);
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

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item.id}`)
    }

    const getTimeDifference = (date?: string): string => {
        if (!date) return 'just now';

        const now = dayjs();
        const diffInDays = now.diff(dayjs(date), 'day');

        if (diffInDays >= 365) {
            const years = Math.floor(diffInDays / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        } else if (diffInDays >= 30) {
            const months = Math.floor(diffInDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (diffInDays >= 1) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
            return 'just now';
        }
    };

    const getLevelColor = (level: string): string => {
        switch (level?.toUpperCase()) {
            case 'INTERN':
                return '#87d068';
            case 'FRESHER':
                return '#2db7f5';
            case 'JUNIOR':
                return '#faad14';
            case 'MIDDLE':
                return '#fa8c16';
            case 'SENIOR':
                return '#f5222d';
            default:
                return '#d9d9d9';
        }
    };

    const getLevelText = (level: string): string => {
        switch (level?.toUpperCase()) {
            case 'INTERN':
                return 'Intern';
            case 'FRESHER':
                return 'Fresher';
            case 'JUNIOR':
                return 'Junior';
            case 'MIDDLE':
                return 'Middle';
            case 'SENIOR':
                return 'Senior';
            default:
                return level || 'N/A';
        }
    };

    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className="job-list-anchor" />
            <div className={`${styles["job-content"]}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[28, 28]}>
                        <Col span={24}>
                            <div className='horizontal-line'></div>
                            
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                        textAlign: 'center',
                                        margin: '20px 0',
                                        padding: '10px 0',
                                        borderBottom: '2px solid #007BFF',
                                        textTransform: 'capitalize',
                                        fontFamily: 'Arial, sans-serif',
                                        transition: 'color 0.3s ease',
                                    }}

                                >
                                    Đề xuất Công Việc Mới Nhất</span>

                                {!showPagination &&
                                    <Link to="job">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayJob?.map(item => (
                            <Col span={24} md={12} key={item.id}>
                                <Card
                                    size="small"
                                    title={null}
                                    hoverable
                                    className={styles["card-job-antd"]}
                                    onClick={() => handleViewDetailJob(item)}
                                    bodyStyle={{ padding: 0, borderRadius: 16 }}
                                    style={{ maxWidth: 500, margin: '0 auto', width: '100%', borderRadius: 16 }}
                                >
                                    <div className={styles["card-job-content"]}>
                                        <div className={styles["card-job-left"]}>
                                            <img
                                                alt="logo"
                                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.company?.logo}`}
                                                className={styles["job-logo"]}
                                            />
                                        </div>
                                        <div className={styles["card-job-right"]}>
                                            <div className={styles["job-title"]}>{item.name}</div>
                                            
                                            {/* Company name */}
                                            <div style={{ 
                                                fontSize: '14px', 
                                                color: '#666', 
                                                marginBottom: '8px',
                                                fontWeight: '500'
                                            }}>
                                                {item.company?.name}
                                            </div>
                                            
                                            {/* Location and Salary */}
                                            <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                                            <div className={styles["job-location"]}>
                                                <EnvironmentOutlined />&nbsp;{getLocationName(item.location)}
                                            </div>
                                            <div className={styles["job-salary"]}>
                                                <ThunderboltOutlined />&nbsp;{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                            </div>
                                            </div>
                                            
                                            {/* Level */}
                                            {item.level && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <Tag 
                                                        icon={<TrophyOutlined />}
                                                        color={getLevelColor(item.level)}
                                                        style={{ 
                                                            borderRadius: '12px',
                                                            padding: '2px 8px',
                                                            fontSize: '12px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {getLevelText(item.level)}
                                                    </Tag>
                                                </div>
                                            )}
                                            
                                            {/* Skills */}
                                            {item.skills && item.skills.length > 0 && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        flexWrap: 'wrap', 
                                                        gap: '4px',
                                                        alignItems: 'center'
                                                    }}>
                                                        <CodeOutlined style={{ 
                                                            color: '#666', 
                                                            fontSize: '12px',
                                                            marginRight: '4px'
                                                        }} />
                                                        {item.skills.slice(0, 3).map((skill, index) => (
                                                            <Tag
                                                                key={index}
                                                                style={{
                                                                    borderRadius: '8px',
                                                                    padding: '1px 6px',
                                                                    fontSize: '11px',
                                                                    backgroundColor: '#f0f0f0',
                                                                    color: '#666',
                                                                    border: 'none',
                                                                    margin: 0
                                                                }}
                                                            >
                                                                {skill.name}
                                                            </Tag>
                                                        ))}
                                                        {item.skills.length > 3 && (
                                                            <span style={{ 
                                                                fontSize: '11px', 
                                                                color: '#999',
                                                                marginLeft: '4px'
                                                            }}>
                                                                +{item.skills.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Time */}
                                            <div className={styles["job-updatedAt"]}>
                                                {getTimeDifference(item.updatedAt ?? item.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}


                        {(!displayJob || displayJob && displayJob.length === 0)
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

export default JobCard;