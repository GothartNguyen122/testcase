# Hướng Dẫn Sử Dụng Tính Năng Tìm Kiếm & Lọc Job

## Tổng Quan

Hệ thống đã được cập nhật với tính năng tìm kiếm và lọc đầy đủ cho user, bao gồm:

### 🔍 **Tìm Kiếm (Search)**

- **Từ khóa**: Tìm kiếm theo tên công việc, mô tả
- **Tên công ty**: Tìm kiếm theo tên công ty

### 🎯 **Lọc (Filter)**

- **Địa điểm**: Hà Nội, Hồ Chí Minh, Đà Nẵng, Khác
- **Kỹ năng**: React.JS, Java, Frontend, Backend, v.v.
- **Cấp độ**: Intern, Junior, Middle, Senior, Lead, Manager
- **Khoảng lương**: Từ 0-100 triệu VND

## Cách Sử Dụng

### 1. Tìm Kiếm Nhanh

- Nhập từ khóa vào ô tìm kiếm chính
- Nhấn Enter hoặc click nút tìm kiếm
- Hệ thống sẽ tìm trong tên job và mô tả

### 2. Bộ Lọc Nâng Cao

- Click "Hiện bộ lọc nâng cao" để mở rộng
- Chọn các tiêu chí lọc:
  - **Tên công ty**: Nhập tên công ty cụ thể
  - **Địa điểm**: Chọn một hoặc nhiều địa điểm
  - **Kỹ năng**: Chọn một hoặc nhiều kỹ năng
  - **Cấp độ**: Chọn một hoặc nhiều cấp độ
  - **Khoảng lương**: Kéo thanh trượt để chọn khoảng lương

### 3. Kết Hợp Tìm Kiếm & Lọc

- Có thể kết hợp cả tìm kiếm và lọc
- Ví dụ: Tìm "React" + Lọc "Hà Nội" + "Junior"

## API Endpoints

### Backend

```
GET /api/v1/jobs/user-search
```

**Parameters:**

- `keyword` (optional): Từ khóa tìm kiếm
- `companyName` (optional): Tên công ty
- `location` (optional): Địa điểm (comma-separated)
- `skills` (optional): Kỹ năng (comma-separated)
- `level` (optional): Cấp độ (comma-separated)
- `minSalary` (optional): Lương tối thiểu
- `maxSalary` (optional): Lương tối đa
- `page` (optional): Trang hiện tại
- `size` (optional): Số lượng item/trang

### Frontend

```typescript
// API call
callUserSearchAndFilterJobs(query: string)

// Example query
"page=1&size=6&keyword=react&location=HANOI,HOCHIMINH&skills=JAVA,REACT.JS&level=JUNIOR&minSalary=10&maxSalary=50"
```

## Cấu Trúc Code

### Backend

- **JobController**: Thêm endpoint `/jobs/user-search`
- **JobService**: Thêm method `userSearchAndFilter()`
- **Specification**: Xây dựng dynamic query với JPA Criteria

### Frontend

- **SearchClient**: Component tìm kiếm nâng cao
- **JobCard**: Cập nhật logic fetch data
- **API Config**: Thêm `callUserSearchAndFilterJobs()`

## Tính Năng Đặc Biệt

### 1. Tương Thích Ngược

- Nếu không có search/filter parameters, sử dụng API cũ
- Đảm bảo không ảnh hưởng đến admin search

### 2. URL State Management

- Tất cả parameters được lưu trong URL
- Có thể bookmark và share URL
- Refresh page không mất state

### 3. Responsive Design

- Giao diện responsive cho mobile
- Bộ lọc nâng cao có thể ẩn/hiện

### 4. Performance

- Debounce search để tránh gọi API quá nhiều
- Pagination để load data hiệu quả

## Ví Dụ Sử Dụng

### Tìm kiếm đơn giản:

```
/job?keyword=react
```

### Lọc theo địa điểm và kỹ năng:

```
/job?location=HANOI,HOCHIMINH&skills=JAVA,REACT.JS
```

### Tìm kiếm + Lọc phức tạp:

```
/job?keyword=developer&companyName=google&location=HANOI&skills=JAVA&level=JUNIOR&minSalary=10&maxSalary=50
```

## Lưu Ý

1. **Case-insensitive**: Tìm kiếm không phân biệt hoa thường
2. **Partial match**: Tìm kiếm theo từ khóa một phần
3. **Multiple values**: Có thể chọn nhiều giá trị cho location, skills, level
4. **Salary range**: Lương được tính theo triệu VND
5. **Pagination**: Mặc định 6 jobs/trang

## Troubleshooting

### Lỗi thường gặp:

1. **Không có kết quả**: Kiểm tra lại từ khóa và bộ lọc
2. **API error**: Kiểm tra backend logs
3. **UI không responsive**: Kiểm tra CSS và component props

### Debug:

- Mở Developer Tools để xem network requests
- Kiểm tra console logs
- Verify URL parameters
