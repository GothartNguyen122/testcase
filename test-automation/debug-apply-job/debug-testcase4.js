const { By } = require('selenium-webdriver');
require('dotenv').config();
const path = require('path');
const TestHelper = require('../test/utils/test-helper');

(async function debugTestCase4() {
    const helper = new TestHelper();
    let driver;
    try {
        console.log('🚀 [Bước 1] Khởi tạo trình duyệt và đăng nhập...');
        await helper.setupDriver();
        driver = helper.driver;

        const email = process.env.TEST_USER_EMAIL;
        const password = process.env.TEST_USER_PASSWORD;
        const jobId = process.env.TEST_JOB_ID;
        const jobSlug = process.env.TEST_JOB_SLUG;
        if (!email || !password || !jobId || !jobSlug) {
            throw new Error('⚠️ Thiếu biến môi trường TEST_USER_EMAIL, TEST_USER_PASSWORD, TEST_JOB_ID hoặc TEST_JOB_SLUG trong file .env');
        }

        await helper.login(email, password);
        console.log('✅ Đăng nhập thành công!');

        console.log('🌐 [Bước 2] Truy cập trang chi tiết công việc...');
        await helper.navigateToJobDetail(jobId);
        console.log('✅ Đã vào trang chi tiết job!');

        console.log('🖱️ [Bước 3] Nhấn nút "Ứng tuyển ngay"...');
        await helper.clickApplyButton();
        console.log('✅ Đã nhấn nút ứng tuyển!');

        // Tạo file CV quá lớn (6MB)
        const largeCVPath = path.resolve(__dirname, './test-files/large-cv.pdf');
        await helper.createTestFile(largeCVPath, null, 6 * 1024 * 1024); // 6MB
        console.log('📄 [Bước 4] Đã tạo file CV quá lớn:', largeCVPath);

        // Thử upload file quá lớn
        console.log('📤 [Bước 5] Thử upload file CV quá lớn...');
        await helper.uploadCV(largeCVPath, true);

        // Chờ message lỗi và chờ thêm 1.5s để message render xong
        await helper.waitForElement('.ant-message-error', 10000);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const errorMessages = await driver.findElements(By.css('.ant-message-error'));
        let found = false;
        for (let i = 0; i < errorMessages.length; i++) {
            const text = await errorMessages[i].getText();
            console.log(`  [${i+1}] ${text}`);
            if (text.includes('File phải nhỏ hơn 5MB')) found = true;
        }
        if (found) {
            console.log('✅ Hiển thị đúng thông báo lỗi: File phải nhỏ hơn 5MB');
        } else {
            console.log('❌ Không tìm thấy message lỗi đúng nội dung!');
            await helper.takeScreenshot('debug-tc4-error-message');
        }

        // Đảm bảo file không được upload thành công
        const uploadedFile = await helper.isElementPresent('.ant-upload-list-item-done');
        if (!uploadedFile) {
            console.log('✅ File quá lớn KHÔNG được upload thành công.');
            console.log('🎉 TEST CASE 4: PASS!');
        } else {
            console.log('❌ File quá lớn vẫn được upload!');
            await helper.takeScreenshot('debug-tc4-uploaded');
            console.log('❌ TEST CASE 4: FAIL!');
        }
    } catch (err) {
        console.error('❌ Lỗi trong quá trình debug:', err.message);
        if (helper && helper.driver) {
            await helper.takeScreenshot('debug-tc4-exception');
        }
    } finally {
        if (helper) await helper.teardownDriver();
        console.log('🛑 Đã đóng trình duyệt.');
    }
})(); 