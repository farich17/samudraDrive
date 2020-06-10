import { Directive, ElementRef, Input } from '@angular/core';
import { BaseDropTarget } from './base-drop-target';
import { DriveState} from '../../state/drive-state';
import { Store } from '@ngxs/store';
import { DriveFolder } from '../../folders/models/driveFolder';
import { MoveEntries } from '../../state/actions/commands';
import { ROOT_FOLDER, RootFolder } from '../../folders/root-folder';

@Directive({
    selector: '[folderDropTarget]'
})
export class FolderDropTargetDirective extends BaseDropTarget {
    @Input('folderDropTarget') folder: DriveFolder|RootFolder;

    constructor(
        protected el: ElementRef,
        protected store: Store,
    ) {
      super();
    }

    protected canDrop(): boolean {
        const entries = this.store.selectSnapshot(DriveState.selectedEntries),
            folder = this.folder as DriveFolder;

        // trying to move file to root, but file is already in root
        if (this.folder.id === 'root' && entries[0].parent_id === null) return false;

        return !entries.find(entry => entry.path.indexOf(folder.path) > -1);
    }

    protected executeAction() {
        const destination = this.folder.id;
        return this.store.dispatch(new MoveEntries(destination));
    }
}
