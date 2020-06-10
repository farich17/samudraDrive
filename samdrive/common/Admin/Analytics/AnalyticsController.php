<?php namespace Common\Admin\Analytics;

use Cache;
use Carbon\Carbon;
use Common\Core\Controller;
use Common\Admin\Analytics\Actions\GetAnalyticsData;
use Common\Admin\Analytics\Actions\GetAnalyticsHeaderDataAction;

class AnalyticsController extends Controller
{
    /**
     * Get stats for analytics page.
     *
     * @param GetAnalyticsData $getDataAction
     * @param GetAnalyticsHeaderDataAction $getHeaderDataAction
     * @return array
     */
    public function stats(
        GetAnalyticsData $getDataAction,
        GetAnalyticsHeaderDataAction $getHeaderDataAction
    )
    {
        $this->authorize('index', 'ReportPolicy');

        $data = Cache::remember('analytics.data', Carbon::now()->addDay(), function() use($getHeaderDataAction, $getDataAction) {
            return [
                'mainData' => $getDataAction->execute(),
                'headerData' => $getHeaderDataAction->execute(),
            ];
        });

        return $this->success($data);
    }
}
