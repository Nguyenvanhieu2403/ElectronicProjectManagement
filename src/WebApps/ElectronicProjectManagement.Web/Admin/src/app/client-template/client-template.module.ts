import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientTemplateRoutes } from './client-template.routing';
import { VnPostSharedModule } from 'vnpost-shared';
import { Template1IndexComponent } from './template-1/index/template1-index.component';
import { Template1FormComponent } from './template-1/form/template1-form.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    ClientTemplateRoutes,
    VnPostSharedModule.forRoot({ environment: environment }),
    ClickOutsideModule,
  ],
  declarations: [
    Template1IndexComponent,
    Template1FormComponent,
  ]
})
export class ClientTemplateModule { }
