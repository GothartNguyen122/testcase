const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();
const TestHelper = require('../test/utils/test-helper');

(async function debugTestCase2() {
    const helper = new TestHelper();
    let driver;
    try {
        console.log('🚀 [Bước 1] Khởi tạo trình duyệt...');
        await helper.setupDriver();
        driver = helper.driver;

        const jobId = process.env.TEST_JOB_ID;
        const jobSlug = process.env.TEST_JOB_SLUG;
        if (!jobId || !jobSlug) {
            throw new Error('⚠️ Thiếu TEST_JOB_ID hoặc TEST_JOB_SLUG trong file .env');
        }

        console.log('🌐 [Bước 2] Truy cập trang chi tiết công việc...');
        await helper.navigateToJobDetail(jobId);
        console.log('✅ Đã vào trang chi tiết job!');

        // Đảm bảo chưa đăng nhập (nếu có nút đăng nhập trên header)
        try {
            const loginBtn = await driver.findElement(By.css('a[href="/login"]'));
            if (loginBtn) {
                console.log('🔒 Đang ở trạng thái chưa đăng nhập.');
            }
        } catch (e) {
            console.log('⚠️ Không tìm thấy nút đăng nhập, có thể đã đăng nhập sẵn. Hãy đăng xuất trước khi test!');
        }

        console.log('🖱️ [Bước 3] Nhấn nút "Ứng tuyển ngay"...');
        await helper.clickApplyButton();
        console.log('✅ Đã nhấn nút ứng tuyển!');

        // [Bước 4] Kiểm tra modal có thông báo đúng và không có nút ứng tuyển
        let pass = true;
        try {
            // Chờ div cha của modal xuất hiện trước
            const parentDivXpath = "//div[contains(@style, 'text-align: center') and contains(@style, 'padding: 20px 0px')]";
            await driver.wait(until.elementLocated(By.xpath(parentDivXpath)), 5000);
            const parentDiv = await driver.findElement(By.xpath(parentDivXpath));

            // Sau đó chờ h4 xuất hiện trong div cha
            const h4Elem = await parentDiv.findElement(By.xpath(".//h4[text()='Bạn chưa đăng nhập hệ thống']"));
            const modalText = await h4Elem.getText();
            if (modalText.includes('Bạn chưa đăng nhập hệ thống')) {
                console.log('✅ Modal hiển thị đúng thông báo: Bạn chưa đăng nhập hệ thống');
            } else {
                console.log('❌ Modal KHÔNG hiển thị đúng thông báo!');
                pass = false;
            }
        } catch (e) {
            console.log('❌ Không tìm thấy thông báo "Bạn chưa đăng nhập hệ thống" trong modal!');
            // Thử log toàn bộ text của div cha để debug
            try {
                const parentDivXpath = "//div[contains(@style, 'text-align: center') and contains(@style, 'padding: 20px 0px')]";
                const parentDiv = await driver.findElement(By.xpath(parentDivXpath));
                const allParentText = await parentDiv.getText();
                console.log('--- Toàn bộ text div cha modal để debug ---');
                console.log(allParentText);
                console.log('------------------------------------------');
            } catch (e2) {
                console.log('Không lấy được text div cha modal:', e2.message);
            }
            pass = false;
        }

        // Kiểm tra không có nút "Ứng tuyển" trong modal
        let applyBtnPresent = false;
        try {
            await driver.findElement(By.xpath("//button[.//span[text()='Ứng tuyển']]"));
            applyBtnPresent = true;
        } catch (e) {
            // Không tìm thấy là đúng
        }
        if (!applyBtnPresent) {
            console.log('✅ Không có nút "Ứng tuyển" trong modal khi chưa đăng nhập.');
        } else {
            console.log('❌ VẪN có nút "Ứng tuyển" trong modal!');
            pass = false;
        }

        if (pass) {
            console.log('🎉 TEST CASE 2: PASS!');
        } else {
            console.log('❌ TEST CASE 2: FAIL!');
            await helper.takeScreenshot('debug-tc2-error');
        }
    } catch (err) {
        console.error('❌ Lỗi trong quá trình debug:', err.message);
        if (helper && helper.driver) {
            await helper.takeScreenshot('debug-tc2-exception');
        }
    } finally {
        if (helper) await helper.teardownDriver();
        console.log('🛑 Đã đóng trình duyệt.');
    }
})(); 