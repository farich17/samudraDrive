import { Actions, ofAction, ofActionSuccessful, Store } from '@ngxs/store';
import { AddStar, HideLoadingToast, RemoveStar, RestoreTrashedEntries, ShowLoadingToast } from '../actions/commands';
import {
    EntryRenamed,
    FileDeleteSuccess,
    MoveEntriesFailed,
    MoveEntriesSuccess,
    NewFolderCreated, NotEnoughSpaceError,
    TrashedEntriesDeleteSuccess,
    TrashedEntriesRestoreSuccess
} from '../actions/events';
import { Toast } from 'common/core/ui/toast.service';
import { LinkCopySuccess } from '../../sharing/links/share-link.state';
import { Router } from '@angular/router';
import { LoadingToastComponent } from '../../messages/loading-toast/loading-toast.component';
import { MatSnackBarRef } from '@angular/material';

export class ToastHandler {
    constructor(
        private actions$: Actions,
        private toast: Toast,
        private store: Store,
        private router: Router,
    ) {
        this.entriesDeleted();
        this.entriesStarred();
        this.entriesUnstarred();
        this.entriesMoveFailed();
        this.folderCreated();
        this.entriesMoved();
        this.entriesDeletedForever();
        this.entriesRestoredFromTrash();
        this.entryRenamed();
        this.linkCopiedToClipboard();
        this.notEnoughSpace();
        this.loadingToast();
    }

    private entriesDeleted() {
        this.actions$
            .pipe(ofAction(FileDeleteSuccess))
            .subscribe((action: FileDeleteSuccess) => {
                this.toast.open(`Deleted ${action.deletedFiles.length} items`, {action: 'UNDO'})
                    .onAction().subscribe(() => {
                        this.store.dispatch(new RestoreTrashedEntries(action.deletedFiles));
                    });
            });
    }

    private entriesStarred() {
        this.actions$
            .pipe(ofActionSuccessful(AddStar))
            .subscribe((action: AddStar) => {
                this.toast.open(`Star added.`, {action: 'UNDO'}).onAction()
                    .subscribe(() => {
                        this.store.dispatch(new RemoveStar(action.entries));
                    });
            });
    }

    private entriesUnstarred() {
        this.actions$
            .pipe(ofActionSuccessful(RemoveStar))
            .subscribe((action: RemoveStar) => {
                this.toast.open(`Star Removed.`, {action: 'UNDO'}).onAction()
                    .subscribe(() => {
                        this.store.dispatch(new AddStar(action.entries));
                    });
            });
    }

    private entriesMoved() {
        this.actions$.pipe(ofAction(MoveEntriesSuccess))
            .subscribe((action: MoveEntriesSuccess) => {
                this.toast.open(`Moved ${action.entries.length} items.`, {action: 'Undo'});
            });
    }

    private entriesMoveFailed() {
        this.actions$.pipe(ofAction(MoveEntriesFailed))
            .subscribe(() => {
                this.toast.open('There was an issue with moving selected items.');
            });
    }

    private folderCreated() {
        this.actions$.pipe(ofAction(NewFolderCreated))
            .subscribe(() => {
                this.toast.open('Folder created.');
            });
    }

    private entriesDeletedForever() {
        this.actions$.pipe(ofActionSuccessful(TrashedEntriesDeleteSuccess))
            .subscribe((action: TrashedEntriesDeleteSuccess) => {
                this.toast.open(`Permanently deleted ${action.entries.length} items.`);
            });
    }

    private entriesRestoredFromTrash() {
        this.actions$.pipe(ofActionSuccessful(TrashedEntriesRestoreSuccess))
            .subscribe((action: TrashedEntriesRestoreSuccess) => {
                this.toast.open(`Restored ${action.entries.length} items.`);
            });
    }

    private entryRenamed() {
        this.actions$.pipe(ofActionSuccessful(EntryRenamed))
            .subscribe((action: EntryRenamed) => {
                this.toast.open(`${action.entry.name} renamed to ${action.newName}`);
            });

    }

    private linkCopiedToClipboard() {
        this.actions$.pipe(ofActionSuccessful(LinkCopySuccess))
            .subscribe(() => {
                this.toast.open(`Link copied to clipboard.`);
            });
    }

    private notEnoughSpace() {
        this.actions$.pipe(ofActionSuccessful(NotEnoughSpaceError))
            .subscribe(() => {
                this.toast.open(`You are out of space. Try to delete some files.`, {action: 'Upgrade'})
                    .onAction().subscribe(() => {
                        this.router.navigate(['/billing/upgrade']);
                    });
            });
    }

    private loadingToast() {
        let toastRef: MatSnackBarRef<any>;

        this.actions$.pipe(ofActionSuccessful(ShowLoadingToast))
            .subscribe((action: ShowLoadingToast) => {
                toastRef = this.toast.openComponent(LoadingToastComponent, {duration: 0, data: {message: action.message}});
            });

        this.actions$.pipe(ofActionSuccessful(HideLoadingToast))
            .subscribe(() => {
                if (toastRef) {
                    toastRef.dismiss();
                    toastRef = null;
                }
            });

    }
}
