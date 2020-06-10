import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {  MatDialogRef } from '@angular/material';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    DeleteShareableLink,
    LinkCopySuccess,
    LoadShareableLink, ResetShareLinkState,
    ShareLinkState,
    ToggleOptionsPanel
} from '../links/share-link.state';
import { Settings } from 'common/core/config/settings.service';
import { shareLinkSocially } from 'common/core/utils/shareLink';
import { ShareableLink } from '../links/models/shareable-link';
import { animate, state, style, transition, trigger } from '@angular/animations';
import copy from 'copy-to-clipboard';
import { BaseDialog } from 'common/core/ui/dialogs/base-dialog';
import { Toast } from 'common/core/ui/toast.service';

@Component({
    selector: 'share-link-dialog',
    templateUrl: './share-link-dialog.component.html',
    styleUrls: ['./share-link-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('visibility', [
            state('true', style({
                height: '*',
                padding: '*',
                display: 'block',
                overflow: '*',
            })),
            state('false', style({
                height: '0',
                padding: '0',
                display: 'none',
                overflow: 'hidden',
            })),
            transition('true <=> false', animate('225ms cubic-bezier(.4,0,.2,1)'))
        ]),
    ],
})
export class ShareLinkDialogComponent extends BaseDialog implements AfterViewInit, OnInit, OnDestroy {
    @Select(ShareLinkState.loading) loading$: Observable<boolean>;
    @Select(ShareLinkState.link) link$: Observable<ShareableLink>;
    @Select(ShareLinkState.optionsVisible) optionsVisible$: Observable<boolean>;
    public shareableLink$ = new BehaviorSubject(null);

    constructor(
        protected store: Store,
        protected toast: Toast,
        protected actions$: Actions,
        protected settings: Settings,
        protected dialogRef: MatDialogRef<ShareLinkDialogComponent>,
    ) {
        super();
    }

    ngOnInit() {
        this.store.dispatch(new LoadShareableLink());
        this.bindToOptionsPanelToggle();
    }

    ngAfterViewInit() {
        this.bindToLinkChange();
    }

    ngOnDestroy() {
        this.store.dispatch(new ResetShareLinkState());
    }

    public toggleOptionsPanel() {
        this.store.dispatch(new ToggleOptionsPanel());
    }

    public deleteLink() {
        this.store.dispatch(new DeleteShareableLink()).subscribe(() => {
            this.toast.open('Link deleted.');
            this.dialogRef.close();
        });
    }

    public copyLinkToClipboard() {
        this.focusInput();
        const success = copy(this.shareableLink$.value);

        if (success) {
            this.store.dispatch(new LinkCopySuccess());
        }
    }

    private bindToLinkChange() {
        this.link$.subscribe(link => {
            if ( ! link) return;
            this.shareableLink$.next(this.settings.getBaseUrl() + 'drive/s/' + link.hash);
            setTimeout(() => this.focusInput());
        });
    }

    private bindToOptionsPanelToggle() {
        const sub = this.actions$.pipe(ofActionDispatched(ToggleOptionsPanel))
            .subscribe(() => {
                // close dialog if user canceled link creation
                if ( ! this.store.selectSnapshot(ShareLinkState.optionsVisible) && ! this.shareableLink$.value) {
                    this.close();
                }
            });

        this.addSubs(sub);
    }

    public shareLink(network: string) {
        shareLinkSocially(network, this.shareableLink$.value);
    }

    public focusInput() {
        const input = document.getElementById('link-input') as HTMLInputElement;
        input.focus();
        input.select();
    }
}