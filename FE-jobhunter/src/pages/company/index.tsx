import { Col, Row, Carousel } from 'antd';
import styles from 'styles/client.module.scss';
import CompanyCard from '@/components/client/card/company.card';

const ClientCompanyPage = (props: any) => {
    const images = [
        // Googleplex (Google HQ)
        "https://s3.ap-southeast-1.amazonaws.com/thcmedia.vn/wp-content/uploads/2020/08/26121949/4-cong-ty-IT-lon-tren-the-gioi-1.jpg",
        // Apple Park (Apple HQ)
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
        // Microsoft Redmond Campus
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=1600&q=80"
    ];

    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Carousel autoplay autoplaySpeed={2000} style={{ marginBottom: 24, borderRadius: 16, overflow: 'hidden', maxHeight: 320 }}>
                {images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                        <img src={img} alt={`IT Company HQ ${idx + 1}`} style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 16 }} />
                    </div>
                ))}
            </Carousel>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CompanyCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientCompanyPage;