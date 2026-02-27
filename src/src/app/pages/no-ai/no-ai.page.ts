import { Component } from '@angular/core';
import { NoAiService } from '../../services/no-ai.service';

@Component({
  selector: 'app-no-ai',
  templateUrl: './no-ai.page.html',
  styleUrls: ['./no-ai.page.scss'],
  standalone: false,
})
export class NoAiPage {
  value = '';

  constructor(private svc: NoAiService) {
    this.value = String(svc.identity(42));
  }
}
