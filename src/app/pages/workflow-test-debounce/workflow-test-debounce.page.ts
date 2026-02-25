import { Component } from '@angular/core';
import { WorkflowTestDebounceService } from '../../services/workflow-test-debounce.service';

@Component({
  selector: 'app-workflow-test-debounce',
  templateUrl: './workflow-test-debounce.page.html',
  styleUrls: ['./workflow-test-debounce.page.scss'],
  standalone: false,
})
export class WorkflowTestDebouncePage {
  result = '';

  constructor(private svc: WorkflowTestDebounceService) {}

  run(): void {
    const debounced = this.svc.debounce(() => {
      this.result = 'fired';
    }, 100);
    debounced();
    this.result = this.svc.humanHelper();
  }
}
