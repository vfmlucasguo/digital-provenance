import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-demo-list',
  templateUrl: './ai-demo-list.page.html',
  styleUrls: ['./ai-demo-list.page.scss'],
  standalone: false,
})
export class AiDemoListPage {
  scenarios = [
    { path: '/tabs/whole-by-path', title: 'Whole by Path', desc: 'Path contains ai-gen' },
    { path: '/tabs/header-whole', title: 'Header Whole', desc: 'Header @ai-generated' },
    { path: '/tabs/block-partial', title: 'Block Partial', desc: '@ai-generated-begin/end' },
    { path: '/tabs/standalone-partial', title: 'Standalone Partial', desc: '// @ai-generated' },
    { path: '/tabs/inline-partial', title: 'Inline Partial', desc: 'Trailing @ai-generated' },
    { path: '/tabs/no-ai', title: 'No AI', desc: 'Baseline (human-written)' },
    { path: '/tabs/pr-test-utils', title: 'PR Test 1', desc: '@generated-ai (dev branch)' },
    { path: '/tabs/pr-test-validator', title: 'PR Test 2', desc: 'Block validator (dev branch)' },
    { path: '/tabs/workflow-test-debounce', title: 'Workflow Test 1', desc: 'Inline debounce' },
    { path: '/tabs/workflow-test-fetch', title: 'Workflow Test 2', desc: 'Block parseJson' },
  ];
}
