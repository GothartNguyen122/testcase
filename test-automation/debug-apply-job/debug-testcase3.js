const { By, until } = require('selenium-webdriver');
require('dotenv').config();
const path = require('path');
const TestHelper = require('../test/utils/test-helper');

(async function debugTestCase3() {
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

        // Tạo file CV không hợp lệ (định dạng .txt)
        const invalidCVPath = path.resolve(__dirname, './test-files/invalid-cv.txt');
        await helper.createTestFile(invalidCVPath, 'Đây là file CV không hợp lệ');
        console.log('📄 [Bước 4] Đã tạo file CV sai định dạng:', invalidCVPath);

        // Thử upload file không hợp lệ
        console.log('📤 [Bước 5] Thử upload file CV sai định dạng...');
        await helper.uploadCV(invalidCVPath, true);

        // Không chờ waitForElement('.ant-upload-list-item-done', ...) nữa!
        // Kiểm tra thông báo lỗi
        let messageText = '';
        try {
            await helper.waitForElement('.ant-message-error', 10000);
            // Chờ thêm 1.5 giây để message render xong
            await new Promise(resolve => setTimeout(resolve, 1500));
            const errorMessages = await driver.findElements(By.css('.ant-message-error'));
            if (errorMessages.length === 0) {
                console.log('❌ Không tìm thấy message lỗi nào!');
            } else {
                console.log(`🔎 Có ${errorMessages.length} message lỗi trên trang:`);
                for (let i = 0; i < errorMessages.length; i++) {
                    const text = await errorMessages[i].getText();
                    console.log(`  [${i+1}] ${text}`);
                    if (text.includes('Chỉ hỗ trợ file PDF, DOC, DOCX')) messageText = text;
                }
            }
        } catch (e) {
            console.log('❌ Không tìm thấy thông báo lỗi!');
        }
        if (messageText.includes('Chỉ hỗ trợ file PDF, DOC, DOCX')) {
            console.log('✅ Hiển thị đúng thông báo lỗi:', messageText);
        } else {
            console.log('❌ Thông báo lỗi không đúng:', messageText);
            await helper.takeScreenshot('debug-tc3-error-message');
        }

        // Đảm bảo file không được upload thành công
        const uploadedFile = await helper.isElementPresent('.ant-upload-list-item-done');
        if (!uploadedFile) {
            console.log('✅ File sai định dạng KHÔNG được upload thành công.');
            console.log('🎉 TEST CASE 3: PASS!');
        } else {
            console.log('❌ File sai định dạng vẫn được upload!');
            await helper.takeScreenshot('debug-tc3-uploaded');
            console.log('❌ TEST CASE 3: FAIL!');
        }
    } catch (err) {
        console.error('❌ Lỗi trong quá trình debug:', err.message);
        if (helper && helper.driver) {
            await helper.takeScreenshot('debug-tc3-exception');
        }
    } finally {
        if (helper) await helper.teardownDriver();
        console.log('🛑 Đã đóng trình duyệt.');
    }
})(); 