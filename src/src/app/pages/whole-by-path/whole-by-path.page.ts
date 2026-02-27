import { Component } from '@angular/core';
import { WholeByPathService } from '../../services/ai-gen/whole-by-path.service';

@Component({
  selector: 'app-whole-by-path',
  templateUrl: './whole-by-path.page.html',
  styleUrls: ['./whole-by-path.page.scss'],
  standalone: false,
})
export class WholeByPathPage {
  version = '';

  constructor(private svc: WholeByPathService) {
    this.version = svc.getVersion();
  }
}
