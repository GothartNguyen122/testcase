#!/usr/bin/env node

const { execSync } = require('child_process');

// Lấy testcase number từ command line argument
const testCaseNumber = process.argv[2];

if (!testCaseNumber) {
    console.log('❌ Vui lòng cung cấp số testcase!');
    console.log('📝 Cách sử dụng: node quick-test.js <số_testcase>');
    console.log('📝 Ví dụ: node quick-test.js 1');
    console.log('📝 Hoặc: node quick-test.js all (để chạy tất cả)');
    process.exit(1);
}

if (testCaseNumber === 'all') {
    console.log('🚀 Đang chạy tất cả testcase...');
    try {
        execSync('npm run test:apply', { stdio: 'inherit' });
        console.log('✅ Tất cả testcase đã hoàn thành thành công!');
    } catch (error) {
        console.log('❌ Có lỗi xảy ra khi chạy testcase!');
    }
} else {
    const testNumber = parseInt(testCaseNumber);
    
    if (testNumber < 1 || testNumber > 10) {
        console.log('❌ Số testcase phải từ 1 đến 10!');
        console.log('📝 Vui lòng nhập số từ 1-10 hoặc "all" để chạy tất cả');
        process.exit(1);
    }
    
    console.log(`🚀 Đang chạy Test Case ${testNumber}...`);
    
    try {
        execSync(`npx mocha --timeout 30000 test/apply-job.test.js --grep "Test Case ${testNumber}:"`, { stdio: 'inherit' });
        console.log(`✅ Test Case ${testNumber} đã hoàn thành thành công!`);
    } catch (error) {
        console.log(`❌ Test Case ${testNumber} đã thất bại!`);
    }
} 