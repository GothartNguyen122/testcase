# 🧪 Hướng dẫn chạy test Apply Job

## 📋 Danh sách 10 Testcase

1. **Test Case 1**: Ứng tuyển thành công với hồ sơ hợp lệ
2. **Test Case 2**: Ứng tuyển khi chưa đăng nhập
3. **Test Case 3**: Ứng tuyển với file CV sai định dạng
4. **Test Case 4**: Ứng tuyển với file CV quá lớn
5. **Test Case 5**: Ứng tuyển công việc đã hết hạn
6. **Test Case 6**: Ứng tuyển công việc đã ứng tuyển trước đó
7. **Test Case 7**: Ứng tuyển khi chưa cập nhật hồ sơ cá nhân
8. **Test Case 8**: Ứng tuyển với file CV rỗng
9. **Test Case 9**: Ứng tuyển khi kỹ năng và kinh nghiệm không phù hợp
10. **Test Case 10**: Ứng tuyển với ký tự đặc biệt trong tên file

## 🚀 Cách chạy test

### Phương pháp 1: Menu tương tác (Khuyến nghị)

```bash
npm run test:menu
```

Sau đó chọn số testcase từ 1-10, hoặc 0 để chạy tất cả.

### Phương pháp 2: Script nhanh

```bash
# Chạy testcase cụ thể
node quick-test.js 1    # Chạy Test Case 1
node quick-test.js 5    # Chạy Test Case 5
node quick-test.js all  # Chạy tất cả testcase
```

### Phương pháp 3: Lệnh trực tiếp

```bash
# Chạy testcase cụ thể
npx mocha --timeout 30000 test/apply-job.test.js --grep "Test Case 1"
npx mocha --timeout 30000 test/apply-job.test.js --grep "Test Case 2"

# Chạy tất cả testcase
npm run test:apply
```

## ⚙️ Cài đặt trước khi chạy

1. **Cài đặt dependencies:**

```bash
npm install
```

2. **Cấu hình environment:**

```bash
cp env.example .env
# Chỉnh sửa file .env với thông tin test user
```

### 🔧 Các biến môi trường quan trọng:

```bash
# URL của ứng dụng
BASE_URL=http://localhost:3000

# Thông tin đăng nhập test
TEST_USER_EMAIL=your-test-email@example.com
TEST_USER_PASSWORD=your-test-password

# Thông tin công việc test
TEST_JOB_ID=1                    # ID của công việc để test
TEST_JOB_SLUG=frontend-developer # Slug của công việc (ví dụ: frontend-developer)

# Cấu hình browser
HEADLESS=false                   # true để chạy ẩn browser
```

**Lưu ý quan trọng về TEST_JOB_SLUG:**

- Đây là slug của công việc trong URL (ví dụ: `frontend-developer`)
- URL đầy đủ sẽ là: `http://localhost:3000/job/frontend-developer?id=1`
- Nếu không set, mặc định sẽ là `frontend-developer`

3. **Khởi động Selenium (nếu cần):**

```bash
npm run start:driver
```

4. **Đảm bảo ứng dụng JobHunter đang chạy**

## 📝 Ví dụ sử dụng

```bash
# Vào thư mục test-automation
cd test-automation

# Chạy menu tương tác
npm run test:menu

# Hoặc chạy nhanh testcase 3
node quick-test.js 3

# Hoặc chạy tất cả
node quick-test.js all
```

## 🔧 Xử lý sự cố (Troubleshooting)

### Lỗi thường gặp:

- **❌ "Vui lòng chạy script này từ thư mục test-automation"**

  - **Nguyên nhân**: Bạn đang không ở đúng thư mục
  - **Giải pháp**: Đảm bảo bạn đang ở thư mục `test-automation` chứa file `test/apply-job.test.js`

- **❌ "Lỗi Selenium"**

  - **Nguyên nhân**: Selenium server chưa được khởi động
  - **Giải pháp**: Chạy `npm run start:driver` trước khi chạy test

- **❌ "Lỗi timeout"**

  - **Nguyên nhân**: Test chạy quá lâu do mạng chậm hoặc ứng dụng chậm
  - **Giải pháp**: Tăng timeout trong lệnh mocha (ví dụ: `--timeout 60000`)

- **❌ "Lỗi kết nối"**

  - **Nguyên nhân**: Ứng dụng JobHunter chưa chạy
  - **Giải pháp**: Đảm bảo frontend và backend đang chạy

- **❌ "Lỗi thông tin đăng nhập"**

  - **Nguyên nhân**: Thông tin trong file `.env` không đúng
  - **Giải pháp**: Kiểm tra và cập nhật thông tin trong file `.env`

- **❌ "Lỗi không tìm thấy trang công việc"**
  - **Nguyên nhân**: `TEST_JOB_SLUG` không đúng hoặc công việc không tồn tại
  - **Giải pháp**: Kiểm tra slug công việc trong URL và cập nhật `TEST_JOB_SLUG`

### Thông báo thành công:

- **✅ "Test Case X đã hoàn thành thành công!"** - Testcase đã chạy thành công
- **✅ "Tất cả testcase đã hoàn thành thành công!"** - Tất cả testcase đã chạy thành công

### Thông báo lỗi:

- **❌ "Test Case X đã thất bại!"** - Testcase có lỗi, kiểm tra log để biết chi tiết
- **❌ "Một số testcase đã thất bại!"** - Một số testcase có lỗi
- **❌ "Lựa chọn không hợp lệ!"** - Bạn đã nhập sai số, hãy chọn từ 0-10

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:

1. File log trong console
2. Đảm bảo tất cả dependencies đã được cài đặt
3. Kiểm tra kết nối mạng
4. Đảm bảo ứng dụng JobHunter đang chạy ổn định
5. Kiểm tra các biến môi trường trong file `.env`
