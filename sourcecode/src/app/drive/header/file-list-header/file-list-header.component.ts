import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ReloadPageEntries } from '../../state/actions/commands';
import { AVAILABLE_SORTS, DriveSortOption, SortColumn, SortDirection } from '../../entries/available-sorts';
import { DriveState } from '../../state/drive-state';
import { Observable } from 'rxjs';
import { DrivePage } from '../../state/models/drive-page';

@Component({
    selector: 'file-list-header',
    templateUrl: './file-list-header.component.html',
    styleUrls: ['./file-list-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListHeaderComponent {
    @Select(DriveState.sortColumn) sortColumn$: Observable<DriveSortOption>;
    @Select(DriveState.activePage) activePage$: Observable<DrivePage>;
    public availableSorts = AVAILABLE_SORTS;

    constructor(private store: Store) {}

    public changeSort(sort: DriveSortOption) {
        this.store.dispatch(new ReloadPageEntries({orderBy: sort.name}));
    }

    public changeDirection(direction: SortDirection) {
        this.store.dispatch(new ReloadPageEntries({orderDir: direction}));
    }

    public sortIsActive(sort: DriveSortOption): boolean {
        return this.store.selectSnapshot(DriveState.sortColumn) === sort.name;
    }

    public directionIsActive(direction: SortDirection): boolean {
        return this.store.selectSnapshot(DriveState.sortDirection) === direction;
    }

    public getSortViewName(name: SortColumn): string {
        return this.availableSorts.find(sort => sort.name === name).viewName;
    }
}
