import { Routes, RouterModule } from '@angular/router';
import { Template1IndexComponent } from './template-1/index/template1-index.component';

const routes: Routes = [
    {
        path: '',
        component: Template1IndexComponent
    },
];

export const ClientTemplateRoutes = RouterModule.forChild(routes);
