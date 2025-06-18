-- Script để thêm cột phone vào bảng users
ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL;
 
-- Cập nhật comment cho cột phone
ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) COMMENT 'Số điện thoại của user'; 