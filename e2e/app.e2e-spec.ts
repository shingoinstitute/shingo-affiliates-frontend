import { ShingoAffiliatesFrontendPage } from './app.po'

describe('shingo-affiliates-frontend App', () => {
  let page: ShingoAffiliatesFrontendPage

  beforeEach(() => {
    page = new ShingoAffiliatesFrontendPage()
  })

  it('should display welcome message', () => {
    page.navigateTo()
    expect(page.getParagraphText()).toEqual('Welcome to app!')
  })
})
