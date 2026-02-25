import { Component } from '@angular/core';
import { PrTestValidatorService } from '../../services/pr-test-validator.service';

@Component({
  selector: 'app-pr-test-validator',
  templateUrl: './pr-test-validator.page.html',
  styleUrls: ['./pr-test-validator.page.scss'],
  standalone: false,
})
export class PrTestValidatorPage {
  result: string | null = null;

  constructor(private svc: PrTestValidatorService) {}

  run(): void {
    const valid = this.svc.validateEmail('test@example.com');
    this.result = valid ? 'Valid' : 'Invalid';
  }
}
