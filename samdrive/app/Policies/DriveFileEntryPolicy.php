<?php

namespace App\Policies;

use Common\Core\Policies\FileEntryPolicy;
use Hash;
use Common\Auth\User;
use App\ShareableLink;
use Common\Files\FileEntry;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\HandlesAuthorization;

class DriveFileEntryPolicy extends FileEntryPolicy
{
    use HandlesAuthorization;
    /**
     * @var Request
     */
    private $request;

    /**
     * @var ShareableLink
     */
    private $link;

    /**
     * @param Request $request
     * @param ShareableLink $link
     */
    public function __construct(Request $request, ShareableLink $link)
    {
        $this->link = $link;
        $this->request = $request;
    }

    public function show(User $user, FileEntry $entry, ShareableLink $link = null)
    {
        if ($link = $this->getLinkForRequest($link)) {
            $password = $this->request->get('password');

            // check password first, if needed
            if ( ! $this->passwordIsValid($link, $password)) {
                return false;
            }

            // user can view this file if file or its parent is attached to specified link
            if ($link->entry_id === $entry->id || $link->entry_id === $entry->parent_id) {
                return true;
            }
        }

        return parent::show($user, $entry);
    }

    /**
     * Get shareable link for current request.
     *
     * @param ShareableLink|null $link
     * @return ShareableLink|null
     */
    private function getLinkForRequest(ShareableLink $link = null) {
        if ($link) return $link;

        if ($this->request->has('shareable_link')) {
            $linkId = $this->request->get('shareable_link');
            return $this->link->findOrFail($linkId);
        }

        return null;
    }

    /**
     * Check if link password is valid (if link has a password)
     *
     * @param ShareableLink $link
     * @param string|null $password
     * @return bool
     */
    private function passwordIsValid(ShareableLink $link, $password)
    {
        // link has no password
        if ( ! $link->password) return true;

        return Hash::check($password, $link->password);
    }
}
