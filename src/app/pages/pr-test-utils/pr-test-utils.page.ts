import { Component } from '@angular/core';
import { PrTestUtilsService } from '../../services/pr-test-utils.service';

@Component({
  selector: 'app-pr-test-utils',
  templateUrl: './pr-test-utils.page.html',
  styleUrls: ['./pr-test-utils.page.scss'],
  standalone: false,
})
export class PrTestUtilsPage {
  result = '';

  constructor(private svc: PrTestUtilsService) {}

  run(): void {
    const clamped = this.svc.clamp(150, 0, 100);
    this.result = this.svc.formatDate(Date.now()) + ' | clamped: ' + clamped;
  }
}
