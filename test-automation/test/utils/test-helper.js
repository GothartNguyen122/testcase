const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
require('dotenv').config();

class TestHelper {
    constructor() {
        this.driver = null;
        this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    }

    async setupDriver() {
        const options = new chrome.Options();
        
        if (process.env.HEADLESS === 'true') {
            options.addArguments('--headless');
        }
        
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--window-size=1920,1080');

        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await this.driver.manage().setTimeouts({ implicit: 10000 });
        await this.driver.manage().window().maximize();
    }

    async teardownDriver() {
        if (this.driver) {
            await this.driver.quit();
        }
    }

    async login(email, password) {
        await this.driver.get(`${this.baseUrl}/login`);
        
        // Fill login form
        await this.driver.findElement(By.id('basic_username')).sendKeys(email);
        await this.driver.findElement(By.id('basic_password')).sendKeys(password);
        
        // Click login button
        await this.driver.findElement(By.css('button[type="submit"]')).click();
        
        // Wait for redirect to home page
        await this.driver.wait(until.urlContains('/home'), 10000);
    }

    async logout() {
        // Click on user menu and logout
        await this.driver.findElement(By.css('.user-menu')).click();
        await this.driver.findElement(By.css('.logout-btn')).click();
        
        // Wait for redirect to login page
        await this.driver.wait(until.urlContains('/login'), 10000);
    }

    async navigateToJobDetail(jobId) {
        await this.driver.get(`${this.baseUrl}/job/${jobId}`);
        await this.driver.wait(until.elementLocated(By.css('.detail-job-section')), 10000);
    }

    async clickApplyButton() {
        const applyButton = await this.driver.findElement(By.css('.btn-apply'));
        await applyButton.click();
        
        // Wait for modal to appear
        await this.driver.wait(until.elementLocated(By.css('.ant-modal')), 10000);
    }

    async uploadCV(filePath) {
        const fileInput = await this.driver.findElement(By.css('input[type="file"]'));
        await fileInput.sendKeys(filePath);
        
        // Wait for upload to complete
        await this.driver.wait(until.elementLocated(By.css('.ant-upload-list-item-done')), 15000);
    }

    async getAlertMessage() {
        try {
            const alert = await this.driver.findElement(By.css('.ant-alert-message'));
            return await alert.getText();
        } catch (error) {
            return null;
        }
    }

    async getModalTitle() {
        const modalTitle = await this.driver.findElement(By.css('.ant-modal-title'));
        return await modalTitle.getText();
    }

    async isElementPresent(selector) {
        try {
            await this.driver.findElement(By.css(selector));
            return true;
        } catch (error) {
            return false;
        }
    }

    async waitForElement(selector, timeout = 10000) {
        await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
    }

    async takeScreenshot(filename) {
        const screenshot = await this.driver.takeScreenshot();
        const fs = require('fs');
        const path = require('path');
        
        const screenshotDir = path.join(__dirname, '../screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(screenshotDir, `${filename}.png`), screenshot, 'base64');
    }

    async createTestFile(filePath, content, size = null) {
        const fs = require('fs');
        const path = require('path');
        
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        if (size) {
            // Create file with specific size
            const buffer = Buffer.alloc(size);
            fs.writeFileSync(filePath, buffer);
        } else {
            // Create file with content
            fs.writeFileSync(filePath, content);
        }
    }

    async cleanupTestFiles() {
        const fs = require('fs');
        const path = require('path');
        const testFilesDir = path.join(__dirname, '../test-files');
        
        if (fs.existsSync(testFilesDir)) {
            const files = fs.readdirSync(testFilesDir);
            for (const file of files) {
                fs.unlinkSync(path.join(testFilesDir, file));
            }
        }
    }
}

module.exports = TestHelper; 