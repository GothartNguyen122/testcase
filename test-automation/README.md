# JobHunter Test Automation

Dự án test automation cho hệ thống JobHunter sử dụng Mocha và Selenium WebDriver.

## Cấu trúc thư mục

```
test-automation/
├── test/
│   ├── utils/
│   │   └── test-helper.js          # Utility functions cho test
│   └── apply-job.test.js           # Test cases cho usecase Apply Job
├── test-files/                     # Thư mục chứa file test
├── screenshots/                    # Screenshots khi test fail
├── package.json
├── env.example
└── README.md
```

## Cài đặt

1. **Cài đặt dependencies:**

```bash
npm install
```

2. **Cài đặt ChromeDriver:**

```bash
npm run install:driver
```

3. **Cấu hình environment:**

```bash
cp env.example .env
# Chỉnh sửa file .env với thông tin phù hợp
```

## Chạy test

### Chạy tất cả test cases:

```bash
npm test
```

### Chạy riêng test Apply Job:

```bash
npm run test:apply
```

### Chạy test ở chế độ headless:

```bash
npm run test:headless
```

### Chạy Selenium standalone server:

```bash
npm run start:driver
```

## Test Cases

### 1. Ứng tuyển thành công với hồ sơ hợp lệ

- **Mục đích**: Kiểm tra quy trình apply job thành công
- **Precondition**: User đã đăng nhập, có đầy đủ thông tin
- **Input**: Upload CV hợp lệ, click "Ứng tuyển"
- **Expected**: Hiển thị message thành công, modal đóng

### 2. Ứng tuyển khi chưa đăng nhập

- **Mục đích**: Kiểm tra redirect khi chưa đăng nhập
- **Precondition**: User chưa đăng nhập
- **Input**: Click "Ứng tuyển"
- **Expected**: Hiển thị modal login, không có nút OK

### 3. Ứng tuyển với file CV sai định dạng

- **Mục đích**: Validate file format
- **Input**: Upload file .txt
- **Expected**: Hiển thị lỗi "Chỉ hỗ trợ file PDF, DOC, DOCX"

### 4. Ứng tuyển với file CV quá lớn

- **Mục đích**: Validate file size
- **Input**: Upload file >5MB
- **Expected**: Hiển thị lỗi "File phải nhỏ hơn 5MB"

### 5. Ứng tuyển công việc đã hết hạn

- **Mục đích**: Kiểm tra job status
- **Input**: Apply job đã đóng
- **Expected**: Nút bị disabled, hiển thị "Đã đóng tuyển dụng"

### 6. Ứng tuyển công việc đã ứng tuyển trước đó

- **Mục đích**: Kiểm tra duplicate apply
- **Input**: Apply job đã apply trước đó
- **Expected**: Hiển thị "Đã ứng tuyển", nút bị disabled

### 7. Ứng tuyển khi chưa cập nhật hồ sơ cá nhân

- **Mục đích**: Kiểm tra validation thông tin cá nhân
- **Input**: User thiếu phone/skills/level
- **Expected**: Hiển thị cảnh báo thiếu thông tin

### 8. Ứng tuyển với file CV rỗng

- **Mục đích**: Validate file content
- **Input**: Upload file rỗng
- **Expected**: Hiển thị lỗi "File bị rỗng"

### 9. Ứng tuyển khi kỹ năng và kinh nghiệm không phù hợp

- **Mục đích**: Kiểm tra warning mismatch
- **Input**: User có skills/level không phù hợp
- **Expected**: Hiển thị cảnh báo nhưng vẫn cho phép apply

### 10. Ứng tuyển với ký tự đặc biệt trong tên file

- **Mục đích**: Validate filename
- **Input**: Upload file có tên chứa ký tự đặc biệt
- **Expected**: Hiển thị lỗi "Tên file không hợp lệ"

## Cấu hình

### Environment Variables (.env)

```env
BASE_URL=http://localhost:3000
BACKEND_URL=http://localhost:8080
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test123456
BROWSER=chrome
HEADLESS=false
TEST_JOB_ID=1
```

### Test Data

- Tạo user test với đầy đủ thông tin
- Tạo job test với các trạng thái khác nhau
- Chuẩn bị các file test trong thư mục `test-files/`

## Troubleshooting

### Lỗi ChromeDriver

```bash
# Cập nhật ChromeDriver
npm install chromedriver@latest
```

### Lỗi timeout

- Tăng timeout trong `package.json`: `--timeout 60000`
- Kiểm tra kết nối mạng
- Kiểm tra server đang chạy

### Lỗi element not found

- Kiểm tra CSS selectors trong test
- Đảm bảo page đã load hoàn toàn
- Sử dụng `waitForElement()` thay vì `findElement()`

## Best Practices

1. **Isolation**: Mỗi test case độc lập, không phụ thuộc nhau
2. **Cleanup**: Dọn dẹp data sau mỗi test
3. **Screenshots**: Chụp ảnh khi test fail để debug
4. **Retry**: Implement retry logic cho flaky tests
5. **Parallel**: Chạy test song song để tăng tốc

## CI/CD Integration

### GitHub Actions

```yaml
name: Test Automation
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
    }
}
```
