#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const testCases = [
    { id: 1, name: "Ứng tuyển thành công với hồ sơ hợp lệ" },
    { id: 2, name: "Ứng tuyển khi chưa đăng nhập" },
    { id: 3, name: "Ứng tuyển với file CV sai định dạng" },
    { id: 4, name: "Ứng tuyển với file CV quá lớn" },
    { id: 5, name: "Ứng tuyển công việc đã hết hạn" },
    { id: 6, name: "Ứng tuyển công việc đã ứng tuyển trước đó" },
    { id: 7, name: "Ứng tuyển khi chưa cập nhật hồ sơ cá nhân" },
    { id: 8, name: "Ứng tuyển với file CV rỗng" },
    { id: 9, name: "Ứng tuyển khi kỹ năng và kinh nghiệm không phù hợp" },
    { id: 10, name: "Ứng tuyển với ký tự đặc biệt trong tên file" }
];

function showMenu() {
    console.log('\n=== JOBHUNTER APPLY JOB TEST CASES ===');
    console.log('Chọn testcase để chạy:\n');
    
    testCases.forEach((testCase, index) => {
        console.log(`${index + 1}. Test Case ${testCase.id}: ${testCase.name}`);
    });
    
    console.log('\n0. Chạy tất cả testcase');
    console.log('q. Thoát');
    console.log('\nNhập lựa chọn của bạn:');
}

function runTest(testCaseId) {
    const command = `npx mocha --timeout 30000 test/apply-job.test.js --grep "Test Case ${testCaseId}:"`;
    
    console.log(`\n🚀 Đang chạy Test Case ${testCaseId}...`);
    console.log(`📋 Lệnh thực thi: ${command}\n`);
    
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`\n✅ Test Case ${testCaseId} đã hoàn thành thành công!`);
    } catch (error) {
        console.log(`\n❌ Test Case ${testCaseId} đã thất bại!`);
    }
}

function runAllTests() {
    console.log('\n🚀 Đang chạy tất cả testcase...\n');
    
    try {
        execSync('npm run test:apply', { stdio: 'inherit' });
        console.log('\n✅ Tất cả testcase đã hoàn thành thành công!');
    } catch (error) {
        console.log('\n❌ Một số testcase đã thất bại!');
    }
}

function main() {
    showMenu();
    
    rl.on('line', (input) => {
        const choice = input.trim();
        
        if (choice === 'q' || choice === 'quit') {
            console.log('\n👋 Tạm biệt!');
            rl.close();
            return;
        }
        
        if (choice === '0') {
            runAllTests();
        } else {
            const testIndex = parseInt(choice) - 1;
            
            if (testIndex >= 0 && testIndex < testCases.length) {
                const testCase = testCases[testIndex];
                runTest(testCase.id);
            } else {
                console.log('❌ Lựa chọn không hợp lệ! Vui lòng chọn từ 0-10 hoặc q để thoát.');
            }
        }
        
        setTimeout(() => {
            showMenu();
        }, 1000);
    });
}

// Kiểm tra xem có đang ở đúng thư mục không
const fs = require('fs');
if (!fs.existsSync('test/apply-job.test.js')) {
    console.log('❌ Vui lòng chạy script này từ thư mục test-automation!');
    console.log('📁 Hãy đảm bảo bạn đang ở đúng thư mục chứa file test/apply-job.test.js');
    process.exit(1);
}

main(); 