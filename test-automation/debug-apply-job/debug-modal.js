#!/usr/bin/env node

const TestHelper = require('../test/utils/test-helper');
const { By, until } = require('selenium-webdriver');

async function debugModal() {
    let testHelper;
    
    try {
        console.log('🔍 Debug chi tiết Modal ứng tuyển...\n');
        
        // Khởi tạo và đăng nhập
        console.log('1️⃣ Khởi tạo và đăng nhập...');
        testHelper = new TestHelper();
        await testHelper.setupDriver();
        await testHelper.login(process.env.TEST_USER_EMAIL, process.env.TEST_USER_PASSWORD);
        await testHelper.navigateToJobDetail(process.env.TEST_JOB_ID || '1');
        console.log('✅ Đã sẵn sàng\n');
        
        // Nhấp nút ứng tuyển
        console.log('2️⃣ Nhấp nút ứng tuyển...');
        await testHelper.clickApplyButton();
        console.log('✅ Đã nhấp nút ứng tuyển\n');
        
        // Chờ modal xuất hiện
        console.log('3️⃣ Chờ modal xuất hiện...');
        await testHelper.driver.wait(until.elementLocated(By.css('.ant-modal')), 10000);
        console.log('✅ Modal đã xuất hiện\n');
        
        // Chờ thêm 2 giây để modal load hoàn toàn
        console.log('4️⃣ Chờ modal load hoàn toàn...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Đã chờ 2 giây\n');
        
        // Kiểm tra các element trong modal
        console.log('5️⃣ Kiểm tra các element trong modal...\n');
        
        // Kiểm tra modal container
        try {
            const modal = await testHelper.driver.findElement(By.css('.ant-modal'));
            console.log('✅ Tìm thấy .ant-modal');
        } catch (error) {
            console.log('❌ Không tìm thấy .ant-modal');
        }
        
        // Kiểm tra modal header
        try {
            const modalHeader = await testHelper.driver.findElement(By.css('.ant-modal-header'));
            console.log('✅ Tìm thấy .ant-modal-header');
        } catch (error) {
            console.log('❌ Không tìm thấy .ant-modal-header');
        }
        
        // Kiểm tra modal title với nhiều selector khác nhau
        console.log('\n6️⃣ Kiểm tra modal title...');
        
        const titleSelectors = [
            '.ant-modal-title',
            '.ant-modal-header .ant-modal-title',
            'h4',
            '.modal-title',
            '[data-testid="modal-title"]',
            '.ant-modal-header h4',
            '.ant-modal-header .title'
        ];
        
        for (const selector of titleSelectors) {
            try {
                const titleElement = await testHelper.driver.findElement(By.css(selector));
                const titleText = await titleElement.getText();
                console.log(`📍 ${selector}: "${titleText}"`);
            } catch (error) {
                console.log(`❌ ${selector}: Không tìm thấy`);
            }
        }
        
        // Kiểm tra tất cả text trong modal header
        console.log('\n7️⃣ Kiểm tra tất cả text trong modal header...');
        try {
            const modalHeader = await testHelper.driver.findElement(By.css('.ant-modal-header'));
            const headerText = await modalHeader.getText();
            console.log(`📍 Text trong header: "${headerText}"`);
        } catch (error) {
            console.log('❌ Không thể lấy text trong header');
        }
        
        // Kiểm tra tất cả h1, h2, h3, h4 trong modal
        console.log('\n8️⃣ Kiểm tra tất cả heading trong modal...');
        const headings = ['h1', 'h2', 'h3', 'h4'];
        for (const heading of headings) {
            try {
                const elements = await testHelper.driver.findElements(By.css(heading));
                for (let i = 0; i < elements.length; i++) {
                    const text = await elements[i].getText();
                    console.log(`📍 ${heading}[${i}]: "${text}"`);
                }
            } catch (error) {
                console.log(`❌ Không tìm thấy ${heading}`);
            }
        }
        
        // Kiểm tra tất cả text có chứa "Ứng" hoặc "Tuyển"
        console.log('\n9️⃣ Kiểm tra text chứa "Ứng" hoặc "Tuyển"...');
        try {
            const allElements = await testHelper.driver.findElements(By.xpath("//*[contains(text(), 'Ứng') or contains(text(), 'Tuyển')]"));
            for (let i = 0; i < allElements.length; i++) {
                const text = await allElements[i].getText();
                const tagName = await allElements[i].getTagName();
                console.log(`📍 ${tagName}[${i}]: "${text}"`);
            }
        } catch (error) {
            console.log('❌ Không tìm thấy text chứa "Ứng" hoặc "Tuyển"');
        }
        
        // Chụp ảnh modal
        console.log('\n🔟 Chụp ảnh modal...');
        await testHelper.takeScreenshot('debug-modal');
        console.log('✅ Đã chụp ảnh: debug-modal.png');
        
        // Lấy HTML của modal
        console.log('\n1️⃣1️⃣ Lấy HTML của modal...');
        try {
            const modal = await testHelper.driver.findElement(By.css('.ant-modal'));
            const modalHTML = await testHelper.driver.executeScript("return arguments[0].outerHTML;", modal);
            console.log('📍 HTML của modal:');
            console.log(modalHTML.substring(0, 500) + '...'); // Chỉ hiển thị 500 ký tự đầu
        } catch (error) {
            console.log('❌ Không thể lấy HTML của modal');
        }
        
    } catch (error) {
        console.log('❌ LỖI:', error.message);
        console.log('🔍 Stack trace:', error.stack);
        
        if (testHelper && testHelper.driver) {
            try {
                await testHelper.takeScreenshot('debug-modal-error');
                console.log('📸 Đã chụp ảnh lỗi: debug-modal-error.png');
            } catch (screenshotError) {
                console.log('❌ Không thể chụp ảnh lỗi:', screenshotError.message);
            }
        }
    } finally {
        if (testHelper && testHelper.driver) {
            console.log('\n🧹 Dọn dẹp...');
            await testHelper.teardownDriver();
            console.log('✅ Đã đóng driver');
        }
    }
}

// Chạy debug
debugModal().catch(console.error); 