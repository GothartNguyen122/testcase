import { useAppSelector } from '@/redux/hooks'; // Hook để truy cập vào Redux store
import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row, Carousel } from 'antd';
import styles from 'styles/client.module.scss';
import JobCard from '@/components/client/card/job.card';

const images = [
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
];

const ClientJobPage = (props: any) => {
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
                </Col>
            </Row>
        </div>
    );
}

export default ClientJobPage;
