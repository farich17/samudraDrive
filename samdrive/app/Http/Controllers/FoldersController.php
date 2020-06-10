<?php

namespace App\Http\Controllers;

use App\Folder;
use App\FileEntry;
use App\Services\Entries\CreateFolder;
use Illuminate\Http\Request;
use Common\Core\Controller;
use Common\Files\Events\FileEntryCreated;

class FoldersController extends Controller
{
    /**
     * @var Folder
     */
    private $folder;

    /**
     * @var Request
     */
    private $request;

    /**
     * FoldersController constructor.
     * @param Folder $folder
     * @param Request $request
     */
    public function __construct(Folder $folder, Request $request)
    {
        $this->folder = $folder;
        $this->request = $request;
    }

    /**
     * Find a folder using specified params.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        if ($this->request->has('hash')) {
            $folder = $this->folder->with('users')->whereHash($this->request->get('hash'))->firstOrFail();
        }

        $this->authorize('show', $folder);

        return $this->success(['folder' => $folder]);
    }

    /**
     * Create a new folder.
     *
     * @param CreateFolder $action
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function store(CreateFolder $action)
    {
        $name = $this->request->get('name');
        $parentId = $this->request->get('parent_id');

        if ($parentId) {
            $this->authorize('store', [FileEntry::class, $parentId]);
        }

        $this->validate($this->request, [
            'name' => 'required|string|min:3',
            'parent_id' => 'nullable|integer|exists:file_entries,id'
        ]);

       $folder = $action->execute([
           'name' => $name,
           'parentId' => $parentId,
           'userId' => $this->request->user()->id
       ]);

        event(new FileEntryCreated($folder, $this->request->all()));

        return $this->success(['folder' => $folder->load('users')]);
    }
}
