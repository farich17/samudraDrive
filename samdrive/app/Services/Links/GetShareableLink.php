<?php

namespace App\Services\Links;

use Auth;
use App\ShareableLink;

class GetShareableLink
{
    /**
     * @var ShareableLink
     */
    private $link;

    /**
     * @param ShareableLink $link
     */
    public function __construct(ShareableLink $link)
    {
        $this->link = $link;
    }

    /**
     * Get shareable link by entry id or link hash.
     *
     * @param int|string $idOrHash
     * @return ShareableLink
     */
    public function execute($idOrHash)
    {
        if (is_integer($idOrHash) || ctype_digit($idOrHash)) {
            return $this->getByEntryId($idOrHash);
        } else {
            return $this->getByHash($idOrHash);
        }
    }

    private function getByHash($hash)
    {
        return $this->link
            ->where('hash', $hash)
            ->first();
    }

    private function getByEntryId($entryId)
    {
        $userId = Auth::user()->id;

        return $this->link
            ->where('user_id', $userId)
            ->where('entry_id', $entryId)
            ->first();
    }
}