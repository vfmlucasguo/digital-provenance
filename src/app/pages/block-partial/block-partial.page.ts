import { Component } from '@angular/core';
import { BlockPartialService } from '../../services/block-partial.service';

@Component({
  selector: 'app-block-partial',
  templateUrl: './block-partial.page.html',
  styleUrls: ['./block-partial.page.scss'],
  standalone: false,
})
export class BlockPartialPage {
  result: string[] = [];

  constructor(private svc: BlockPartialService) {}

  run(): void {
    this.result = this.svc.process(['c', 'a', 'b']);
  }
}
