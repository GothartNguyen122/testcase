const TestHelper = require('./utils/test-helper');
const DebugHelper = require('./utils/debug-helper');
const { By } = require('selenium-webdriver');

// Test: Tìm và click nút 'Hiện bộ lọc nâng cao' trên trang /job

describe('Debug Search Job Filter Button', function() {
    this.timeout(120000);
    let testHelper;
    let debugHelper;

    before(async function() {
        testHelper = new TestHelper();
        await testHelper.setupDriver();
        debugHelper = new DebugHelper(testHelper.driver);
    });

    after(async function() {
         this.timeout(35000);
        try {
            await new Promise(resolve => setTimeout(resolve, 30000));
            console.log('Closing driver...');
            await testHelper.teardownDriver();
            console.log('Driver closed successfully');
        } catch (error) {
            console.log('Error in after hook:', error.message);
            // Đảm bảo driver được đóng ngay cả khi có lỗi
            try {
                await testHelper.teardownDriver();
                console.log('Driver closed after error');
            } catch (closeError) {
                console.log('Error closing driver:', closeError.message);
            }
        }
    });

    it("Tìm và click nút 'Hiện bộ lọc nâng cao'", async function() {
        this.timeout(120000);
        await testHelper.driver.get(`${testHelper.baseUrl}/job`);
        await testHelper.driver.sleep(3000);

        // Tìm tất cả button và log ra để debug
        await debugHelper.findAllButtons();

        // Tìm nút theo text
        let filterButton = null;
        const buttons = await testHelper.driver.findElements(By.css('button'));
        for (const btn of buttons) {
            const text = await btn.getText();
            if (text && text.includes('Hiện bộ lọc nâng cao')) {
                filterButton = btn;
                break;
            }
        }
        if (!filterButton) {
            throw new Error("Không tìm thấy nút 'Hiện bộ lọc nâng cao'");
        }
        console.log('✅ Đã tìm thấy nút Hiện bộ lọc nâng cao');

        // Kiểm tra có thể click không
        const isInteractable = await debugHelper.checkElementInteractable(filterButton);
        if (!isInteractable) {
            throw new Error('Nút không thể tương tác');
        }

        // Click nút
        await filterButton.click();
        console.log('✅ Đã click nút Hiện bộ lọc nâng cao');
        await testHelper.driver.executeScript("window.scrollTo(0, 300);");
        // await driver.executeScript("window.scrollTo(0, 1000);");
        // await testHelper.driver.sleep(30000);

        // Chụp screenshot sau khi click
        // await debugHelper.takeScreenshot('after-click-advanced-filter');

        // Tìm và click vào select box "Chọn địa điểm..."
        console.log('\n=== TÌM VÀ CLICK SELECT BOX ĐỊA ĐIỂM ===');
        
        try {
            // Thử tìm theo id="location"
            const locationSelect = await testHelper.driver.findElement(By.id('location'));
            console.log('✅ Tìm thấy select box theo id="location"');
            
            // Click vào select box để mở dropdown
            await locationSelect.click();
            console.log('✅ Đã click vào select box địa điểm');
            // await testHelper.driver.sleep(20000);
            

            // Chụp screenshot sau khi mở dropdown
            // await debugHelper.takeScreenshot('location-dropdown-opened');
        
            
            // Chọn item đầu tiên từ dropdown
            console.log('\n=== CHỌN ITEM ĐẦU TIÊN TỪ DROPDOWN ===');
            try {
                // Tìm tất cả các option trong dropdown
                const options = await testHelper.driver.findElements(By.css('.ant-select-dropdown .ant-select-item-option'));
                console.log(`✅ Tìm thấy ${options.length} options trong dropdown`);
                
                if (options.length > 0) {
                    // Lấy text của option đầu tiên
                    const firstOptionText = await options[1].getText();
                    console.log(`📝 Option đầu tiên: "${firstOptionText}"`);
                    
                    // Click vào option đầu tiên
                    await options[1].click();
                    console.log('✅ Đã click vào option đầu tiên');
                    await testHelper.driver.sleep(10000);
                    
                    // Chụp screenshot sau khi chọn
                    // await debugHelper.takeScreenshot('location-selected-first-option');
                    
                    // Kiểm tra xem đã chọn thành công chưa
                    const selectedValue = await locationSelect.getAttribute('value');
                    console.log(`📋 Giá trị đã chọn: "${selectedValue}"`);
                    
                } else {
                    console.log('❌ Không tìm thấy options trong dropdown');
                }
                
            } catch (error) {
                console.log('❌ Lỗi khi chọn option:', error.message);
                
                // Thử cách khác - tìm theo class ant-select-item
                try {
                    const items = await testHelper.driver.findElements(By.css('.ant-select-item'));
                    console.log(`✅ Tìm thấy ${items.length} items theo class ant-select-item`);
                    
                    if (items.length > 0) {
                        const firstItemText = await items[1].getText();
                        console.log(`📝 Item đầu tiên: "${firstItemText}"`);
                        await items[1].click();
                        console.log('✅ Đã click vào item đầu tiên');
                        await testHelper.driver.sleep(2000);
                        // await debugHelper.takeScreenshot('location-selected-first-item');
                    }
                } catch (error2) {
                    console.log('❌ Lỗi khi chọn item:', error2.message);
                }
            }
            
        } catch (error) {
            console.log('❌ Không tìm thấy select box theo id="location"');
            console.log('Error:', error.message);
            
            // Thử tìm theo placeholder
            try {
                const locationSelects = await testHelper.driver.findElements(By.css('input[placeholder*="Chọn địa điểm"]'));
                if (locationSelects.length > 0) {
                    console.log(`✅ Tìm thấy ${locationSelects.length} select box theo placeholder`);
                    await locationSelects[0].click();
                    console.log('✅ Đã click vào select box địa điểm (theo placeholder)');
                    await testHelper.driver.sleep(2000);
                    // await debugHelper.takeScreenshot('location-dropdown-opened-placeholder');
                } else {
                    console.log('❌ Không tìm thấy select box theo placeholder');
                }
            } catch (error2) {
                console.log('❌ Không tìm thấy select box theo placeholder');
                console.log('Error:', error2.message);
            }
        }

        // Tìm và click vào select box "Kỹ năng"
        console.log('\n=== TÌM VÀ CLICK SELECT BOX KỸ NĂNG ===');
        
        try {
            // Tìm theo id="skills"
            const skillsSelect = await testHelper.driver.findElement(By.id('skills'));
            console.log('✅ Tìm thấy select box theo id="skills"');
            
            // Click vào select box để mở dropdown
            await skillsSelect.click();
            console.log('✅ Đã click vào select box kỹ năng');
            // Đợi cho đến khi class ant-select-open xuất hiện trên div cha
            let parentDiv = await skillsSelect.findElement(By.xpath('ancestor::div[contains(@class, "ant-select")]'));
            let isOpen = false;
            for (let i = 0; i < 20; i++) { // timeout ~2s
                const className = await parentDiv.getAttribute('class');
                if (className.includes('ant-select-open')) {
                    isOpen = true;
                    break;
                }
                await testHelper.driver.sleep(100);
            }
            if (!isOpen) {
                console.log('❌ Dropdown kỹ năng không mở ra (không có class ant-select-open)');
            } else {
                console.log('✅ Dropdown kỹ năng đã mở (ant-select-open)');
                // Đợi 2s
                await testHelper.driver.sleep(2000);
                // Gửi chuỗi "Spring" vào input
                await skillsSelect.sendKeys('JavaScript');
                console.log('✅ Đã gửi chuỗi "Spring" vào input kỹ năng');
                // Nhấn phím Enter
                await skillsSelect.sendKeys(require('selenium-webdriver').Key.ENTER);
                console.log('✅ Đã nhấn phím Enter');
                // Dừng màn hình 2s
                await testHelper.driver.sleep(2000);

                // === XỬ LÝ FIELD CẤP ĐỘ ===
                // Tìm input có id='level'
                const levelSelect = await testHelper.driver.findElement(By.id('level'));
                console.log('✅ Tìm thấy select box theo id="level"');
                // Click vào select box để mở dropdown
                await levelSelect.click();
                console.log('✅ Đã click vào select box cấp độ');
                // Đợi 2s
                await testHelper.driver.sleep(2000);
                // Gửi chuỗi "Intern" vào input
                await levelSelect.sendKeys('Senior');
                console.log('✅ Đã gửi chuỗi "Intern" vào input cấp độ');
                // Nhấn phím Enter
                await levelSelect.sendKeys(require('selenium-webdriver').Key.ENTER);
                console.log('✅ Đã nhấn phím Enter ở field cấp độ');
                // Dừng màn hình 10s
                // await testHelper.driver.sleep(3000);

                // === XỬ LÝ SLIDER LƯƠNG ===
                // Tìm slider
                const slider = await testHelper.driver.findElement(By.css('.ant-slider'));
                console.log('✅ Tìm thấy slider lương');
                // Tìm 2 handle
                const handles = await slider.findElements(By.css('.ant-slider-handle'));
                if (handles.length < 2) {
                    console.log('❌ Không tìm thấy đủ 2 handle slider');
                } else {
                    // Lấy thông tin vị trí hiện tại
                    const leftHandle = handles[0];
                    const rightHandle = handles[1];
                    const leftNow = parseInt(await leftHandle.getAttribute('aria-valuenow'));
                    const rightNow = parseInt(await rightHandle.getAttribute('aria-valuenow'));
                    console.log(`Vị trí hiện tại: left=${leftNow}, right=${rightNow}`);
                    // Tính toán offset (slider 0-100, width ~100%)
                    // Lấy kích thước slider
                    const sliderRect = await testHelper.driver.executeScript(el => {
                        const rect = el.getBoundingClientRect();
                        return {left: rect.left, width: rect.width};
                    }, slider);
                    // Tính vị trí cần kéo
                    const leftTarget = 15;
                    const rightTarget = 45;
                    const leftOffset = ((leftTarget - leftNow) / 100) * sliderRect.width;
                    const rightOffset = ((rightTarget - rightNow) / 100) * sliderRect.width;
                    // Kéo handle trái
                    const actions = testHelper.driver.actions({async: true});
                    await actions.move({origin: leftHandle}).press().move({origin: leftHandle, x: Math.round(leftOffset), y: 0}).release().perform();
                    console.log(`✅ Đã kéo handle trái về ${leftTarget}`);
                    await testHelper.driver.sleep(2000);
                    // Kéo handle phải
                    await actions.move({origin: rightHandle}).press().move({origin: rightHandle, x: Math.round(rightOffset), y: 0}).release().perform();
                    console.log(`✅ Đã kéo handle phải về ${rightTarget}`);
                    await testHelper.driver.sleep(2000);
                    // Log lại giá trị mới
                    const leftNow2 = parseInt(await leftHandle.getAttribute('aria-valuenow'));
                    const rightNow2 = parseInt(await rightHandle.getAttribute('aria-valuenow'));
                    console.log(`Vị trí sau khi kéo: left=${leftNow2}, right=${rightNow2}`);
                    // await debugHelper.takeScreenshot('salary-slider-after-drag');
                    await testHelper.driver.sleep(10000);

                    const sliderStep = parseInt(await leftHandle.getAttribute('aria-valuestep') || '1');
                    const sliderMin = parseInt(await leftHandle.getAttribute('aria-valuemin') || '0');
                    const sliderMax = parseInt(await leftHandle.getAttribute('aria-valuemax') || '100');
                    console.log(`Slider step: ${sliderStep}, min: ${sliderMin}, max: ${sliderMax}`);

                    // Tìm giá trị hợp lệ gần nhất
                    const leftValid = Math.round(leftTarget / sliderStep) * sliderStep;
                    const rightValid = Math.round(rightTarget / sliderStep) * sliderStep;
                    console.log(`Giá trị hợp lệ gần nhất: left=${leftValid}, right=${rightValid}`);
                }
            }
        } catch (error) {
            console.log('❌ Không tìm thấy select box theo id="skills"');
            console.log('Error:', error.message);
            
            // Thử tìm theo placeholder
            try {
                const skillsSelects = await testHelper.driver.findElements(By.css('input[placeholder*="Chọn kỹ năng"]'));
                if (skillsSelects.length > 0) {
                    console.log(`✅ Tìm thấy ${skillsSelects.length} select box theo placeholder kỹ năng`);
                    await skillsSelects[0].click();
                    console.log('✅ Đã click vào select box kỹ năng (theo placeholder)');
                    await testHelper.driver.sleep(2000);
                    // await debugHelper.takeScreenshot('skills-dropdown-opened-placeholder');
                } else {
                    console.log('❌ Không tìm thấy select box theo placeholder kỹ năng');
                }
            } catch (error2) {
                console.log('❌ Không tìm thấy select box theo placeholder kỹ năng');
                console.log('Error:', error2.message);
            }
        }

        // === CLICK BUTTON TÌM KIẾM ===
        const searchButtons = await testHelper.driver.findElements(By.css('button.ant-btn-primary'));
        let found = false;
        for (const btn of searchButtons) {
            const icon = await btn.findElements(By.css('.anticon-search'));
            if (icon.length > 0) {
                await btn.click();
                console.log('✅ Đã click vào button Tìm kiếm');
                found = true;
                break;
            }
        }
        if (!found) {
            console.log('❌ Không tìm thấy button Tìm kiếm');
        }
        await testHelper.driver.sleep(3000);
        await testHelper.driver.executeScript('window.scrollBy(0, 600);');
        console.log('✅ Đã scroll màn hình xuống 200px');
        await testHelper.driver.sleep(10000); // Tăng thời gian chờ sau khi search để lấy data từ DB
        // Tìm và log tất cả job card
        console.log('\n=== DEBUG TẤT CẢ JOB CARD SAU SEARCH ===');
        await debugHelper.findAllJobCards();
        // === KIỂM TRA JOB CARD THEO TIÊU CHÍ TÌM KIẾM ===
        // Giả sử các biến sau là giá trị bạn đã dùng để search:
        const searchLocation = 'Hồ Chí Minh'; // hoặc lấy từ biến thực tế bạn dùng để search
        const searchSkill = 'JavaScript';
        const searchLevel = 'Senior';
        const minSalary = 15; // triệu
        const maxSalary = 45; // triệu

        // Lấy lại tất cả job card
        const jobCards = await testHelper.driver.findElements(By.css('.ant-row .ant-col.ant-col-24.ant-col-md-12'));
        let passCount = 0;
        let failCount = 0;
        for (let i = 0; i < jobCards.length; i++) {
            try {
                const card = jobCards[i];
                // Location
                let location = '';
                try {
                    location = await card.findElement(By.css('._job-location_1cimi_189')).getText();
                } catch {}
                // Skills
                let skills = [];
                try {
                    const skillElements = await card.findElements(By.css('span.ant-tag:not(.ant-tag-has-color)'));
                    for (const skillElement of skillElements) {
                        const skillText = await skillElement.getText();
                        if (skillText && skillText.trim() !== '') skills.push(skillText);
                    }
                } catch {}
                // Level
                let level = '';
                try {
                    level = await card.findElement(By.css('span.ant-tag.ant-tag-has-color')).getText();
                    console.log("Level:"+level);
                } catch {}
                // Salary
                let salaryText = '';
                let salaryValue = 0;
                try {
                    salaryText = await card.findElement(By.css('._job-salary_1cimi_189')).getText();
                    // Lấy số đầu tiên trong chuỗi, ví dụ "30 triệu - 50 triệu"
                    const match = salaryText.replace(/\./g, '').match(/(\d+)/);
                    if (match) salaryValue = parseInt(match[1]);
                } catch {}
                // So sánh
                let pass = true;
                let reasons = [];
                if (searchLocation && !location.includes(searchLocation)) {
                    pass = false;
                    reasons.push(`Location không khớp (${location} != ${searchLocation})`);
                }
                if (searchSkill && !skills.some(s => s.toLowerCase().includes(searchSkill.toLowerCase()))) {
                    pass = false;
                    reasons.push(`Skills không chứa keyword (${skills.join(', ')})`);
                }
                if (searchLevel && level.trim().toLowerCase() !== searchLevel.trim().toLowerCase()) {
                    pass = false;
                    reasons.push(`Level không khớp (${level} != ${searchLevel})`);
                }
                if (salaryValue < minSalary || salaryValue > maxSalary) {
                    pass = false;
                    reasons.push(`Salary (${salaryValue}) không nằm trong khoảng [${minSalary}, ${maxSalary}]`);
                }
                if (pass) {
                    passCount++;
                    console.log(`✅ PASS: Job card ${i + 1} thỏa mãn tất cả điều kiện.`);
                } else {
                    failCount++;
                    console.log(`❌ FAIL: Job card ${i + 1} không thỏa mãn: ${reasons.join('; ')}`);
                }
            } catch (err) {
                console.log(`❌ Lỗi khi kiểm tra job card ${i + 1}:`, err.message);
            }
        }
        console.log(`\nTổng số job card PASS: ${passCount}, FAIL: ${failCount}`);
    });
}); 