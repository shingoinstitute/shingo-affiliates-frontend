import { SupportPage } from '../../services/support/support.service';

export class SupportCategory {
  public category: string = '';

  public pages: SupportPage[] = [];

  public get iconUrl(): string { return this.pages && this.pages[0] && this.pages[0].categoryIcon ? this.pages[0].categoryIcon : ''; }

  constructor(category: string, pages: SupportPage[] = []) {
    this.category = category;
    this.pages = pages;
  }

  public getIconByCategory() {
    switch (this.category) {
      case 'Authentication':
        return 'http://res.cloudinary.com/shingo/image/upload/v1507933403/Affiliate%20Portal%20Images/ic_lock_outline_black_48dp_1x.png';
      case 'Workshops':
        return 'http://res.cloudinary.com/shingo/image/upload/v1507935722/Affiliate%20Portal%20Images/ic_school_black_48dp_1x.png';
      case 'Dashboard':
        return 'http://res.cloudinary.com/shingo/image/upload/v1507935635/Affiliate%20Portal%20Images/ic_dashboard_black_48dp_1x.png';
      case 'Affiliates':
        return 'http://res.cloudinary.com/shingo/image/upload/v1507935722/Affiliate%20Portal%20Images/ic_assessment_black_48dp_1x.png';
      case 'Facilitators':
        return 'http://res.cloudinary.com/shingo/image/upload/v1507935722/Affiliate%20Portal%20Images/ic_group_black_48dp_1x.png';
      case 'Other':
        return 'http://res.cloudinary.com/shingo/image/upload/v1507935722/Affiliate%20Portal%20Images/ic_info_black_48dp_1x.png';
      default:
        return '';
    }
  }

}