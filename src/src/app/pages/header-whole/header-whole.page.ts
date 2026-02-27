import { Component } from '@angular/core';
import { HeaderWholeService } from '../../services/header-whole.service';

@Component({
  selector: 'app-header-whole',
  templateUrl: './header-whole.page.html',
  styleUrls: ['./header-whole.page.scss'],
  standalone: false,
})
export class HeaderWholePage {
  formatted = '';

  constructor(private svc: HeaderWholeService) {
    this.formatted = svc.format();
  }
}
