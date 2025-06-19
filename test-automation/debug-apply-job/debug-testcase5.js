const { By, until } = require('selenium-webdriver');
require('dotenv').config();
const TestHelper = require('../test/utils/test-helper');

(async function debugTestCase5() {
    const helper = new TestHelper();
    let driver;
    try {
        console.log('🚀 [Bước 1] Khởi tạo trình duyệt và đăng nhập...');
        await helper.setupDriver();
        driver = helper.driver;

        const email = process.env.TEST_USER_EMAIL;
        const password = process.env.TEST_USER_PASSWORD;
        const jobId = '11';
        const jobSlug = 'fullstack-software-engineer';
        if (!email || !password) {
            throw new Error('⚠️ Thiếu biến môi trường TEST_USER_EMAIL hoặc TEST_USER_PASSWORD trong file .env');
        }

        await helper.login(email, password);
        console.log('✅ Đăng nhập thành công!');

        console.log('🌐 [Bước 2] Truy cập trang chi tiết công việc đã hết hạn...');
        await helper.navigateToJobDetail(jobId, jobSlug);
        console.log('✅ Đã vào trang chi tiết job!');

        // Kiểm tra trạng thái job đã đóng
        let statusText = '';
        try {
            console.log('🔍 Đang tìm trạng thái job...');
            // Chờ element chứa text "Đã đóng" xuất hiện
            await driver.wait(
                until.elementLocated(By.xpath("//*[contains(text(), 'Đã đóng') or contains(text(), 'Đã đóng tuyển dụng') ]")),
                10000
            );
            const statusElement = await driver.findElement(By.xpath("//*[contains(text(), 'Đã đóng') or contains(text(), 'Đã đóng tuyển dụng') ]"));
            statusText = await statusElement.getText();
            console.log('🔎 Trạng thái job:', statusText);
        } catch (e) {
            console.log('❌ Không tìm thấy trạng thái job! Lỗi:', e.message);
            // Thử tìm với selector khác
            try {
                console.log('🔄 Thử tìm với selector khác...');
                const allElements = await driver.findElements(By.xpath("//*[contains(text(), 'Đã đóng')]"));
                console.log(`Tìm thấy ${allElements.length} element chứa \"Đã đóng\"`);
                for (let i = 0; i < allElements.length; i++) {
                    const text = await allElements[i].getText();
                    console.log(`Element ${i + 1}: \"${text}\"`);
                }
            } catch (e2) {
                console.log('Không tìm thấy element nào chứa \"Đã đóng\"');
            }
            // Log toàn bộ text body để debug
            try {
                const body = await driver.findElement(By.css('body'));
                const allText = await body.getText();
                console.log('--- Toàn bộ text body để debug ---');
                console.log(allText);
                console.log('-----------------------------------');
            } catch (e2) {
                console.log('Không lấy được text body:', e2.message);
            }
        }

        if (!statusText.includes('Đã đóng')) {
            console.log('❌ Job chưa hết hạn hoặc không đúng trạng thái "Đã đóng"!');
            await helper.takeScreenshot('debug-tc5-status');
            return;
        }

        console.log('✅ Job đã đóng, kiểm tra nút ứng tuyển...');


        // Kiểm tra nút "Ứng tuyển ngay" không còn hiển thị hoặc bị disable
        try {
            const applyButton = await driver.findElement(By.xpath("//button[text()='Ứng tuyển ngay']"));
            const isDisabled = await applyButton.getAttribute('disabled');
            if (isDisabled) {
                console.log('✅ Nút "Ứng tuyển ngay" đã bị disable. PASS TEST CASE!');
            } else {
                console.log('❌ Nút "Ứng tuyển ngay" vẫn còn enable!');
                await helper.takeScreenshot('debug-tc5-apply-btn-enabled');
            }
        } catch (e) {
            console.log('✅ Không tìm thấy nút "Ứng tuyển ngay". PASS TEST CASE!');
        }
    } catch (err) {
        console.error('❌ Lỗi trong quá trình debug:', err.message);
        if (helper && helper.driver) {
            await helper.takeScreenshot('debug-tc5-exception');
        }
    } finally {
        if (helper) await helper.teardownDriver();
        console.log('🛑 Đã đóng trình duyệt.');
    }
})(); 