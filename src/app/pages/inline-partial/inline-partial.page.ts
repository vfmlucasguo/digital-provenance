import { Component } from '@angular/core';
import { InlinePartialService } from '../../services/inline-partial.service';

@Component({
  selector: 'app-inline-partial',
  templateUrl: './inline-partial.page.html',
  styleUrls: ['./inline-partial.page.scss'],
  standalone: false,
})
export class InlinePartialPage {
  trimmed = '';

  constructor(private svc: InlinePartialService) {
    this.trimmed = svc.trim('  hello  ');
  }
}
