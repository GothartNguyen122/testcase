import { Button, Col, Form, Row, Select, notification, Input, Slider, Card, Divider, Space } from 'antd';
import { EnvironmentOutlined, MonitorOutlined, SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { LOCATION_LIST, LEVEL_LIST } from '@/config/utils';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const { Search } = Input;

const SearchClient = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const optionsLocations = LOCATION_LIST;
    const optionsLevels = LEVEL_LIST;
    const [optionsSkills, setOptionsSkills] = useState<{ label: string, value: string }[]>([]);
    const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);
    const [keywordValue, setKeywordValue] = useState<string>('');
    const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100]);
    const [locationValue, setLocationValue] = useState<string[]>([]);
    const [skillsValue, setSkillsValue] = useState<string[]>([]);
    const [levelValue, setLevelValue] = useState<string[]>([]);
    const [form] = Form.useForm();

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchSkill();
        loadFormFromURL();
        
        // Tự động mở bộ lọc nâng cao nếu có filter parameters
        const params = new URLSearchParams(window.location.search);
        const hasFilters = params.get('companyName') || params.get('location') || 
                          params.get('skills') || params.get('level') || 
                          params.get('minSalary') || params.get('maxSalary');
        
        if (hasFilters) {
            setIsAdvancedVisible(true);
        }
    }, [location.search]);

    const loadFormFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        
        // Load keyword
        const keyword = params.get('keyword');
        if (keyword) {
            form.setFieldValue('keyword', keyword);
        }
        
        // Load location
        const location = params.get('location');
        if (location) {
            const locationArray = location.split(',');
            setLocationValue(locationArray);
            form.setFieldValue('location', locationArray);
        }
        
        // Load skills
        const skills = params.get('skills');
        if (skills) {
            const skillsArray = skills.split(',');
            setSkillsValue(skillsArray);
            form.setFieldValue('skills', skillsArray);
        }
        
        // Load level
        const level = params.get('level');
        if (level) {
            const levelArray = level.split(',');
            setLevelValue(levelArray);
            form.setFieldValue('level', levelArray);
        }
        
        // Load salary range
        const minSalary = params.get('minSalary');
        const maxSalary = params.get('maxSalary');
        if (minSalary || maxSalary) {
            const minSalaryMillion = minSalary ? parseInt(minSalary) / 1000000 : 0;
            const maxSalaryMillion = maxSalary ? parseInt(maxSalary) / 1000000 : 100;
            setSalaryRange([minSalaryMillion, maxSalaryMillion]);
        }
    };

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr = res?.data?.result?.map(item => {
                return {
                    label: item.name as string,
                    value: item.name as string
                }
            }) ?? [];
            setOptionsSkills(arr);
        }
    }

    const onFinish = async (values: any) => {
        console.log('onFinish called with values:', values);
        console.log('Current salary range:', salaryRange);
        console.log('Current state values - location:', locationValue, 'skills:', skillsValue, 'level:', levelValue);
        
        let query = "";
        const params = new URLSearchParams();

        // Search parameters - ưu tiên keywordValue nếu có
        const keywordToUse = values?.keyword?.trim() || keywordValue?.trim();
        if (keywordToUse) {
            params.append("keyword", keywordToUse);
        }

        // Filter parameters - sử dụng state values
        if (locationValue.length > 0) {
            params.append("location", locationValue.join(","));
        }
        if (skillsValue.length > 0) {
            params.append("skills", skillsValue.join(","));
        }
        if (levelValue.length > 0) {
            params.append("level", levelValue.join(","));
        }

        // Salary range từ state - chuyển đổi từ triệu VND sang VND
        const minSalaryVND = salaryRange[0] * 1000000;
        const maxSalaryVND = salaryRange[1] * 1000000;
        params.append("minSalary", minSalaryVND.toString());
        params.append("maxSalary", maxSalaryVND.toString());

        query = params.toString();
        console.log('Final query:', query);
        console.log('URL parameters:');
        for (const [key, value] of params.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Cho phép tìm kiếm ngay cả khi không có tiêu chí nào (sẽ hiển thị tất cả jobs)
        navigate(`/job?${query}`, { preventScrollReset: true });
    }

    const handleReset = () => {
        form.resetFields();
        setSalaryRange([0, 100]);
        setLocationValue([]);
        setSkillsValue([]);
        setLevelValue([]);
        navigate('/job');
    }

    return (
        <Card className="search-card" style={{ marginBottom: 24 }}>
            <Form
            form={form}
            onFinish={onFinish}
        >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <h2>Việc Làm IT Cho Developer "Chất"</h2>
                    </Col>
                    
                    {/* Tìm kiếm nhanh */}
                    <Col span={24}>
                        <div style={{ marginBottom: 16 }}>
                            <Form.Item name="keyword">
                                <Input
                                    placeholder="Tìm kiếm theo tên công việc, mô tả..."
                                    size="large"
                                    suffix={
                                        <Button 
                                            type="primary" 
                                            icon={<SearchOutlined />}
                                            onClick={() => {
                                                const values = form.getFieldsValue();
                                                console.log('Search button clicked, values:', values);
                                                onFinish(values);
                                            }}
                                        />
                                    }
                                />
                            </Form.Item>
                        </div>
                    </Col>

                    {/* Toggle bộ lọc nâng cao */}
                    <Col span={24}>
                        <Button 
                            type="link" 
                            icon={<FilterOutlined />}
                            onClick={() => setIsAdvancedVisible(!isAdvancedVisible)}
                            style={{ padding: 0 }}
                        >
                            {isAdvancedVisible ? 'Ẩn bộ lọc' : 'Hiện bộ lọc nâng cao'}
                        </Button>
                    </Col>

                    {/* Bộ lọc nâng cao */}
                    {isAdvancedVisible && (
                        <>
                            <Divider style={{ margin: '16px 0' }} />
                            
                            <Col span={24} md={8}>
                                <div style={{ marginBottom: 8 }}>
                                    <label style={{ fontWeight: 500 }}>Địa điểm</label>
                                </div>
                                <Form.Item name="location">
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                                <EnvironmentOutlined /> Chọn địa điểm...
                                </>
                            }
                            optionLabelProp="label"
                                        options={optionsLocations}
                                        onChange={(value) => {
                                            console.log('Location changed:', value);
                                            setLocationValue(value || []);
                                        }}
                        />
                                </Form.Item>
                </Col>

                            <Col span={24} md={8}>
                                <div style={{ marginBottom: 8 }}>
                                    <label style={{ fontWeight: 500 }}>Kỹ năng</label>
                                </div>
                                <Form.Item name="skills">
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                                <MonitorOutlined /> Chọn kỹ năng...
                                </>
                            }
                            optionLabelProp="label"
                                        options={optionsSkills}
                                        onChange={(value) => {
                                            console.log('Skills changed:', value);
                                            setSkillsValue(value || []);
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={8}>
                                <div style={{ marginBottom: 8 }}>
                                    <label style={{ fontWeight: 500 }}>Cấp độ</label>
                                </div>
                                <Form.Item name="level">
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Chọn cấp độ..."
                                        optionLabelProp="label"
                                        options={optionsLevels}
                                        onChange={(value) => {
                                            console.log('Level changed:', value);
                                            setLevelValue(value || []);
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={8}>
                                <div style={{ marginBottom: 8 }}>
                                    <label style={{ fontWeight: 500 }}>Khoảng lương (triệu VND)</label>
                                </div>
                                <Slider
                                    range
                                    min={0}
                                    max={100}
                                    value={salaryRange}
                                    onChange={(value: any) => {
                                        console.log('Salary range changed:', value);
                                        setSalaryRange(value);
                                    }}
                                    tooltip={{
                                        formatter: (value) => `${value} triệu`
                                    }}
                                />
                </Col>

                            <Col span={24} md={8}>
                                <Space style={{ marginTop: 32 }}>
                                    <Button type='primary' onClick={() => {
                                        console.log('Submit button clicked');
                                        const currentValues = form.getFieldsValue();
                                        console.log('Current form values before submit:', currentValues);
                                        form.submit();
                                    }}>
                                        <SearchOutlined /> Tìm kiếm
                                    </Button>
                                    <Button onClick={handleReset}>
                                        <ReloadOutlined /> Làm mới
                                    </Button>
                                </Space>
                </Col>
                        </>
                    )}
            </Row>
            </Form>
        </Card>
    )
}

export default SearchClient;