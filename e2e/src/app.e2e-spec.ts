import { AppPage } from './app.po';
import { element, by, browser } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 80000;
    page = new AppPage();
  });

  it('should display login button', async function () {
    await page.navigateToLoginPage();
    expect(await page.getLoginButtonText()).toBe(true);
  });

  it('check username field empty', async function () {
    await page.navigateToLoginPage();
    await element(by.css('button.sign-in-button')).click();
    expect(await element(by.css('.message-error')).getText()).
    toEqual('Username is required.');
  });

  it('check password field empty', async function () {
    await page.navigateToLoginPage();
    await element(by.css('input[type=text]')).sendKeys('admin');
    await element(by.css('button.sign-in-button')).click();
    expect(await element(by.css('.message-error')).getText()).
    toEqual('Password is required.');
  });

  it('uncheck the check box field', async function () {
    await page.navigateToLoginPage();
    await element(by.css('input[type=text]')).sendKeys('admin');
    await element(by.css('input[type=password]')).sendKeys('admin');
    await element(by.css('button.sign-in-button')).click();
    expect(await element(by.css('.message-error')).getText()).
    toEqual('You have to agree to the terms and conditions!');
  });

  it('check login successfully', async function () {
    await page.navigateToLoginPage();
    await element(by.css('input[type=text]')).sendKeys('admin');
    await element(by.css('input[type=password]')).sendKeys('admin');
    await element(by.css('div.ui-chkbox-box')).click();
    await element(by.css('button.sign-in-button')).click();
    return browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return /home/.test(url);
      });
    }, 3000);
  });
});
