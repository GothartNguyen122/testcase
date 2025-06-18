const TestHelper = require('./utils/test-helper');
const assert = require('assert');
const path = require('path');
const { By } = require('selenium-webdriver');

describe('JobHunter - Apply Job Test Cases', function() {
    let testHelper;
    const testUserEmail = process.env.TEST_USER_EMAIL;
    const testUserPassword = process.env.TEST_USER_PASSWORD;
    const testJobId = process.env.TEST_JOB_ID || '1';

    before(async function() {
        testHelper = new TestHelper();
        await testHelper.setupDriver();
    });

    after(async function() {
        await testHelper.teardownDriver();
        await testHelper.cleanupTestFiles();
    });

    beforeEach(async function() {
        // Navigate to home page before each test
        await testHelper.driver.get(testHelper.baseUrl);
    });

    describe('Test Case 1: Ứng tuyển thành công với hồ sơ hợp lệ', function() {
        it('should successfully apply for a job with valid profile', async function() {
            // Login with valid credentials
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to job detail page
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Verify modal title
            const modalTitle = await testHelper.getModalTitle();
            assert.strictEqual(modalTitle, 'Ứng Tuyển Job');
            
            // Create valid CV file
            const validCVPath = path.resolve(__dirname, '../test-files/valid-cv.pdf');
            await testHelper.createTestFile(validCVPath, 'This is a valid CV content');
            
            // Upload CV
            await testHelper.uploadCV(validCVPath);
            
            // Click apply button in modal
            const applyButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
            await applyButton.click();
            
            // Wait for success message
            await testHelper.waitForElement('.ant-message-success', 10000);
            
            // Verify success message
            const successMessage = await testHelper.driver.findElement(By.css('.ant-message-success'));
            const messageText = await successMessage.getText();
            assert.ok(messageText.includes('Ứng tuyển thành công'));
            
            // Verify modal is closed
            const modalPresent = await testHelper.isElementPresent('.ant-modal');
            assert.strictEqual(modalPresent, false);
        });
    });

    describe('Test Case 2: Ứng tuyển khi chưa đăng nhập', function() {
        it('should show login prompt when trying to apply without login', async function() {
            // Navigate to job detail page without login
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Verify modal shows login prompt
            const modalTitle = await testHelper.getModalTitle();
            assert.strictEqual(modalTitle, 'Ứng Tuyển Job');
            
            // Check for login message
            const loginMessage = await testHelper.driver.findElement(By.css('h4'));
            const messageText = await loginMessage.getText();
            assert.strictEqual(messageText, 'Bạn chưa đăng nhập hệ thống');
            
            // Verify login and register buttons are present
            const loginButton = await testHelper.driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
            const registerButton = await testHelper.driver.findElement(By.xpath("//button[contains(text(), 'Đăng ký')]"));
            
            assert.ok(await loginButton.isDisplayed());
            assert.ok(await registerButton.isDisplayed());
            
            // Verify no OK button in footer
            const okButtonPresent = await testHelper.isElementPresent('.ant-modal-footer .ant-btn-primary');
            assert.strictEqual(okButtonPresent, false);
        });
    });

    describe('Test Case 3: Ứng tuyển với file CV sai định dạng', function() {
        it('should reject CV with invalid file format', async function() {
            // Login
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to job detail
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Create invalid CV file (.txt format)
            const invalidCVPath = path.resolve(__dirname, '../test-files/invalid-cv.txt');
            await testHelper.createTestFile(invalidCVPath, 'This is an invalid CV file');
            
            // Try to upload invalid CV
            await testHelper.uploadCV(invalidCVPath);
            
            // Wait for error message
            await testHelper.waitForElement('.ant-message-error', 10000);
            
            // Verify error message
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-message-error'));
            const messageText = await errorMessage.getText();
            assert.ok(messageText.includes('Chỉ hỗ trợ file PDF, DOC, DOCX'));
            
            // Verify file is not uploaded
            const uploadedFile = await testHelper.isElementPresent('.ant-upload-list-item-done');
            assert.strictEqual(uploadedFile, false);
        });
    });

    describe('Test Case 4: Ứng tuyển với file CV quá lớn', function() {
        it('should reject CV file larger than 5MB', async function() {
            // Login
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to job detail
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Create large CV file (6MB)
            const largeCVPath = path.resolve(__dirname, '../test-files/large-cv.pdf');
            await testHelper.createTestFile(largeCVPath, null, 6 * 1024 * 1024); // 6MB
            
            // Try to upload large CV
            await testHelper.uploadCV(largeCVPath);
            
            // Wait for error message
            await testHelper.waitForElement('.ant-message-error', 10000);
            
            // Verify error message
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-message-error'));
            const messageText = await errorMessage.getText();
            assert.ok(messageText.includes('File phải nhỏ hơn 5MB'));
            
            // Verify file is not uploaded
            const uploadedFile = await testHelper.isElementPresent('.ant-upload-list-item-done');
            assert.strictEqual(uploadedFile, false);
        });
    });

    describe('Test Case 5: Ứng tuyển công việc đã hết hạn', function() {
        it('should prevent applying for expired job', async function() {
            // Login
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to expired job (assuming job ID 999 is expired)
            await testHelper.navigateToJobDetail('999');
            
            // Check if job is inactive
            const statusElement = await testHelper.driver.findElement(By.css('.company-detail-meta span'));
            const statusText = await statusElement.getText();
            
            if (statusText.includes('Đã đóng')) {
                // Click apply button
                await testHelper.clickApplyButton();
                
                // Verify alert message
                const alertMessage = await testHelper.getAlertMessage();
                assert.ok(alertMessage.includes('Công việc đã đóng tuyển dụng'));
                
                // Verify apply button is disabled
                const applyButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
                const isDisabled = await applyButton.getAttribute('disabled');
                assert.ok(isDisabled);
                
                // Verify button text
                const buttonText = await applyButton.getText();
                assert.strictEqual(buttonText, 'Đã đóng tuyển dụng');
            } else {
                this.skip('Job is not expired, skipping test');
            }
        });
    });

    describe('Test Case 6: Ứng tuyển công việc đã ứng tuyển trước đó', function() {
        it('should prevent applying for already applied job', async function() {
            // Login
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to job detail
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Check if already applied alert is present
            const alertMessage = await testHelper.getAlertMessage();
            
            if (alertMessage && alertMessage.includes('Đã ứng tuyển')) {
                // Verify alert message
                assert.ok(alertMessage.includes('Đã ứng tuyển'));
                
                // Verify apply button is disabled
                const applyButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
                const isDisabled = await applyButton.getAttribute('disabled');
                assert.ok(isDisabled);
                
                // Verify button text
                const buttonText = await applyButton.getText();
                assert.strictEqual(buttonText, 'Đã ứng tuyển');
            } else {
                // If not applied yet, apply first then check
                const validCVPath = path.resolve(__dirname, '../test-files/valid-cv.pdf');
                await testHelper.createTestFile(validCVPath, 'This is a valid CV content');
                await testHelper.uploadCV(validCVPath);
                
                const applyButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
                await applyButton.click();
                
                // Wait for success and close modal
                await testHelper.waitForElement('.ant-message-success', 10000);
                await testHelper.driver.findElement(By.css('.ant-modal-close')).click();
                
                // Try to apply again
                await testHelper.clickApplyButton();
                
                // Now should see already applied message
                const newAlertMessage = await testHelper.getAlertMessage();
                assert.ok(newAlertMessage.includes('Đã ứng tuyển'));
            }
        });
    });

    describe('Test Case 7: Ứng tuyển khi chưa cập nhật hồ sơ cá nhân', function() {
        it('should show warning when personal profile is incomplete', async function() {
            // Login with user that has incomplete profile
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to job detail
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Check for missing info alert
            const alertMessage = await testHelper.getAlertMessage();
            
            if (alertMessage && alertMessage.includes('Thiếu thông tin cá nhân')) {
                // Verify alert message
                assert.ok(alertMessage.includes('Thiếu thông tin cá nhân'));
                
                // Verify apply button is disabled
                const applyButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
                const isDisabled = await applyButton.getAttribute('disabled');
                assert.ok(isDisabled);
                
                // Verify button text
                const buttonText = await applyButton.getText();
                assert.strictEqual(buttonText, 'Cập nhật thông tin');
                
                // Check for update info button
                const updateButton = await testHelper.driver.findElement(By.xpath("//button[contains(text(), 'Cập nhật thông tin ngay')]"));
                assert.ok(await updateButton.isDisplayed());
            } else {
                this.skip('User profile is complete, skipping test');
            }
        });
    });

    describe('Test Case 8: Ứng tuyển với file CV rỗng', function() {
        it('should reject empty CV file', async function() {
            // Login
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to job detail
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Create empty CV file
            const emptyCVPath = path.resolve(__dirname, '../test-files/empty-cv.pdf');
            await testHelper.createTestFile(emptyCVPath, '');
            
            // Try to upload empty CV
            await testHelper.uploadCV(emptyCVPath);
            
            // Wait for error message
            await testHelper.waitForElement('.ant-message-error', 10000);
            
            // Verify error message
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-message-error'));
            const messageText = await errorMessage.getText();
            assert.ok(messageText.includes('File bị rỗng'));
            
            // Verify file is not uploaded
            const uploadedFile = await testHelper.isElementPresent('.ant-upload-list-item-done');
            assert.strictEqual(uploadedFile, false);
        });
    });

    describe('Test Case 9: Ứng tuyển khi kỹ năng và kinh nghiệm không phù hợp', function() {
        it('should show warning when skills and experience do not match job requirements', async function() {
            // Login
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to job detail
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Check for skill/experience mismatch alert
            const alertMessage = await testHelper.getAlertMessage();
            
            if (alertMessage && alertMessage.includes('Thông tin không phù hợp')) {
                // Verify alert message
                assert.ok(alertMessage.includes('Thông tin không phù hợp'));
                
                // Check for specific warnings
                const alertDescription = await testHelper.driver.findElement(By.css('.ant-alert-description'));
                const descriptionText = await alertDescription.getText();
                
                // Should contain skill or experience mismatch warnings
                assert.ok(descriptionText.includes('Kỹ năng') || descriptionText.includes('Kinh nghiệm'));
                
                // User should still be able to apply (with confirmation)
                const applyButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
                const isDisabled = await applyButton.getAttribute('disabled');
                assert.strictEqual(isDisabled, null); // Button should be enabled
            } else {
                this.skip('Skills and experience match job requirements, skipping test');
            }
        });
    });

    describe('Test Case 10: Ứng tuyển với ký tự đặc biệt trong tên file', function() {
        it('should reject CV file with special characters in filename', async function() {
            // Login
            await testHelper.login(testUserEmail, testUserPassword);
            
            // Navigate to job detail
            await testHelper.navigateToJobDetail(testJobId);
            
            // Click apply button
            await testHelper.clickApplyButton();
            
            // Create CV file with special characters in name
            const specialCharCVPath = path.resolve(__dirname, '../test-files/special@char#cv.pdf');
            await testHelper.createTestFile(specialCharCVPath, 'This is a valid CV content');
            
            // Try to upload CV with special characters
            await testHelper.uploadCV(specialCharCVPath);
            
            // Wait for error message
            await testHelper.waitForElement('.ant-message-error', 10000);
            
            // Verify error message
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-message-error'));
            const messageText = await errorMessage.getText();
            assert.ok(messageText.includes('Tên file không hợp lệ'));
            
            // Verify file is not uploaded
            const uploadedFile = await testHelper.isElementPresent('.ant-upload-list-item-done');
            assert.strictEqual(uploadedFile, false);
        });
    });
}); 