import { Component } from '@angular/core';
import { HeaderWholeService } from '../../services/header-whole.service';

@Component({
  selector: 'app-header-whole',
  templateUrl: './header-whole.page.html',
  styleUrls: ['./header-whole.page.scss'],
  standalone: false,
})
export class HeaderWholePage {
  title = '';
  value = 0;

  constructor(private svc: HeaderWholeService) {}

  run(): void {
    this.title = this.svc.getTitle();
    this.value = this.svc.compute(21);
  }
}
