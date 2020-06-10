import {
    Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy,
} from '@angular/core';
import { DriveEntry } from '../../files/models/drive-entry';
import { OverlayPanelRef } from 'common/core/ui/overlay-panel/overlay-panel-ref';
import { OVERLAY_PANEL_DATA } from 'common/core/ui/overlay-panel/overlay-panel-data';
import { DriveContextMenuComponent } from '../../context-actions/components/drive-context-menu/drive-context-menu.component';
import { ContextMenu } from 'common/core/ui/context-menu/context-menu.service';
import { PreviewFilesService } from 'common/file-preview/preview-files.service';
import { DownloadEntries } from '../../state/actions/commands';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

export interface FilePreviewOverlayData {
    entries: DriveEntry[];
}

@Component({
    selector: 'file-preview-overlay',
    templateUrl: './file-preview-overlay.component.html',
    styleUrls: ['./file-preview-overlay.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilePreviewOverlayComponent implements AfterViewInit, OnDestroy {
    public entries: DriveEntry[] = [];
    @ViewChild('previewContainer', {read: ElementRef}) previewContainer: ElementRef;
    @ViewChild('moreOptionsButton', {read: ElementRef}) optionsButton: ElementRef;
    private downloadSub: Subscription;

    constructor(
        private store: Store,
        private el: ElementRef,
        private contextMenu: ContextMenu,
        private overlayRef: OverlayPanelRef,
        private previewFiles: PreviewFilesService,
        @Inject(OVERLAY_PANEL_DATA) public data: FilePreviewOverlayData
    ) {
        this.entries = data.entries;
    }

    ngAfterViewInit() {
        this.bindToDownload();

        this.previewContainer.nativeElement.addEventListener('click', e => {
            if ( ! e.target.closest('.preview-object')) {
                this.overlayRef.close();
            }
        });
    }

    ngOnDestroy() {
        this.downloadSub.unsubscribe();
    }

    public openContextMenu() {
        const origin = this.optionsButton.nativeElement;
        this.contextMenu.open(DriveContextMenuComponent, origin, {data: {entry: this.previewFiles.getCurrent()}});
    }

    public closeOverlay() {
        this.overlayRef.close();
    }

    private bindToDownload() {
        this.downloadSub = this.previewFiles.download.subscribe(() => {
            const entries = this.previewFiles.getAllEntries();
            this.store.dispatch(new DownloadEntries(entries));
        });
    }
}
