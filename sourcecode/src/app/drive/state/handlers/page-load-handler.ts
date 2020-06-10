import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { RouterNavigation, RouterState } from '@ngxs/router-plugin';
import {
    FolderPageOpened,
    RecentEntriesPageOpened, SearchPageOpened,
    SharesFolderOpened,
    StarredPageOpened,
    TrashPageOpened
} from '../actions/events';
import { DrivePageType } from '../models/available-pages';
import { DRIVE_PAGE_NAMES } from '../models/drive-page';
import { filter } from 'rxjs/operators';
import { CurrentUser } from 'common/auth/current-user';

const LINK_PREVIEW_PAGE = 's';

export class PageLoadHandler {
    constructor(
        private store: Store,
        private actions$: Actions,
        private currentUser: CurrentUser,
    ) {
        this.actions$
            .pipe(
                ofActionSuccessful(RouterNavigation),
                filter((action: RouterNavigation) => action.event.urlAfterRedirects.indexOf('drive') > -1),
                filter(() => this.currentUser.isLoggedIn()),
            )
            .subscribe(() => {
                const action = this.getPageLoadAction();
                if (action) this.store.dispatch(action);
            });
    }

    private getPageLoadAction() {
        const params = this.getPageUriParams();

        switch (params.pageName) {
            case DRIVE_PAGE_NAMES.RECENT:
                return new RecentEntriesPageOpened();
            case DRIVE_PAGE_NAMES.TRASH:
                return new TrashPageOpened();
            case DRIVE_PAGE_NAMES.SHARES:
                return new SharesFolderOpened();
            case DRIVE_PAGE_NAMES.STARRED:
                return new StarredPageOpened();
            case DRIVE_PAGE_NAMES.SEARCH:
                const state = this.store.selectSnapshot(RouterState.state),
                    search = state.root.firstChild.queryParams;
                return new SearchPageOpened({type: search.type, query: search.query});
            case LINK_PREVIEW_PAGE:
                return null;
            default:
                return new FolderPageOpened(params.folderHash || 'root');
        }
    }

    private getPageUriParams() {
        // remove query params
        const uri = this.store.selectSnapshot(RouterState.url).split('?')[0];

        // current drive uri parts
        let parts = uri.split('/');

        // remove empty parts
        parts = parts.filter(x => !!x);

        return {pageName: parts[1] as DrivePageType|string, folderHash: parts[2]};
    }
}
