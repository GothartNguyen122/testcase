-- Script để thêm cột active vào bảng jobs (nếu chưa có)
-- Kiểm tra xem cột active đã tồn tại chưa
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'jobs' 
     AND COLUMN_NAME = 'active') > 0,
    'SELECT "Column active already exists" as message',
    'ALTER TABLE jobs ADD COLUMN active BOOLEAN DEFAULT TRUE'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cập nhật comment cho cột active
ALTER TABLE jobs MODIFY COLUMN active BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái hoạt động của job (TRUE = đang tuyển, FALSE = đã đóng)'; 