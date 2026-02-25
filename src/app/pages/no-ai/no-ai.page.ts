import { Component } from '@angular/core';
import { NoAiService } from '../../services/no-ai.service';

@Component({
  selector: 'app-no-ai',
  templateUrl: './no-ai.page.html',
  styleUrls: ['./no-ai.page.scss'],
  standalone: false,
})
export class NoAiPage {
  status = '';
  sum = 0;

  constructor(private svc: NoAiService) {}

  run(): void {
    this.status = this.svc.getStatus();
    this.sum = this.svc.add(3, 4);
  }
}
