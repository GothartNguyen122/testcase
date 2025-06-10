import { useAppSelector } from '@/redux/hooks'; // Hook để truy cập vào Redux store
import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row, Carousel } from 'antd';
import styles from 'styles/client.module.scss';
import JobCard from '@/components/client/card/job.card';
import JobClusterCard from '@/components/client/card/job.cluster.card';

const images = [
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
];

const ClientJobPage = (props: any) => {
    // Lấy thông tin người dùng từ Redux store
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);

    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Carousel autoplay autoplaySpeed={2000} style={{ marginBottom: 24, borderRadius: 16, overflow: 'hidden' }}>
                {images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                        <img src={img} alt={`IT Banner ${idx + 1}`} style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 16 }} />
                    </div>
                ))}
            </Carousel>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <SearchClient />
                </Col>
                <Divider style={{ borderWidth: 1, borderColor: 'rgb(0 0 0)' }} />
                <Col span={24}>
                    <JobCard
                        showPagination={true}
                    />
                    <Divider style={{ borderWidth: 1, borderColor: 'rgb(0 0 0)' }} />
                    {/* Kiểm tra nếu người dùng đã đăng nhập thì hiển thị JobClusterCard */}
                    {isAuthenticated && user ? (
                        <JobClusterCard
                            showPagination={true}
                            userId={user.id}  // Truyền userId cho JobClusterCard nếu có
                        />
                    ) : (
                        <div>Vui lòng đăng nhập để xem các công việc đề xuất phù hợp với bạn.</div>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default ClientJobPage;
