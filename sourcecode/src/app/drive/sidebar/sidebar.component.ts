import {Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import { DriveUrlsService } from '../drive-urls.service';
import { DriveFolder } from '../folders/models/driveFolder';
import { DriveState} from '../state/drive-state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OpenFolder } from '../state/actions/commands';
import { ROOT_FOLDER, RootFolder } from '../folders/root-folder';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
    @Select(DriveState.activePage) activeFolder: Observable<string>;

    constructor(
        public urls: DriveUrlsService,
        private store: Store
    ) {}

    public openFolder(folder: DriveFolder) {
        this.store.dispatch(new OpenFolder(folder));
    }

    public getRootFolder(): RootFolder {
        return ROOT_FOLDER;
    }
}
