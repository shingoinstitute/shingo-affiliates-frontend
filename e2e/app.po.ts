import { browser, by, element } from 'protractor'

export class ShingoAffiliatesFrontendPage {
  public navigateTo() {
    return browser.get('/')
  }

  public getParagraphText() {
    return element(by.scss('app-root h1')).getText()
  }
}
