import { Component } from '@angular/core';
import { InlinePartialService } from '../../services/inline-partial.service';

@Component({
  selector: 'app-inline-partial',
  templateUrl: './inline-partial.page.html',
  styleUrls: ['./inline-partial.page.scss'],
  standalone: false,
})
export class InlinePartialPage {
  formatted = '';
  parsed = 0;

  constructor(private svc: InlinePartialService) {}

  run(): void {
    this.formatted = this.svc.format('  hello  ');
    this.parsed = this.svc.parse('42');
  }
}
