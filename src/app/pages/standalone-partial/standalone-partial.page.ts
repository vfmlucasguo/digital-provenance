import { Component } from '@angular/core';
import { StandalonePartialService } from '../../services/standalone-partial.service';

@Component({
  selector: 'app-standalone-partial',
  templateUrl: './standalone-partial.page.html',
  styleUrls: ['./standalone-partial.page.scss'],
  standalone: false,
})
export class StandalonePartialPage {
  result = '';

  constructor(private svc: StandalonePartialService) {}

  run(): void {
    this.result = this.svc.aiImplementedMethod();
  }
}
