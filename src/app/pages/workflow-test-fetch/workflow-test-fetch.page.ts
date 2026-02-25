import { Component } from '@angular/core';
import { WorkflowTestFetchService } from '../../services/workflow-test-fetch.service';

@Component({
  selector: 'app-workflow-test-fetch',
  templateUrl: './workflow-test-fetch.page.html',
  styleUrls: ['./workflow-test-fetch.page.scss'],
  standalone: false,
})
export class WorkflowTestFetchPage {
  result = '';

  constructor(private svc: WorkflowTestFetchService) {}

  async run(): Promise<void> {
    const parsed = await this.svc.parseJson<{ key: string }>('{"key":"value"}');
    this.result = parsed.key;
  }
}
