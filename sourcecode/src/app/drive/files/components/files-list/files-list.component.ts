import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { DriveEntry } from '../../models/drive-entry';
import { Sort } from '@angular/material';
import { Store } from '@ngxs/store';
import { ReloadPageEntries } from '../../../state/actions/commands';
import { SortColumn, SortDirection } from '../../../entries/available-sorts';

@Component({
    selector: 'files-list',
    templateUrl: './files-list.component.html',
    styleUrls: ['./files-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesListComponent implements OnInit {
    @Input() entries: DriveEntry[];

    constructor(private store: Store) {}


    ngOnInit() {

    }

    public sortChange(e: Sort) {
        const params = {
            orderBy: e.active as SortColumn,
            orderDir: e.direction as SortDirection
        };

        this.store.dispatch(new ReloadPageEntries(params));
    }

}
