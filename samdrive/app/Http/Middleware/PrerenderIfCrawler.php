<?php

namespace App\Http\Middleware;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Common\Core\Middleware\PrerenderIfCrawler as BasePrerenderIfCrawler;

class PrerenderIfCrawler extends BasePrerenderIfCrawler
{
    protected function getResponse($type, Request $request)
    {
        if ($type === 'homepage') {
            return $this->prerenderHomepage($request);
        }

        return null;
    }

    /**
     * @param Request $request
     * @return Request|View
     */
    protected function prerenderHomepage(Request $request)
    {
        $name = urldecode($request->route('name'));
        $payload = ['name' => $name, 'utils' => $this->utils];
        return response(view('prerender.homepage')->with($payload));
    }
}
