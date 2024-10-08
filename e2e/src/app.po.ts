import { browser, by, element } from 'protractor';

export class AppPage {
  // Navigates to login page
  async navigateToLoginPage() {
    await browser.restart(); // needed to clear cookies before login
    browser.waitForAngularEnabled(false);
    return await browser.get('/login');
  }
  async navigateToHomePage() {
    browser.waitForAngularEnabled(false);
    return await browser.get('/home');
  }
  async getLoginButtonText() {
    browser.waitForAngularEnabled(false);
    const buttonTitle = await element(by.css('button.sign-in-button')).getText();
    return (buttonTitle === 'Sign In');
  }
}
