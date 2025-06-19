const TestHelper = require('./utils/test-helper');
const DebugHelper = require('./utils/debug-helper');
const { By } = require('selenium-webdriver');

// Test: Tìm và click nút 'Hiện bộ lọc nâng cao' trên trang /job

describe('Debug Search Job Filter Button', function() {
    let testHelper;
    let debugHelper;

    before(async function() {
        testHelper = new TestHelper();
        await testHelper.setupDriver();
        debugHelper = new DebugHelper(testHelper.driver);
    });

    after(async function() {
        await testHelper.teardownDriver();
    });

    it("Tìm và click nút 'Hiện bộ lọc nâng cao'", async function() {
        this.timeout(60000);
        await testHelper.driver.get(`${testHelper.baseUrl}/job`);

        // Click nút Hiện bộ lọc nâng cao
        let filterButton = null;
        const buttons = await testHelper.driver.findElements(By.css('button'));
        for (const btn of buttons) {
            const text = await btn.getText();
            if (text && text.includes('Hiện bộ lọc nâng cao')) {
                filterButton = btn;
                break;
            }
        }
        const isInteractable = await debugHelper.checkElementInteractable(filterButton);
        await filterButton.click();
        await testHelper.driver.executeScript("window.scrollTo(0, 300);");

        // Chọn địa điểm
        const locationSelect = await testHelper.driver.findElement(By.id('location'));
        await locationSelect.click();
        const options = await testHelper.driver.findElements(By.css('.ant-select-dropdown .ant-select-item-option'));
        if (options.length > 1) {
            await options[1].click();
        }

        // Chọn kỹ năng
        const skillsSelect = await testHelper.driver.findElement(By.id('skills'));
        await skillsSelect.click();
        await skillsSelect.sendKeys('JavaScript');
        await skillsSelect.sendKeys(require('selenium-webdriver').Key.ENTER);

        // Chọn cấp độ
        const levelSelect = await testHelper.driver.findElement(By.id('level'));
        await levelSelect.click();
        await levelSelect.sendKeys('Senior');
        await levelSelect.sendKeys(require('selenium-webdriver').Key.ENTER);

        // Kéo slider lương
        const slider = await testHelper.driver.findElement(By.css('.ant-slider'));
        const handles = await slider.findElements(By.css('.ant-slider-handle'));
        if (handles.length >= 2) {
            const leftHandle = handles[0];
            const rightHandle = handles[1];
            const leftNow = parseInt(await leftHandle.getAttribute('aria-valuenow'));
            const rightNow = parseInt(await rightHandle.getAttribute('aria-valuenow'));
            const sliderRect = await testHelper.driver.executeScript(el => {
                const rect = el.getBoundingClientRect();
                return {left: rect.left, width: rect.width};
            }, slider);
            const leftTarget = 15;
            const rightTarget = 45;
            const leftOffset = ((leftTarget - leftNow) / 100) * sliderRect.width;
            const rightOffset = ((rightTarget - rightNow) / 100) * sliderRect.width;
            const actions = testHelper.driver.actions({async: true});
            await actions.move({origin: leftHandle}).press().move({origin: leftHandle, x: Math.round(leftOffset), y: 0}).release().perform();
            await actions.move({origin: rightHandle}).press().move({origin: rightHandle, x: Math.round(rightOffset), y: 0}).release().perform();
        }

        // Click button Tìm kiếm
        const searchButtons = await testHelper.driver.findElements(By.css('button.ant-btn-primary'));
        for (const btn of searchButtons) {
            const icon = await btn.findElements(By.css('.anticon-search'));
            if (icon.length > 0) {
                await btn.click();
                break;
            }
        }
        await testHelper.driver.executeScript('window.scrollBy(0, 600);');
        await testHelper.driver.sleep(10000);

        // Kiểm tra job card
        const searchLocation = 'Hồ Chí Minh';
        const searchSkill = 'JavaScript';
        const searchLevel = 'Senior';
        const minSalary = 15;
        const maxSalary = 45;
        const jobCards = await testHelper.driver.findElements(By.css('.ant-row .ant-col.ant-col-24.ant-col-md-12'));
        let passCount = 0;
        let failCount = 0;
        for (let i = 0; i < jobCards.length; i++) {
            try {
                const card = jobCards[i];
                let location = '';
                try {
                    location = await card.findElement(By.css('._job-location_1cimi_189')).getText();
                } catch {}
                let skills = [];
                try {
                    const skillElements = await card.findElements(By.css('span.ant-tag:not(.ant-tag-has-color)'));
                    for (const skillElement of skillElements) {
                        const skillText = await skillElement.getText();
                        if (skillText && skillText.trim() !== '') skills.push(skillText);
                    }
                } catch {}
                let level = '';
                try {
                    level = await card.findElement(By.css('span.ant-tag.ant-tag-has-color')).getText();
                } catch {}
                let salaryText = '';
                let salaryValue = 0;
                try {
                    salaryText = await card.findElement(By.css('._job-salary_1cimi_189')).getText();
                    const match = salaryText.replace(/\./g, '').match(/(\d+)/);
                    if (match) salaryValue = parseInt(match[1]);
                } catch {}
                let pass = true;
                if (searchLocation && !location.includes(searchLocation)) pass = false;
                if (searchSkill && !skills.some(s => s.toLowerCase().includes(searchSkill.toLowerCase()))) pass = false;
                if (searchLevel && level.trim().toLowerCase() !== searchLevel.trim().toLowerCase()) pass = false;
                if (salaryValue < minSalary || salaryValue > maxSalary) pass = false;
                if (pass) passCount++;
                else failCount++;
            } catch (err) {
                failCount++;
            }
        }
        // console.log(`\nTổng số job card PASS: ${passCount}, FAIL: ${failCount}`);
    });
}); 