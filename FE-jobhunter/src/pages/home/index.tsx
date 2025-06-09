import { Divider, Row, Col, Card } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import { SmileOutlined, ThunderboltOutlined, TeamOutlined } from '@ant-design/icons';

const benefits = [
  {
    icon: <ThunderboltOutlined style={{ fontSize: 36, color: '#ff9800' }} />,
    title: 'Ứng tuyển nhanh',
    desc: 'Chỉ với một cú click, hồ sơ của bạn sẽ đến tay nhà tuyển dụng.'
  },
  {
    icon: <TeamOutlined style={{ fontSize: 36, color: '#1890ff' }} />,
    title: 'Kết nối uy tín',
    desc: 'Hàng ngàn nhà tuyển dụng chất lượng, xác thực thông tin.'
  },
  {
    icon: <SmileOutlined style={{ fontSize: 36, color: '#52c41a' }} />,
    title: 'Cập nhật liên tục',
    desc: 'Việc làm mới được cập nhật mỗi ngày, đa dạng ngành nghề.'
  }
];

const HomePage = () => {
  return (
    <div className={`${styles["container"]} ${styles["home-section"]}`}>  
      {/* Banner với slogan và thanh tìm kiếm */}
      <div className={styles["banner-section"]}>
        <div className={styles["banner-content"]}>
          <h1 className={styles["banner-title"]}>Tìm việc mơ ước của bạn chỉ với một cú click!</h1>
          <p className={styles["banner-desc"]}>Khám phá hàng ngàn cơ hội việc làm IT hấp dẫn, kết nối với nhà tuyển dụng uy tín trên toàn quốc.</p>
          <div className={styles["banner-search"]}>
            <SearchClient />
          </div>
        </div>
      </div>

      {/* Section Công ty nổi bật */}
      <div style={{ marginTop: 40 }}>
        <CompanyCard />
      </div>

      {/* Section Việc làm mới nhất */}
      <div style={{ marginTop: 40 }}>
        <JobCard />
      </div>

      {/* Section Lợi ích */}
      <div className={styles["benefit-section"]}>
        <h2 className={styles["benefit-title"]}>Tại sao chọn JobHunter?</h2>
        <Row gutter={[24, 24]} justify="center">
          {benefits.map((b, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card bordered={false} className={styles["benefit-card"]}>
                <div className={styles["benefit-icon"]}>{b.icon}</div>
                <div className={styles["benefit-card-title"]}>{b.title}</div>
                <div className={styles["benefit-card-desc"]}>{b.desc}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Section Feedback (có thể mở rộng sau) */}
      {/* <div className={styles["feedback-section"]}> */}
      {/*   <h2>Người dùng nói gì về JobHunter?</h2> */}
      {/*   ... */}
      {/* </div> */}
    </div>
  );
};

export default HomePage;
