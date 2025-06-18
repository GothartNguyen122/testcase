const TestHelper = require('./utils/test-helper');
const DebugHelper = require('./utils/debug-helper');
const { By } = require('selenium-webdriver');

describe('Debug Job Items Test', function() {
    let testHelper;
    let debugHelper;

    before(async function() {
        testHelper = new TestHelper();
        await testHelper.setupDriver();
        debugHelper = new DebugHelper(testHelper.driver);
    });

    after(async function() {
        // Dừng lại để xem kết quả - không tắt driver ngay
        console.log('\n=== DEBUG JOB ITEMS TEST COMPLETED ===');
        console.log('Driver will stay open for 30 seconds so you can see the results...');
        console.log('Press Ctrl+C to stop the test and close the driver.');
        
        // Chờ 30 giây trước khi tắt driver
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        await testHelper.teardownDriver();
    });

    it('Debug: Kiểm tra job items và search functionality', async function() {
        this.timeout(60000);
        
        // Navigate to job page
        await testHelper.driver.get(`${testHelper.baseUrl}/job`);
        console.log('✅ Navigated to job page');
        
        // Wait for page to load
        await testHelper.driver.sleep(5000);
        
        // Get current URL
        const currentUrl = await testHelper.driver.getCurrentUrl();
        console.log('Current URL:', currentUrl);
        
        // Take screenshot
        await debugHelper.takeScreenshot('debug-job-items-page');
        
        // ===== PHẦN 1: KIỂM TRA JOB CARDS TRƯỚC KHI SEARCH =====
        console.log('\n=== PHẦN 1: KIỂM TRA JOB CARDS TRƯỚC KHI SEARCH ===');
        
        // Đếm tổng số job cards
        console.log('\n--- Đếm job cards ---');
        const initialJobCount = await debugHelper.countJobCards();
        console.log(`Initial job count: ${initialJobCount}`);
        
        // Tìm tất cả job cards
        console.log('\n--- Tìm tất cả job cards ---');
        await debugHelper.findAllJobCards();
        
        // Tìm job cards chứa từ khóa "ReactJS"
        console.log('\n--- Tìm job cards chứa "ReactJS" ---');
        const reactJobs = await debugHelper.findJobCardsByKeyword('ReactJS');
        console.log(`Found ${reactJobs.length} jobs containing ReactJS`);
        
        // Tìm job cards chứa từ khóa "Frontend"
        console.log('\n--- Tìm job cards chứa "Frontend" ---');
        const frontendJobs = await debugHelper.findJobCardsByKeyword('Frontend');
        console.log(`Found ${frontendJobs.length} jobs containing Frontend`);
        
        // Lấy thông tin chi tiết của job card đầu tiên
        console.log('\n--- Thông tin chi tiết job card đầu tiên ---');
        const firstJobDetails = await debugHelper.getJobCardDetails(0);
        if (firstJobDetails) {
            console.log('First job details:', JSON.stringify(firstJobDetails, null, 2));
        }
        
        // ===== PHẦN 2: THỰC HIỆN SEARCH =====
        console.log('\n=== PHẦN 2: THỰC HIỆN SEARCH ===');
        
        // Tìm search input
        console.log('\n--- Tìm search input ---');
        let searchInput;
        try {
            searchInput = await testHelper.driver.findElement(By.id('keyword'));
            console.log('✅ Found search input by ID: keyword');
        } catch (error) {
            console.log('❌ Failed to find search input by ID, trying fallback...');
            searchInput = await testHelper.driver.findElement(By.css('input.ant-input.ant-input-lg'));
            console.log('✅ Found search input by class: ant-input ant-input-lg');
        }
        
        // Kiểm tra element có thể tương tác không
        const isInteractable = await debugHelper.checkElementInteractable(searchInput);
        if (!isInteractable) {
            console.log('❌ Search input is not interactable');
            return;
        }
        
        // Click vào input để focus
        await searchInput.click();
        await testHelper.driver.sleep(1000);
        
        // Xóa nội dung cũ nếu có
        await searchInput.clear();
        await testHelper.driver.sleep(500);
        
        // Nhập từ khóa tìm kiếm "ReactJS"
        await searchInput.sendKeys('ReactJS');
        console.log('✅ Typed "ReactJS" in search input');
        await testHelper.driver.sleep(1000);
        
        // Tìm search button
        console.log('\n--- Tìm search button ---');
        let searchBtn;
        try {
            searchBtn = await testHelper.driver.findElement(By.css('button.ant-btn.ant-btn-primary.ant-btn-icon-only'));
            console.log('✅ Found search button by class: ant-btn ant-btn-primary ant-btn-icon-only');
        } catch (error) {
            console.log('❌ Failed to find search button by exact class, trying fallback...');
            searchBtn = await testHelper.driver.findElement(By.css('button.ant-btn-primary'));
            console.log('✅ Found search button by class: ant-btn-primary');
        }
        
        // Kiểm tra button có thể tương tác không
        const isButtonInteractable = await debugHelper.checkElementInteractable(searchBtn);
        if (!isButtonInteractable) {
            console.log('❌ Search button is not interactable');
            return;
        }
        
        // Click vào nút search
        await searchBtn.click();
        console.log('✅ Clicked search button');
        
        // Chờ kết quả load
        await testHelper.driver.sleep(3000);
        
        // Take screenshot sau khi search
        await debugHelper.takeScreenshot('debug-job-items-after-search');
        
        // ===== PHẦN 3: KIỂM TRA KẾT QUẢ SAU KHI SEARCH =====
        console.log('\n=== PHẦN 3: KIỂM TRA KẾT QUẢ SAU KHI SEARCH ===');
        
        // Kiểm tra URL có chứa keyword không
        const urlAfterSearch = await testHelper.driver.getCurrentUrl();
        console.log('URL after search:', urlAfterSearch);
        console.log('URL contains "keyword=ReactJS":', urlAfterSearch.includes('keyword=ReactJS'));
        
        // Đếm tổng số job cards sau khi search
        console.log('\n--- Đếm job cards sau search ---');
        const jobCountAfterSearch = await debugHelper.countJobCards();
        console.log(`Job count after search: ${jobCountAfterSearch}`);
        
        // So sánh số lượng job cards
        console.log(`\n--- So sánh số lượng job cards ---`);
        console.log(`Before search: ${initialJobCount} jobs`);
        console.log(`After search: ${jobCountAfterSearch} jobs`);
        console.log(`Difference: ${jobCountAfterSearch - initialJobCount} jobs`);
        
        // Tìm tất cả job cards sau khi search
        console.log('\n--- Tìm tất cả job cards sau search ---');
        await debugHelper.findAllJobCards();
        
        // Tìm job cards chứa từ khóa "ReactJS" sau khi search
        console.log('\n--- Tìm job cards chứa "ReactJS" sau search ---');
        const reactJobsAfterSearch = await debugHelper.findJobCardsByKeyword('ReactJS');
        console.log(`Found ${reactJobsAfterSearch.length} jobs containing ReactJS after search`);
        
        // Kiểm tra xem có job nào chứa "ReactJS" không
        if (reactJobsAfterSearch.length > 0) {
            console.log('✅ SUCCESS: Found jobs containing ReactJS after search!');
            console.log('Matching jobs:');
            reactJobsAfterSearch.forEach((job, index) => {
                console.log(`  ${index + 1}. ${job.title} (Skills: ${job.skills.join(', ')})`);
            });
        } else {
            console.log('❌ FAILED: No jobs containing ReactJS found after search');
        }
        
        // Lấy thông tin chi tiết của job card đầu tiên sau search
        console.log('\n--- Thông tin chi tiết job card đầu tiên sau search ---');
        const firstJobDetailsAfterSearch = await debugHelper.getJobCardDetails(0);
        if (firstJobDetailsAfterSearch) {
            console.log('First job details after search:', JSON.stringify(firstJobDetailsAfterSearch, null, 2));
        }
        
        // ===== PHẦN 4: KIỂM TRA CÁC JOB CARDS CỤ THỂ =====
        console.log('\n=== PHẦN 4: KIỂM TRA CÁC JOB CARDS CỤ THỂ ===');
        
        // Kiểm tra 3 job cards đầu tiên
        for (let i = 0; i < Math.min(3, jobCountAfterSearch); i++) {
            console.log(`\n--- Job Card ${i + 1} ---`);
            const jobDetails = await debugHelper.getJobCardDetails(i);
            if (jobDetails) {
                console.log(`Title: ${jobDetails.title}`);
                console.log(`Company: ${jobDetails.company}`);
                console.log(`Location: ${jobDetails.location}`);
                console.log(`Salary: ${jobDetails.salary}`);
                console.log(`Level: ${jobDetails.level}`);
                console.log(`Skills: ${jobDetails.skills.join(', ')}`);
                console.log(`Updated: ${jobDetails.updatedTime}`);
            }
        }
        
        // // ===== PHẦN 5: TÌM KIẾM CÁC TỪ KHÓA KHÁC =====
        // console.log('\n=== PHẦN 5: TÌM KIẾM CÁC TỪ KHÓA KHÁC ===');
        
        // const keywords = ['JavaScript', 'VueJS', 'Angular', 'Frontend', 'Backend'];
        
        // for (const keyword of keywords) {
        //     console.log(`\n--- Tìm kiếm từ khóa: "${keyword}" ---`);
        //     const matchingJobs = await debugHelper.findJobCardsByKeyword(keyword);
        //     console.log(`Found ${matchingJobs.length} jobs containing "${keyword}"`);
            
        //     if (matchingJobs.length > 0) {
        //         console.log('Matching jobs:');
        //         matchingJobs.forEach((job, index) => {
        //             console.log(`  ${index + 1}. ${job.title}`);
        //         });
        //     }
        // }
        
        // console.log('\n✅ DEBUG JOB ITEMS TEST COMPLETED SUCCESSFULLY!');
    });
}); 