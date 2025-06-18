const TestHelper = require('./utils/test-helper');
const assert = require('assert');
const { By } = require('selenium-webdriver');

describe('JobHunter - Search Job Test Cases', function() {
    let testHelper;

    before(async function() {
        testHelper = new TestHelper();
        await testHelper.setupDriver();
    });

    after(async function() {
        await testHelper.teardownDriver();
    });

    beforeEach(async function() {
        await testHelper.driver.get(`${testHelper.baseUrl}/job`);
        await testHelper.waitForElement('.search-job-section', 10000);
    });

    it('Testcase 1: Tìm kiếm cơ bản với từ khóa', async function() {
        const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
        await searchInput.clear();
        await searchInput.sendKeys('React');
        const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
        await searchBtn.click();
        await testHelper.driver.sleep(1000);
        const url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('keyword=React'));
        const jobTitles = await testHelper.driver.findElements(By.xpath("//div[contains(@class,'job-card')]//span[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'react')]"));
        assert.ok(jobTitles.length > 0, 'Không tìm thấy job chứa từ React');
    });

    it('Testcase 2: Lọc theo địa điểm đơn lẻ', async function() {
        const locationSelect = await testHelper.driver.findElement(By.css('.ant-select-location'));
        await locationSelect.click();
        const hanoiOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Hà Nội')]"));
        await hanoiOption.click();
        await testHelper.driver.sleep(1000);
        const url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('location=HANOI'));
        const jobLocations = await testHelper.driver.findElements(By.xpath("//span[contains(.,'Hà Nội')]"));
        assert.ok(jobLocations.length > 0, 'Không tìm thấy job ở Hà Nội');
    });

    it('Testcase 3: Lọc theo kỹ năng đơn lẻ', async function() {
        const skillSelect = await testHelper.driver.findElement(By.css('.ant-select-skills'));
        await skillSelect.click();
        const reactOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'React.JS')]"));
        await reactOption.click();
        await testHelper.driver.sleep(1000);
        const url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('skills=REACT.JS'));
        const jobSkills = await testHelper.driver.findElements(By.xpath("//span[contains(.,'React.JS')]"));
        assert.ok(jobSkills.length > 0, 'Không tìm thấy job yêu cầu React.JS');
    });

    it('Testcase 4: Lọc theo cấp độ đơn lẻ', async function() {
        const levelSelect = await testHelper.driver.findElement(By.css('.ant-select-level'));
        await levelSelect.click();
        const juniorOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Junior')]"));
        await juniorOption.click();
        await testHelper.driver.sleep(1000);
        const url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('level=JUNIOR'));
        const jobLevels = await testHelper.driver.findElements(By.xpath("//span[contains(.,'Junior')]"));
        assert.ok(jobLevels.length > 0, 'Không tìm thấy job cấp độ Junior');
    });

    it('Testcase 5: Lọc theo khoảng lương', async function() {
        const minSalaryInput = await testHelper.driver.findElement(By.css('input[name="minSalary"]'));
        const maxSalaryInput = await testHelper.driver.findElement(By.css('input[name="maxSalary"]'));
        await minSalaryInput.clear();
        await minSalaryInput.sendKeys('20000000');
        await maxSalaryInput.clear();
        await maxSalaryInput.sendKeys('50000000');
        const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
        await searchBtn.click();
        await testHelper.driver.sleep(1000);
        const url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('minSalary=20000000') && url.includes('maxSalary=50000000'));
    });

    it('Testcase 6: Kết hợp tất cả filter', async function() {
        const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
        await searchInput.clear();
        await searchInput.sendKeys('Frontend');
        const locationSelect = await testHelper.driver.findElement(By.css('.ant-select-location'));
        await locationSelect.click();
        const hanoiOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Hà Nội')]"));
        await hanoiOption.click();
        const hcmOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Hồ Chí Minh')]"));
        await hcmOption.click();
        const skillSelect = await testHelper.driver.findElement(By.css('.ant-select-skills'));
        await skillSelect.click();
        const reactOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'React.JS')]"));
        await reactOption.click();
        const vueOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Vue.JS')]"));
        await vueOption.click();
        const levelSelect = await testHelper.driver.findElement(By.css('.ant-select-level'));
        await levelSelect.click();
        const juniorOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Junior')]"));
        await juniorOption.click();
        const middleOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Middle')]"));
        await middleOption.click();
        const minSalaryInput = await testHelper.driver.findElement(By.css('input[name="minSalary"]'));
        const maxSalaryInput = await testHelper.driver.findElement(By.css('input[name="maxSalary"]'));
        await minSalaryInput.clear();
        await minSalaryInput.sendKeys('15000000');
        await maxSalaryInput.clear();
        await maxSalaryInput.sendKeys('40000000');
        const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
        await searchBtn.click();
        await testHelper.driver.sleep(1000);
        const url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('keyword=Frontend'));
        assert.ok(url.includes('location=HANOI') && url.includes('location=HOCHIMINH'));
        assert.ok(url.includes('skills=REACT.JS') && url.includes('skills=VUE.JS'));
        assert.ok(url.includes('level=JUNIOR') && url.includes('level=MIDDLE'));
        assert.ok(url.includes('minSalary=15000000') && url.includes('maxSalary=40000000'));
    });

    it('Testcase 7: Tìm kiếm với ký tự đặc biệt', async function() {
        const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
        await searchInput.clear();
        await searchInput.sendKeys('C++ Developer');
        const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
        await searchBtn.click();
        await testHelper.driver.sleep(1000);
        const url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('keyword=C%2B%2B%20Developer') || url.includes('keyword=C++%20Developer'));
    });

    it('Testcase 8: Tìm kiếm với tiếng việt', async function() {
        const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
        await searchInput.clear();
        await searchInput.sendKeys('Ứng dụng');
        const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
        await searchBtn.click();
        await testHelper.driver.sleep(1000);
        const url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('keyword=%E1%BB%A8ng%20d%E1%BB%A5ng') || url.includes('keyword=Ứng%20dụng'));
    });

    it('Testcase 9: Phân vùng từ khóa tìm kiếm', async function() {
        const keywords = [
            'React', 'Java', 'Python',
            'Frontend Developer', 'Backend Engineer',
            'Senior React Native Developer with TypeScript',
            '', '   ',
            'a'.repeat(1000),
            "'; DROP TABLE jobs; --",
            "<script>alert('xss')</script>",
            null, undefined
        ];
        for (const keyword of keywords) {
            const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
            await searchInput.clear();
            if (keyword !== null && keyword !== undefined) {
                await searchInput.sendKeys(keyword);
            }
            const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
            await searchBtn.click();
            await testHelper.driver.sleep(1000);
            const url = await testHelper.driver.getCurrentUrl();
            if (typeof keyword === 'string' && keyword.length > 0 && keyword.length < 255 && !keyword.includes('<') && !keyword.includes('DROP')) {
                assert.ok(url.includes('keyword='));
            }
        }
    });

    it('Testcase 10: Biên của khoảng lương', async function() {
        const minSalaryInput = await testHelper.driver.findElement(By.css('input[name="minSalary"]'));
        const maxSalaryInput = await testHelper.driver.findElement(By.css('input[name="maxSalary"]'));
        await minSalaryInput.clear();
        await minSalaryInput.sendKeys('0');
        await maxSalaryInput.clear();
        await maxSalaryInput.sendKeys('100000000');
        const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
        await searchBtn.click();
        await testHelper.driver.sleep(1000);
        let url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('minSalary=0') && url.includes('maxSalary=100000000'));
        await minSalaryInput.clear();
        await minSalaryInput.sendKeys('100000000');
        await maxSalaryInput.clear();
        await maxSalaryInput.sendKeys('0');
        await searchBtn.click();
        await testHelper.driver.sleep(1000);
    });

    it('Testcase 11: Bảng quyết định cho việc áp dụng filter', async function() {
        await testHelper.driver.get(`${testHelper.baseUrl}/job`);
        let url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('minSalary=0') && url.includes('maxSalary=100000000'));
        const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
        await searchInput.clear();
        await searchInput.sendKeys('React');
        const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
        await searchBtn.click();
        await testHelper.driver.sleep(1000);
        url = await testHelper.driver.getCurrentUrl();
        assert.ok(url.includes('keyword=React'));
    });
}); 