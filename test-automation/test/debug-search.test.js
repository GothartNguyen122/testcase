const TestHelper = require('./utils/test-helper');
const DebugHelper = require('./utils/debug-helper');
const { By } = require('selenium-webdriver');

describe('Debug Search Element Test', function() {
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

    it('Debug: Kiểm tra search input element', async function() {
        this.timeout(30000);
        
        // Navigate to job page
        await testHelper.driver.get(`${testHelper.baseUrl}/job`);
        console.log('Navigated to job page');
        
        // Wait for page to load
        await testHelper.driver.sleep(5000);
        
        // Get current URL
        const currentUrl = await testHelper.driver.getCurrentUrl();
        console.log('Current URL:', currentUrl);
        
        // Take screenshot
        await debugHelper.takeScreenshot('debug-search-page');
        
        // Print page source
        await debugHelper.printPageSource();
        
        // Find all inputs
        console.log('\n=== FINDING ALL INPUTS ===');
        await debugHelper.findAllInputs();
        
        // Find all buttons
        console.log('\n=== FINDING ALL BUTTONS ===');
        await debugHelper.findAllButtons();
        
        // Try to find search input specifically
        console.log('\n=== TRYING TO FIND SEARCH INPUT ===');
        try {
            const searchInput = await debugHelper.findSearchInput();
            console.log('✅ SUCCESS: Found search input!');
            
            // Check if it's interactable
            const isInteractable = await debugHelper.checkElementInteractable(searchInput);
            console.log('Is interactable:', isInteractable);
            
            if (isInteractable) {
                // Try to click and type
                await searchInput.click();
                await testHelper.driver.sleep(1000);
                await searchInput.sendKeys('test');
                console.log('✅ SUCCESS: Can type in search input!');
            }
        } catch (error) {
            console.log('❌ FAILED: Could not find search input');
            console.log('Error:', error.message);
        }
        
        // Try to find search button specifically
        console.log('\n=== TRYING TO FIND SEARCH BUTTON ===');
        try {
            const searchButton = await debugHelper.findSearchButton();
            console.log('✅ SUCCESS: Found search button!');
            
            // Check if it's interactable
            const isInteractable = await debugHelper.checkElementInteractable(searchButton);
            console.log('Is interactable:', isInteractable);
        } catch (error) {
            console.log('❌ FAILED: Could not find search button');
            console.log('Error:', error.message);
        }
        
        // Manual search for specific elements
        console.log('\n=== MANUAL SEARCH FOR SPECIFIC ELEMENTS ===');
        
        // Look for input with id="keyword"
        try {
            const keywordInput = await testHelper.driver.findElement(By.id('keyword'));
            console.log('✅ Found input with id="keyword"');
            const placeholder = await keywordInput.getAttribute('placeholder');
            console.log('Placeholder:', placeholder);
        } catch (error) {
            console.log('❌ No input with id="keyword" found');
        }
        
        // Look for input with placeholder containing "Tìm kiếm"
        try {
            const searchInputs = await testHelper.driver.findElements(By.css('input[placeholder*="Tìm kiếm"]'));
            console.log(`✅ Found ${searchInputs.length} input(s) with placeholder containing "Tìm kiếm"`);
            for (let i = 0; i < searchInputs.length; i++) {
                const placeholder = await searchInputs[i].getAttribute('placeholder');
                console.log(`  Input ${i + 1} placeholder: ${placeholder}`);
            }
        } catch (error) {
            console.log('❌ No input with placeholder containing "Tìm kiếm" found');
        }
        
        // Look for ant-input class
        try {
            const antInputs = await testHelper.driver.findElements(By.css('input.ant-input'));
            console.log(`✅ Found ${antInputs.length} input(s) with class "ant-input"`);
            for (let i = 0; i < antInputs.length; i++) {
                const placeholder = await antInputs[i].getAttribute('placeholder');
                const id = await antInputs[i].getAttribute('id');
                console.log(`  Input ${i + 1}: id="${id}", placeholder="${placeholder}"`);
            }
        } catch (error) {
            console.log('❌ No input with class "ant-input" found');
        }
        
        // Look for search button
        try {
            const searchButtons = await testHelper.driver.findElements(By.css('button .anticon-search'));
            console.log(`✅ Found ${searchButtons.length} button(s) with search icon`);
        } catch (error) {
            console.log('❌ No button with search icon found');
        }
        
        // Look for ant-input-suffix button
        try {
            const suffixButtons = await testHelper.driver.findElements(By.css('.ant-input-suffix button'));
            console.log(`✅ Found ${suffixButtons.length} button(s) in ant-input-suffix`);
        } catch (error) {
            console.log('❌ No button in ant-input-suffix found');
        }
    });
}); 