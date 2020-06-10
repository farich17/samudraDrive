import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareableLinksApiService } from '../../sharing/links/shareable-links-api.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PreviewFilesService } from 'common/file-preview/preview-files.service';
import { Settings } from 'common/core/config/settings.service';
import { ShareableLink } from '../../sharing/links/models/shareable-link';
import { FileEntry } from 'common/uploads/file-entry';
import { CurrentUser } from 'common/auth/current-user';
import { filter, map } from 'rxjs/operators';
import { Toast } from 'common/core/ui/toast.service';
import { Store } from '@ngxs/store';
import { DownloadEntries } from '../../state/actions/commands';

@Component({
    selector: 'link-preview-container',
    templateUrl: './link-preview-container.component.html',
    styleUrls: ['./link-preview-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        PreviewFilesService,
    ]
})
export class LinkPreviewContainerComponent implements OnInit, OnDestroy {
    public link$: BehaviorSubject<ShareableLink> = new BehaviorSubject(null);
    public entries$: BehaviorSubject<FileEntry[]> = new BehaviorSubject([]);
    public passwordPanelVisible$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private password: string;
    private downloadSub: Subscription;

    /**
     * Check if current user owns this entry or
     * already has it imported into their drive.
     */
    public get entryAlreadyImported$(): Observable<boolean> {
        const userId = this.currentUser.get('id');

        return this.link$.pipe(
            filter(link => !!link && !!link.entry && !!link.entry.users),
            map(link => link.entry),
            map(entry => !!entry.users.find(user => user.id === userId))
        );
    }

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private links: ShareableLinksApiService,
        public previewFiles: PreviewFilesService,
        public settings: Settings,
        public currentUser: CurrentUser,
        private router: Router,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.bindToDownload();

        this.route.params.subscribe(params => {
            this.links.findByHash(params.hash, {withEntries: true}).subscribe(response => {
                this.link$.next(response.link);

                if (this.link$.value.password) {
                    this.togglePasswordPanel(true);
                } else {
                    this.togglePasswordPanel(false);
                    this.showPreview();
                }

            }, () => {
                this.router.navigate(['/404']);
            });
        });
    }

    ngOnDestroy() {
        this.downloadSub.unsubscribe();
    }

    public import() {
        this.links.importEntry(this.link$.value.id, this.password)
            .subscribe(response => {
                const link = this.link$.value;
                link.entry.users = response.users;
                this.link$.next(link);
                this.toast.open(`"${link.entry.name}" imported into your drive.`);
            });
    }

    public togglePasswordPanel(value: boolean) {
        this.passwordPanelVisible$.next(value);
    }

    private bindToDownload() {
        this.downloadSub = this.previewFiles.download.subscribe(() => {
            const link = this.link$.value;
            this.store.dispatch(new DownloadEntries([link.entry], link, this.password));
        });
    }

    /**
     * Show preview for shareable link files.
     */
    private showPreview() {
        const link = this.link$.value;
        this.previewFiles.setPreviewUriTransformer(this.urlTransformer.bind(this));
        this.setEntries(link.entry);
    }

    /**
     * Set all preview entries.
     */
    private setEntries(entry: FileEntry) {
        let entries = entry.children.length ? entry.children : [entry];
        entries = entries.filter(ent => ent.type !== 'folder');
        this.entries$.next(entries);
    }

    public setValidPassword(password: string) {
        this.showPreview();
        this.togglePasswordPanel(false);
        this.password = password;
    }

    public urlTransformer(entryId: number) {
        let base = `secure/uploads/${entryId}?shareable_link=${this.link$.value.id}`;
        if (this.password) base += `&password=${this.password}`;
        return base;
    }
}
