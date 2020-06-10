import {Routes} from '@angular/router';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';

export const NOT_FOUND_ROUTES: Routes = [
    {
        path: '**',
        pathMatch: 'full',
        component: NotFoundPageComponent
    },
    {
        path: '404',
        pathMatch: 'full',
        component: NotFoundPageComponent
    },
];
