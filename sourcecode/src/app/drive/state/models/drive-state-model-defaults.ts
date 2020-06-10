import { DriveStateModel } from './drive-state-model';
import { ROOT_FOLDER_PAGE } from './drive-page';

export const DRIVE_STATE_MODEL_DEFAULTS: DriveStateModel = {
    isMobile: false,
    activePage: ROOT_FOLDER_PAGE,
    folderTree: [],
    flatFolders: {},
    userFoldersLoaded: false,
    entries: [],
    selectedEntries: [],
    dragging: false,
    loading: false,
    uploadsPanelOpen: false,
    viewMode: 'grid' as 'grid'|'list',
    detailsVisible: true,
    sidebarOpen: true,
    currentUser: null,
    spaceUsage: {
        available: null,
        used: null,
    },
    meta: {
        sortColumn: 'updated_at',
        sortDirection: 'desc',
        currentPage: 0,
        lastPage: 0,
    },
};
