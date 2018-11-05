import { SupportPage } from '../../services/support/support.model'

export class SupportCategory {
  public category = ''

  public pages: SupportPage[] = []

  constructor(category: string, pages: SupportPage[] = []) {
    this.category = category
    this.pages = pages
  }
}
