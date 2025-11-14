import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CamundaService } from '../../../utils/camunda.service';
import { IframeService } from '../../services/iframe.service';

@Component({
  selector: 'app-left-nav',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './left-nav.html',
  styleUrl: './left-nav.css',
})
export class LeftNav {
   @Input() collapsed = false;

   constructor(private iframeService: IframeService, private router: Router, private camundaService: CamundaService ) 
   {}

  // open iframe
  openIframe(url: string) {
    this.iframeService.setUrl(url);
    this.router.navigate(['/iframe']);
  }
  navigateTo(route: string) {
    console.log('Navigating to:', route);
    this.router.navigate([route]);
    
    const payload = {
      processDefinitionId: 'PreArrangementProcess',
      processDefinitionVersion: -1,
      variables: {}
    }

    this.camundaService.startProcess(payload)
      .subscribe((response: any) => {

        const processInstanceKey = response?.processInstanceKey;
        this.camundaService.setProcessInstanceKey(processInstanceKey || '');
        console.log('Process started successfully:', response);
      }, error => {
        console.error('Error starting process:', error);
      }
    );
    
    // .then((response: any) => {

    //   const processInstanceKey = response?.processInstanceKey;

    //   this.camundaService.setProcessInstanceKey(processInstanceKey || '');
    //   console.log('Process started successfully:', response);
    // }).catch(error => {
    //   console.error('Error starting process:', error);
    // });
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }

}
