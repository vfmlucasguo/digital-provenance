import { Component } from '@angular/core';
import { BlockPartialService } from '../../services/block-partial.service';

@Component({
  selector: 'app-block-partial',
  templateUrl: './block-partial.page.html',
  styleUrls: ['./block-partial.page.scss'],
  standalone: false,
})
export class BlockPartialPage {
  result = '';

  constructor(private svc: BlockPartialService) {
    this.result = JSON.stringify(svc.parseJson<{ x: number }>('{"x":1}'));
  }
}
