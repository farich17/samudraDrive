import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { Observable, fromEvent, Subscription } from 'rxjs';

export abstract class BaseDropTarget implements OnInit, OnDestroy {
    @Select(DriveState.dragging) dragging: Observable<boolean>;
    protected subs: Subscription[] = [];
    protected active: boolean;
    protected abstract el: ElementRef;

    ngOnInit() {
        this.dragging.subscribe(dragging => {
            if (dragging) {
                this.onDragStart();
            } else {
                this.onDragEnd();
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    protected abstract canDrop();
    protected abstract executeAction();

    protected onDragStart() {
        const enter = fromEvent(this.el.nativeElement, 'mouseenter')
            .subscribe(() => this.onDragEnter());

        const leave = fromEvent(this.el.nativeElement, 'mouseleave')
            .subscribe(() => this.onDragLeave());

        this.subs.push(enter, leave);
    }

    protected onDragEnter() {
        if ( ! this.canDrop()) return;
        this.active = true;
        this.el.nativeElement.classList.add('drag-over');
    }

    protected onDragLeave() {
        this.active = false;
        this.removeDragOverClass();
    }

    protected onDragEnd() {
        this.unsubscribe();
        this.removeDragOverClass();

        // pointer never left element before drag stop,
        // we can assume that user dropped on this el
        if (this.active && this.canDrop()) {
            this.executeAction();
            this.active = false;
        }
    }

    protected unsubscribe() {
        this.subs.forEach(sub => sub && sub.unsubscribe());
    }

    protected removeDragOverClass() {
        this.el.nativeElement.classList.remove('drag-over');
    }
}
