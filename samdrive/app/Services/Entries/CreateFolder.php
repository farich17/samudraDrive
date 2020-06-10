<?php

namespace App\Services\Entries;

use App\Folder;
use Illuminate\Support\Arr;

class CreateFolder
{
    /**
     * @var Folder
     */
    private $folder;

    /**
     * @param Folder $folder
     */
    public function __construct(Folder $folder)
    {
        $this->folder = $folder;
    }

    /**
     * Create a new folder from specified data.
     * @param array $data
     * @return Folder
     */
    public function execute($data)
    {
        $folder = $this->folder->create([
            'name' => $data['name'],
            'file_name' => $data['name'],
            'parent_id' => Arr::get($data, 'parentId'),
        ]);

        $folder->generatePath();

        $folder->users()->attach($data['userId'], ['owner' => true]);

       return $folder;
    }
}