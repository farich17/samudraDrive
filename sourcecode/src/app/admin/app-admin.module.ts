import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AdminModule} from 'common/admin/admin.module';
import {AppAdminRoutingModule} from './app-admin-routing.module';
import { ChipInputModule } from 'common/core/ui/chip-input/chip-input.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppAdminRoutingModule,
        AdminModule,

        ChipInputModule,
    ],
    declarations: [
    ],
    entryComponents: [

    ]
})
export class AppAdminModule {
}
