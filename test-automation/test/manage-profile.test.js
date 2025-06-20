const TestHelper = require('./utils/test-helper');
const assert = require('assert');
const { By, until } = require('selenium-webdriver');

describe('JobHunter - Manage Profile Test Cases', function() {
    let testHelper;
    const testUserEmail = process.env.TEST_USER_EMAIL;
    const testUserPassword = process.env.TEST_USER_PASSWORD;

    before(async function() {
        testHelper = new TestHelper();
        await testHelper.setupDriver();
    });

    after(async function() {
        await testHelper.teardownDriver();
    });

    beforeEach(async function() {
        // Login before each test
        await testHelper.login(testUserEmail, testUserPassword);
        
        // Navigate to manage account page
        await testHelper.driver.get(`${testHelper.baseUrl}/home`);
        await testHelper.waitForElement('.user-menu', 10000);
        
        // Click on user menu and select manage account
        await testHelper.driver.findElement(By.css('.user-menu')).click();
        await testHelper.waitForElement('.manage-account-btn', 5000);
        await testHelper.driver.findElement(By.css('.manage-account-btn')).click();
        
        // Wait for modal to appear
        await testHelper.waitForElement('.ant-modal', 10000);
    });

    describe('Test Case 1: Nhập họ tên quá ngắn (< 2 ký tự) hoặc quá dài (> 50 ký tự)', function() {
        it('should validate name length constraints', async function() {
            // Test name too short (< 2 characters)
            const nameInput = await testHelper.driver.findElement(By.css('input[name="name"]'));
            await nameInput.clear();
            await nameInput.sendKeys('A');
            
            // Try to save
            const saveButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText = await errorMessage.getText();
            assert.ok(errorText.includes('Họ tên phải có ít nhất 2 ký tự'), 'Should show error for short name');

            // Test name too long (> 50 characters)
            await nameInput.clear();
            const longName = 'A'.repeat(51);
            await nameInput.sendKeys(longName);
            
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage2 = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText2 = await errorMessage2.getText();
            assert.ok(errorText2.includes('Họ tên không được quá 50 ký tự'), 'Should show error for long name');
        });
    });

    describe('Test Case 2: Nhập tuổi < 16 hoặc > 100, tuổi có ký tự đặc biệt', function() {
        it('should validate age constraints and special characters', async function() {
            const ageInput = await testHelper.driver.findElement(By.css('input[name="age"]'));
            
            // Test age too young (< 16)
            await ageInput.clear();
            await ageInput.sendKeys('15');
            
            const saveButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText = await errorMessage.getText();
            assert.ok(errorText.includes('Tuổi phải từ 16 đến 100'), 'Should show error for age < 16');

            // Test age too old (> 100)
            await ageInput.clear();
            await ageInput.sendKeys('101');
            
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage2 = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText2 = await errorMessage2.getText();
            assert.ok(errorText2.includes('Tuổi phải từ 16 đến 100'), 'Should show error for age > 100');

            // Test special characters in age
            await ageInput.clear();
            await ageInput.sendKeys('25abc');
            
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage3 = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText3 = await errorMessage3.getText();
            assert.ok(errorText3.includes('Tuổi chỉ được chứa số'), 'Should show error for special characters in age');
        });
    });

    describe('Test Case 3: Nhập địa chỉ < 5 ký tự hoặc > 100 ký tự', function() {
        it('should validate address length constraints', async function() {
            const addressInput = await testHelper.driver.findElement(By.css('input[name="address"]'));
            
            // Test address too short (< 5 characters)
            await addressInput.clear();
            await addressInput.sendKeys('HN');
            
            const saveButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText = await errorMessage.getText();
            assert.ok(errorText.includes('Địa chỉ phải có ít nhất 5 ký tự'), 'Should show error for short address');

            // Test address too long (> 100 characters)
            await addressInput.clear();
            const longAddress = 'A'.repeat(101);
            await addressInput.sendKeys(longAddress);
            
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage2 = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText2 = await errorMessage2.getText();
            assert.ok(errorText2.includes('Địa chỉ không được quá 100 ký tự'), 'Should show error for long address');
        });
    });

    describe('Test Case 4: Nhập số điện thoại có ký tự không cho phép hoặc >15 kí tự', function() {
        it('should validate phone number format and length', async function() {
            const phoneInput = await testHelper.driver.findElement(By.css('input[name="phone"]'));
            
            // Test phone with special characters
            await phoneInput.clear();
            await phoneInput.sendKeys('0123456789abc');
            
            const saveButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText = await errorMessage.getText();
            assert.ok(errorText.includes('Số điện thoại chỉ được chứa số'), 'Should show error for phone with special characters');

            // Test phone too long (> 15 characters)
            await phoneInput.clear();
            await phoneInput.sendKeys('0123456789012345');
            
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage2 = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText2 = await errorMessage2.getText();
            assert.ok(errorText2.includes('Số điện thoại không được quá 15 ký tự'), 'Should show error for long phone');
        });
    });

    describe('Test Case 5: Nhập mức lương âm hoặc > 1 tỷ', function() {
        it('should validate salary range constraints', async function() {
            const salaryInput = await testHelper.driver.findElement(By.css('input[name="salary"]'));
            
            // Test negative salary
            await salaryInput.clear();
            await salaryInput.sendKeys('-1000000');
            
            const saveButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText = await errorMessage.getText();
            assert.ok(errorText.includes('Mức lương không được âm'), 'Should show error for negative salary');

            // Test salary too high (> 1 billion)
            await salaryInput.clear();
            await salaryInput.sendKeys('1000000001');
            
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage2 = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText2 = await errorMessage2.getText();
            assert.ok(errorText2.includes('Mức lương không được quá 1 tỷ'), 'Should show error for salary > 1 billion');
        });
    });

    describe('Test Case 6: Chọn > 10 kỹ năng', function() {
        it('should limit skills selection to maximum 10', async function() {
            const skillsSelect = await testHelper.driver.findElement(By.css('.ant-select-skills'));
            await skillsSelect.click();
            
            // Select 11 skills
            const skillOptions = await testHelper.driver.findElements(By.css('.ant-select-item-option'));
            let selectedCount = 0;
            
            for (let i = 0; i < Math.min(11, skillOptions.length); i++) {
                try {
                    await skillOptions[i].click();
                    selectedCount++;
                    await testHelper.driver.sleep(500);
                } catch (error) {
                    break;
                }
            }
            
            // Check if selection is limited
            const selectedSkills = await testHelper.driver.findElements(By.css('.ant-select-selection-item'));
            assert.ok(selectedSkills.length <= 10, 'Should not allow more than 10 skills');
            
            // Check for warning message if more than 10
            if (selectedCount > 10) {
                const warningMessage = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
                const warningText = await warningMessage.getText();
                assert.ok(warningText.includes('Chỉ được chọn tối đa 10 kỹ năng'), 'Should show warning for too many skills');
            }
        });
    });

    describe('Test Case 7: Cập nhật thông tin khi bỏ trống họ tên', function() {
        it('should prevent saving when name is empty', async function() {
            const nameInput = await testHelper.driver.findElement(By.css('input[name="name"]'));
            await nameInput.clear();
            
            const saveButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText = await errorMessage.getText();
            assert.ok(errorText.includes('Vui lòng nhập họ tên'), 'Should show error for empty name');
            
            // Verify save button is disabled
            const isDisabled = await saveButton.getAttribute('disabled');
            assert.ok(isDisabled, 'Save button should be disabled when name is empty');
        });
    });

    describe('Test Case 8: Cập nhật thông tin khi bỏ trống tuổi', function() {
        it('should prevent saving when age is empty', async function() {
            const ageInput = await testHelper.driver.findElement(By.css('input[name="age"]'));
            await ageInput.clear();
            
            const saveButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
            await saveButton.click();
            
            // Check for validation error
            await testHelper.waitForElement('.ant-form-item-explain-error', 5000);
            const errorMessage = await testHelper.driver.findElement(By.css('.ant-form-item-explain-error'));
            const errorText = await errorMessage.getText();
            assert.ok(errorText.includes('Vui lòng nhập tuổi'), 'Should show error for empty age');
            
            // Verify save button is disabled
            const isDisabled = await saveButton.getAttribute('disabled');
            assert.ok(isDisabled, 'Save button should be disabled when age is empty');
        });
    });

    describe('Test Case 9: Rút CV với trạng thái REVIEWING', function() {
        it('should allow withdrawing CV with REVIEWING status', async function() {
            // Navigate to CV history section
            const cvHistoryTab = await testHelper.driver.findElement(By.xpath("//div[contains(text(), 'Lịch sử CV')]"));
            await cvHistoryTab.click();
            
            // Wait for CV history to load
            await testHelper.waitForElement('.cv-history-section', 10000);
            
            // Find CV with REVIEWING status
            const reviewingCVs = await testHelper.driver.findElements(By.xpath("//div[contains(@class, 'cv-item') and contains(., 'REVIEWING')]"));
            
            if (reviewingCVs.length > 0) {
                const firstReviewingCV = reviewingCVs[0];
                
                // Click withdraw button
                const withdrawButton = await firstReviewingCV.findElement(By.css('.withdraw-btn'));
                await withdrawButton.click();
                
                // Confirm withdrawal
                await testHelper.waitForElement('.ant-modal-confirm', 5000);
                const confirmButton = await testHelper.driver.findElement(By.css('.ant-btn-primary'));
                await confirmButton.click();
                
                // Check success message
                await testHelper.waitForElement('.ant-message-success', 10000);
                const successMessage = await testHelper.driver.findElement(By.css('.ant-message-success'));
                const messageText = await successMessage.getText();
                assert.ok(messageText.includes('Rút CV thành công'), 'Should show success message for withdrawal');
            } else {
                this.skip('No CV with REVIEWING status found');
            }
        });
    });

    describe('Test Case 10: Rút CV với các trạng thái APPROVED', function() {
        it('should prevent withdrawing CV with APPROVED status', async function() {
            // Navigate to CV history section
            const cvHistoryTab = await testHelper.driver.findElement(By.xpath("//div[contains(text(), 'Lịch sử CV')]"));
            await cvHistoryTab.click();
            
            // Wait for CV history to load
            await testHelper.waitForElement('.cv-history-section', 10000);
            
            // Find CV with APPROVED status
            const approvedCVs = await testHelper.driver.findElements(By.xpath("//div[contains(@class, 'cv-item') and contains(., 'APPROVED')]"));
            
            if (approvedCVs.length > 0) {
                const firstApprovedCV = approvedCVs[0];
                
                // Check if withdraw button is disabled or not present
                const withdrawButtons = await firstApprovedCV.findElements(By.css('.withdraw-btn'));
                
                if (withdrawButtons.length > 0) {
                    const withdrawButton = withdrawButtons[0];
                    const isDisabled = await withdrawButton.getAttribute('disabled');
                    assert.ok(isDisabled, 'Withdraw button should be disabled for APPROVED CV');
                } else {
                    // If no withdraw button, that's also correct
                    assert.ok(true, 'No withdraw button for APPROVED CV');
                }
                
                // Try to click withdraw button if it exists and is not disabled
                try {
                    const withdrawButton = await firstApprovedCV.findElement(By.css('.withdraw-btn:not([disabled])'));
                    await withdrawButton.click();
                    
                    // Should show error message
                    await testHelper.waitForElement('.ant-message-error', 5000);
                    const errorMessage = await testHelper.driver.findElement(By.css('.ant-message-error'));
                    const messageText = await errorMessage.getText();
                    assert.ok(messageText.includes('Không thể rút CV đã được phê duyệt'), 'Should show error for APPROVED CV withdrawal');
                } catch (error) {
                    // Expected - button should be disabled
                    assert.ok(true, 'Withdraw button is properly disabled for APPROVED CV');
                }
            } else {
                this.skip('No CV with APPROVED status found');
            }
        });
    });

    describe('Test Case 11: Rút CV với trạng thái REJECTED', function() {
        it('should prevent withdrawing CV with REJECTED status', async function() {
            // Navigate to CV history section
            const cvHistoryTab = await testHelper.driver.findElement(By.xpath("//div[contains(text(), 'Lịch sử CV')]"));
            await cvHistoryTab.click();
            
            // Wait for CV history to load
            await testHelper.waitForElement('.cv-history-section', 10000);
            
            // Find CV with REJECTED status
            const rejectedCVs = await testHelper.driver.findElements(By.xpath("//div[contains(@class, 'cv-item') and contains(., 'REJECTED')]"));
            
            if (rejectedCVs.length > 0) {
                const firstRejectedCV = rejectedCVs[0];
                
                // Check if withdraw button is disabled or not present
                const withdrawButtons = await firstRejectedCV.findElements(By.css('.withdraw-btn'));
                
                if (withdrawButtons.length > 0) {
                    const withdrawButton = withdrawButtons[0];
                    const isDisabled = await withdrawButton.getAttribute('disabled');
                    assert.ok(isDisabled, 'Withdraw button should be disabled for REJECTED CV');
                } else {
                    // If no withdraw button, that's also correct
                    assert.ok(true, 'No withdraw button for REJECTED CV');
                }
                
                // Try to click withdraw button if it exists and is not disabled
                try {
                    const withdrawButton = await firstRejectedCV.findElement(By.css('.withdraw-btn:not([disabled])'));
                    await withdrawButton.click();
                    
                    // Should show error message
                    await testHelper.waitForElement('.ant-message-error', 5000);
                    const errorMessage = await testHelper.driver.findElement(By.css('.ant-message-error'));
                    const messageText = await errorMessage.getText();
                    assert.ok(messageText.includes('Không thể rút CV đã bị từ chối'), 'Should show error for REJECTED CV withdrawal');
                } catch (error) {
                    // Expected - button should be disabled
                    assert.ok(true, 'Withdraw button is properly disabled for REJECTED CV');
                }
            } else {
                this.skip('No CV with REJECTED status found');
            }
        });
    });
});
