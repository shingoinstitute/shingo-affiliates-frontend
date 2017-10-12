import { Component, Input } from '@angular/core';
import { SupportPage } from '../../services/support/support.service';

@Component({
  selector: 'app-support-category',
  templateUrl: './support-category.component.html'
})
export class SupportCategoryComponent {
  @Input() public supportPages: SupportPage[] = [];
  @Input() public category: string = '';
}
