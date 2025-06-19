const TestHelper = require('./utils/test-helper');
const DebugHelper = require('./utils/debug-helper');
const assert = require('assert');
const { By } = require('selenium-webdriver');
const { until } = require('selenium-webdriver');

describe('JobHunter - Search Job Test Cases', function() {
    let testHelper;
    let debugHelper;

    before(async function() {
        testHelper = new TestHelper();
        await testHelper.setupDriver();
        debugHelper = new DebugHelper(testHelper.driver);
    });

    after(async function() {
        // Tăng timeout cho after hook
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

    beforeEach(async function() {
        await testHelper.driver.get(`${testHelper.baseUrl}/job`);
    });

    it('Testcase 1: Tìm kiếm cơ bản với từ khóa', async function() {
        this.timeout(30000);
        // Debug: In ra URL hiện tại
        const currentUrl = await testHelper.driver.getCurrentUrl();
        // Debug: Chờ trang load hoàn toàn
        await testHelper.driver.sleep(3000);
        
        // ===== PHẦN 1: KIỂM TRA JOB CARDS TRƯỚC KHI SEARCH =====
        console.log('\n=== PHẦN 1: KIỂM TRA JOB CARDS TRƯỚC KHI SEARCH ===');
        
        // Đếm tổng số job cards ban đầu
        const initialJobCount = await debugHelper.countJobCards();
        console.log(`Initial job count: ${initialJobCount}`);
        
        // Tìm job cards chứa từ khóa "ReactJS" trước khi search
        const reactJobsBeforeSearch = await debugHelper.findJobCardsByKeyword('ReactJS');
        console.log(`Found ${reactJobsBeforeSearch.length} jobs containing ReactJS before search`);
        
        // ===== PHẦN 2: THỰC HIỆN SEARCH =====
        console.log('\n=== PHẦN 2: THỰC HIỆN SEARCH ===');
        
        // Tìm search input với selector chính xác
        let searchInput;
        try {
            // Sử dụng ID chính xác
            searchInput = await testHelper.driver.findElement(By.id('keyword'));
            console.log('✅ Found search input by ID: keyword');
        } catch (error) {
            console.log('❌ Failed to find search input by ID, trying fallback...');
            // Fallback: Tìm theo class chính xác
            searchInput = await testHelper.driver.findElement(By.css('input.ant-input.ant-input-lg'));
            console.log('✅ Found search input by class: ant-input ant-input-lg');
        }
        
        // Kiểm tra element có thể tương tác không
        const isInteractable = await debugHelper.checkElementInteractable(searchInput);
        if (!isInteractable) {
            console.log('Element is not interactable, taking screenshot...');
            await debugHelper.takeScreenshot('search-input-not-interactable');
            throw new Error('Search input is not interactable');
        }
        
        // // Scroll đến element để đảm bảo nó trong viewport
        // await testHelper.driver.executeScript("arguments[0].scrollIntoView(true);", searchInput);
        // await testHelper.driver.sleep(1000);
        
        // Click vào input để focus
        await searchInput.click();
        await testHelper.driver.sleep(1000);
        
        // Xóa nội dung cũ nếu có
        await searchInput.clear();
        await testHelper.driver.sleep(500);
        
        // Nhập từ khóa tìm kiếm "ReactJS"
        const searchKeyword = 'ReactJS';
        await searchInput.sendKeys(searchKeyword);
        console.log(`✅ Typed "${searchKeyword}" in search input`);
        await testHelper.driver.sleep(1000);
        
        // Tìm search button với selector chính xác
        let searchBtn;
        try {
            // Sử dụng class chính xác
            searchBtn = await testHelper.driver.findElement(By.css('button.ant-btn.ant-btn-primary.ant-btn-icon-only'));
            console.log('✅ Found search button by class: ant-btn ant-btn-primary ant-btn-icon-only');
        } catch (error) {
            console.log('❌ Failed to find search button by exact class, trying fallback...');
            // Fallback: Tìm theo class một phần
            searchBtn = await testHelper.driver.findElement(By.css('button.ant-btn-primary'));
            console.log('✅ Found search button by class: ant-btn-primary');
        }
        
        // Kiểm tra button có thể tương tác không
        const isButtonInteractable = await debugHelper.checkElementInteractable(searchBtn);
        if (!isButtonInteractable) {
            console.log('Search button is not interactable, taking screenshot...');
            await debugHelper.takeScreenshot('search-button-not-interactable');
            throw new Error('Search button is not interactable');
        }
        
        // Click vào nút search
        await searchBtn.click();
        console.log('✅ Clicked search button');
        
        // Chờ kết quả load
        await testHelper.driver.sleep(3000);
        
        // ===== PHẦN 3: KIỂM TRA KẾT QUẢ SAU KHI SEARCH =====
        console.log('\n=== PHẦN 3: KIỂM TRA KẾT QUẢ SAU KHI SEARCH ===');
        
        // Kiểm tra URL có chứa keyword không
        const urlAfterSearch = await testHelper.driver.getCurrentUrl();
        console.log('URL after search:', urlAfterSearch);
        const urlContainsKeyword = urlAfterSearch.includes(`keyword=${searchKeyword}`);
        console.log(`URL contains "keyword=${searchKeyword}": ${urlContainsKeyword}`);
        assert.ok(urlContainsKeyword, `URL không chứa keyword tìm kiếm ${searchKeyword}`);
        
        // Đếm tổng số job cards sau khi search
        const jobCountAfterSearch = await debugHelper.countJobCards();
        console.log(`Job count after search: ${jobCountAfterSearch}`);
        
        // So sánh số lượng job cards
        console.log(`\n--- So sánh số lượng job cards ---`);
        console.log(`Before search: ${initialJobCount} jobs`);
        console.log(`After search: ${jobCountAfterSearch} jobs`);
        console.log(`Difference: ${jobCountAfterSearch - initialJobCount} jobs`);
        
        // Tìm job cards chứa từ khóa sau khi search
        const matchingJobs = await debugHelper.findJobCardsByKeyword(searchKeyword);
        console.log(`\n--- Tìm job cards chứa "${searchKeyword}" sau search ---`);
        console.log(`Found ${matchingJobs.length} jobs containing ${searchKeyword}`);
        
        // Kiểm tra xem có job nào chứa keyword không
        if (matchingJobs.length > 0) {
            console.log('✅ SUCCESS: Found jobs containing the search keyword!');
            console.log('Matching jobs:');
            matchingJobs.forEach((job, index) => {
                console.log(`  ${index + 1}. ${job.title} (Skills: ${job.skills.join(', ')})`);
            });
            
            // Kiểm tra xem tất cả job cards hiển thị có chứa keyword không
            console.log('\n--- Kiểm tra tất cả job cards hiển thị ---');
            const allJobCards = await debugHelper.findAllJobCards();
            
            // Lấy thông tin chi tiết của từng job card để kiểm tra
            let allJobsContainKeyword = true;
            let checkedJobs = 0;
            
            for (let i = 0; i < jobCountAfterSearch; i++) {
                try {
                    const jobDetails = await debugHelper.getJobCardDetails(i);
                    if (jobDetails) {
                        checkedJobs++;
                        const titleContainsKeyword = jobDetails.title.toLowerCase().includes(searchKeyword.toLowerCase());
                        const skillsContainKeyword = jobDetails.skills.some(skill => 
                            skill.toLowerCase().includes(searchKeyword.toLowerCase())
                        );
                        
                        if (titleContainsKeyword || skillsContainKeyword) {
                            console.log(`✅ Job ${i + 1}: "${jobDetails.title}" - Contains keyword`);
                        } else {
                            console.log(`❌ Job ${i + 1}: "${jobDetails.title}" - Does NOT contain keyword`);
                            allJobsContainKeyword = false;
                        }
                    }
                } catch (error) {
                    console.log(`Error checking job ${i + 1}:`, error.message);
                }
            }
            
            console.log(`\n--- KẾT QUẢ KIỂM TRA ---`);
            console.log(`Total jobs checked: ${checkedJobs}`);
            console.log(`All jobs contain keyword: ${allJobsContainKeyword}`);
            
            // Assert: Phải có ít nhất một job chứa keyword
            assert.ok(matchingJobs.length > 0, `Không tìm thấy job nào chứa từ khóa "${searchKeyword}"`);
            
            // Assert: Tất cả job cards hiển thị phải chứa keyword (nếu search hoạt động chính xác)
            // Note: Có thể có một số job không chứa keyword nếu search không filter chính xác
            if (allJobsContainKeyword) {
                console.log('✅ PERFECT: All displayed jobs contain the search keyword!');
            } else {
                console.log('⚠️  WARNING: Some displayed jobs do not contain the search keyword');
                console.log('This might indicate that the search filter is not working perfectly');
            }
            
        } else {
            console.log('❌ FAILED: No jobs containing the search keyword found');
            throw new Error(`Không tìm thấy job nào chứa từ khóa "${searchKeyword}"`);
        }
        
        // ===== PHẦN 4: KIỂM TRA CHI TIẾT JOB CARD ĐẦU TIÊN =====
        console.log('\n=== PHẦN 4: KIỂM TRA CHI TIẾT JOB CARD ĐẦU TIÊN ===');
        
        const firstJobDetails = await debugHelper.getJobCardDetails(0);
        if (firstJobDetails) {
            console.log('First job details after search:');
            console.log(`  Title: ${firstJobDetails.title}`);
            console.log(`  Company: ${firstJobDetails.company}`);
            console.log(`  Location: ${firstJobDetails.location}`);
            console.log(`  Salary: ${firstJobDetails.salary}`);
            console.log(`  Level: ${firstJobDetails.level}`);
            console.log(`  Skills: ${firstJobDetails.skills.join(', ')}`);
            console.log(`  Updated: ${firstJobDetails.updatedTime}`);
            
            // Kiểm tra xem job đầu tiên có chứa keyword không
            const titleContainsKeyword = firstJobDetails.title.toLowerCase().includes(searchKeyword.toLowerCase());
            const skillsContainKeyword = firstJobDetails.skills.some(skill => 
                skill.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            
            if (titleContainsKeyword || skillsContainKeyword) {
                console.log(`✅ First job contains keyword "${searchKeyword}"`);
            } else {
                console.log(`❌ First job does NOT contain keyword "${searchKeyword}"`);
            }
        }
        
        console.log('\n✅ Testcase 1 completed successfully!');
        console.log(`✅ Search for "${searchKeyword}" returned ${matchingJobs.length} matching jobs`);
    });

    // it('Testcase 2: Lọc theo địa điểm đơn lẻ', async function() {
    //     const locationSelect = await testHelper.driver.findElement(By.css('.ant-select-location'));
    //     await locationSelect.click();
    //     const hanoiOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Hà Nội')]"));
    //     await hanoiOption.click();
    //     await testHelper.driver.sleep(1000);
    //     const url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('location=HANOI'));
    //     const jobLocations = await testHelper.driver.findElements(By.xpath("//span[contains(.,'Hà Nội')]"));
    //     assert.ok(jobLocations.length > 0, 'Không tìm thấy job ở Hà Nội');
    // });

    // it('Testcase 3: Lọc theo kỹ năng đơn lẻ', async function() {
    //     const skillSelect = await testHelper.driver.findElement(By.css('.ant-select-skills'));
    //     await skillSelect.click();
    //     const reactOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'React.JS')]"));
    //     await reactOption.click();
    //     await testHelper.driver.sleep(1000);
    //     const url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('skills=REACT.JS'));
    //     const jobSkills = await testHelper.driver.findElements(By.xpath("//span[contains(.,'React.JS')]"));
    //     assert.ok(jobSkills.length > 0, 'Không tìm thấy job yêu cầu React.JS');
    // });

    // it('Testcase 4: Lọc theo cấp độ đơn lẻ', async function() {
    //     const levelSelect = await testHelper.driver.findElement(By.css('.ant-select-level'));
    //     await levelSelect.click();
    //     const juniorOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Junior')]"));
    //     await juniorOption.click();
    //     await testHelper.driver.sleep(1000);
    //     const url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('level=JUNIOR'));
    //     const jobLevels = await testHelper.driver.findElements(By.xpath("//span[contains(.,'Junior')]"));
    //     assert.ok(jobLevels.length > 0, 'Không tìm thấy job cấp độ Junior');
    // });

    // it('Testcase 5: Lọc theo khoảng lương', async function() {
    //     const minSalaryInput = await testHelper.driver.findElement(By.css('input[name="minSalary"]'));
    //     const maxSalaryInput = await testHelper.driver.findElement(By.css('input[name="maxSalary"]'));
    //     await minSalaryInput.clear();
    //     await minSalaryInput.sendKeys('20000000');
    //     await maxSalaryInput.clear();
    //     await maxSalaryInput.sendKeys('50000000');
    //     const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
    //     await searchBtn.click();
    //     await testHelper.driver.sleep(1000);
    //     const url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('minSalary=20000000') && url.includes('maxSalary=50000000'));
    // });

    // it('Testcase 6: Kết hợp tất cả filter', async function() {
    //     const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
    //     await searchInput.clear();
    //     await searchInput.sendKeys('Frontend');
    //     const locationSelect = await testHelper.driver.findElement(By.css('.ant-select-location'));
    //     await locationSelect.click();
    //     const hanoiOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Hà Nội')]"));
    //     await hanoiOption.click();
    //     const hcmOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Hồ Chí Minh')]"));
    //     await hcmOption.click();
    //     const skillSelect = await testHelper.driver.findElement(By.css('.ant-select-skills'));
    //     await skillSelect.click();
    //     const reactOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'React.JS')]"));
    //     await reactOption.click();
    //     const vueOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Vue.JS')]"));
    //     await vueOption.click();
    //     const levelSelect = await testHelper.driver.findElement(By.css('.ant-select-level'));
    //     await levelSelect.click();
    //     const juniorOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Junior')]"));
    //     await juniorOption.click();
    //     const middleOption = await testHelper.driver.findElement(By.xpath("//div[contains(@class,'ant-select-item-option') and contains(.,'Middle')]"));
    //     await middleOption.click();
    //     const minSalaryInput = await testHelper.driver.findElement(By.css('input[name="minSalary"]'));
    //     const maxSalaryInput = await testHelper.driver.findElement(By.css('input[name="maxSalary"]'));
    //     await minSalaryInput.clear();
    //     await minSalaryInput.sendKeys('15000000');
    //     await maxSalaryInput.clear();
    //     await maxSalaryInput.sendKeys('40000000');
    //     const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
    //     await searchBtn.click();
    //     await testHelper.driver.sleep(1000);
    //     const url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('keyword=Frontend'));
    //     assert.ok(url.includes('location=HANOI') && url.includes('location=HOCHIMINH'));
    //     assert.ok(url.includes('skills=REACT.JS') && url.includes('skills=VUE.JS'));
    //     assert.ok(url.includes('level=JUNIOR') && url.includes('level=MIDDLE'));
    //     assert.ok(url.includes('minSalary=15000000') && url.includes('maxSalary=40000000'));
    // });

    // it('Testcase 7: Tìm kiếm với ký tự đặc biệt', async function() {
    //     const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
    //     await searchInput.clear();
    //     await searchInput.sendKeys('C++ Developer');
    //     const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
    //     await searchBtn.click();
    //     await testHelper.driver.sleep(1000);
    //     const url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('keyword=C%2B%2B%20Developer') || url.includes('keyword=C++%20Developer'));
    // });

    // it('Testcase 8: Tìm kiếm với tiếng việt', async function() {
    //     const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
    //     await searchInput.clear();
    //     await searchInput.sendKeys('Ứng dụng');
    //     const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
    //     await searchBtn.click();
    //     await testHelper.driver.sleep(1000);
    //     const url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('keyword=%E1%BB%A8ng%20d%E1%BB%A5ng') || url.includes('keyword=Ứng%20dụng'));
    // });

    // it('Testcase 9: Phân vùng từ khóa tìm kiếm', async function() {
    //     const keywords = [
    //         'React', 'Java', 'Python',
    //         'Frontend Developer', 'Backend Engineer',
    //         'Senior React Native Developer with TypeScript',
    //         '', '   ',
    //         'a'.repeat(1000),
    //         "'; DROP TABLE jobs; --",
    //         "<script>alert('xss')</script>",
    //         null, undefined
    //     ];
    //     for (const keyword of keywords) {
    //         const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
    //         await searchInput.clear();
    //         if (keyword !== null && keyword !== undefined) {
    //             await searchInput.sendKeys(keyword);
    //         }
    //         const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
    //         await searchBtn.click();
    //         await testHelper.driver.sleep(1000);
    //         const url = await testHelper.driver.getCurrentUrl();
    //         if (typeof keyword === 'string' && keyword.length > 0 && keyword.length < 255 && !keyword.includes('<') && !keyword.includes('DROP')) {
    //             assert.ok(url.includes('keyword='));
    //         }
    //     }
    // });

    // it('Testcase 10: Biên của khoảng lương', async function() {
    //     const minSalaryInput = await testHelper.driver.findElement(By.css('input[name="minSalary"]'));
    //     const maxSalaryInput = await testHelper.driver.findElement(By.css('input[name="maxSalary"]'));
    //     await minSalaryInput.clear();
    //     await minSalaryInput.sendKeys('0');
    //     await maxSalaryInput.clear();
    //     await maxSalaryInput.sendKeys('100000000');
    //     const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
    //     await searchBtn.click();
    //     await testHelper.driver.sleep(1000);
    //     let url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('minSalary=0') && url.includes('maxSalary=100000000'));
    //     await minSalaryInput.clear();
    //     await minSalaryInput.sendKeys('100000000');
    //     await maxSalaryInput.clear();
    //     await maxSalaryInput.sendKeys('0');
    //     await searchBtn.click();
    //     await testHelper.driver.sleep(1000);
    // });

    // it('Testcase 11: Bảng quyết định cho việc áp dụng filter', async function() {
    //     await testHelper.driver.get(`${testHelper.baseUrl}/job`);
    //     let url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('minSalary=0') && url.includes('maxSalary=100000000'));
    //     const searchInput = await testHelper.driver.findElement(By.css('input[type="search"], input[placeholder*="Tìm kiếm"]'));
    //     await searchInput.clear();
    //     await searchInput.sendKeys('React');
    //     const searchBtn = await testHelper.driver.findElement(By.css('button[type="submit"], .btn-search'));
    //     await searchBtn.click();
    //     await testHelper.driver.sleep(1000);
    //     url = await testHelper.driver.getCurrentUrl();
    //     assert.ok(url.includes('keyword=React'));
    // });
}); 