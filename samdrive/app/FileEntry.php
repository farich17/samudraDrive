<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Common\Files\FileEntry as CommonFileEntry;


/**
 * @method static \Illuminate\Database\Query\Builder|FileEntry onlyStarred()
 */
class FileEntry extends CommonFileEntry
{
    protected $table = 'file_entries';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function labels()
    {
        return $this->tags()->where('tags.type', 'label');
    }

    /**
     * Get only entries that are not children of another entry.
     *
     * @param Builder $builder
     * @return Builder
     */
    public function scopeRootOnly(Builder $builder) {
        return $builder->where('parent_id', null);
    }

    /**
     * Get only entries that are starred.
     * Only show entries from root or entries whose parent is not starred.
     *
     * @param Builder $builder
     * @return Builder
     */
    public function scopeOnlyStarred(Builder $builder) {
        return $builder->whereHas('labels', function($query) {
            return $query->where('tags.name', 'starred');
        })->where(function($query) {
            $query->rootOnly()->orWhereDoesntHave('parent', function($query) {
                return $query->whereHas('labels', function($q) {
                    return $q->where('tags.name', 'starred');
                });
            });
        });
    }
}
