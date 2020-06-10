<?php

namespace App\Http\Controllers;

use Auth;
use Common\Core\Controller;
use App\Services\Entries\GetUserSpaceUsage;

class UserDiskSpaceController extends Controller
{
    /**
     * Get current user's space usage.
     *
     * @param GetUserSpaceUsage $action
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSpaceUsage(GetUserSpaceUsage $action)
    {
        $this->authorize('show', Auth::user());

        return $this->success($action->execute());
    }
}
