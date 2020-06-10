<?php

namespace App\Http\Controllers;

use Auth;
use App\FileEntry;
use Illuminate\Http\Request;
use App\Services\Entries\FetchDriveEntries;
use Common\Files\Controllers\FileEntriesController;

class DriveEntriesController extends FileEntriesController
{
    /**
     * @var Request
     */
    protected $request;

    /**
     * @var FileEntry
     */
    protected $entry;

    /**
     * DriveEntriesController Constructor.
     *
     * @param Request $request
     * @param FileEntry $entry
     */
    public function __construct(
        Request $request,
        FileEntry $entry
    ) {
        parent::__construct($request, $entry);
        $this->request = $request;
        $this->entry = $entry;
    }

    /**
     * @return array
     */
    public function index()
    {
        $params = $this->request->all();

        $params['userId'] = $this->request->get('userId', Auth::user()->id);

        $this->authorize('index', [FileEntry::class, null, $params['userId']]);

        return app(FetchDriveEntries::class)->execute($params);
    }

    /**
     * Rename specified entry.
     *
     * @param int $entryId
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function rename($entryId)
    {
        $this->authorize('update', [FileEntry::class, [$entryId]]);

        $this->validate($this->request, [
            'name' => 'required|string|min:3'
        ]);

        $entry = $this->entry->findOrFail($entryId);

        $entry->update(['name' => $this->request->get('name')]);

        return $this->success();
    }
}
