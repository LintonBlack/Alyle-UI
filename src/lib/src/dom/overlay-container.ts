import { Injectable, Component, Inject, HostListener, ElementRef, NgZone } from '@angular/core';
import { Platform } from '../platform/index';
import { LyTheme2 } from '../theme/theme2.service';
import { LyCoreStyles } from '../styles/core-styles';
import { DOCUMENT } from '@angular/common';
import { fromEvent , Observable, empty } from 'rxjs';
import { map, share, auditTime } from 'rxjs/operators';
import { ThemeVariables } from '../theme/theme-config';

const styles = (theme: ThemeVariables) => ({
  overlayBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.overlay,
    pointerEvents: 'none'
  }
});


@Injectable({
  providedIn: 'root'
})
export class WindowScrollService {

  public scroll$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    ngZone: NgZone
  ) {
    if (Platform.isBrowser) {
      ngZone.runOutsideAngular(() => {
        this.scroll$ = fromEvent(window.document, 'scroll').pipe(
          auditTime(20),
          map(() => {
            return window.scrollY || this.document.documentElement.scrollTop;
          }),
          share()
        );
      });
    } else {
      this.scroll$ = empty();
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class LyOverlayContainer {
  private _classes = this.theme.addStyleSheet(styles);
  protected readonly _containerElement: HTMLElement;
  private _items = new Set<any>();
  private _isActiveOverlayContainer: boolean;
  constructor(
    private theme: LyTheme2
  ) {
    if (Platform.isBrowser) {
      const container = document.createElement('ly-overlay-container');
      document.body.appendChild(container);
      this._containerElement = container;
    }
  }
  get containerElement(): HTMLElement {
    return this._containerElement;
  }

  /**
   * Add instance
   * @ignore
   */
  _add(item) {
    this._items.add(item);
    this.containerElement.appendChild(item);
    this._update();
  }

    /**
   * Remove instance
   * @ignore
   */
  _remove(item) {
    this.containerElement.removeChild(item);
    this._items.delete(item);
    this._update();
  }

  /**
   * Update styles for overlay container
   * @ignore
   */
  private _update() {
    if (this._items.size) {
      if (!this._isActiveOverlayContainer) {
        this._isActiveOverlayContainer = true;
        this._containerElement.classList.add(this._classes.overlayBackdrop);
      }
    } else if (this._isActiveOverlayContainer) {
      this._containerElement.classList.remove(this._classes.overlayBackdrop);
      this._isActiveOverlayContainer = false;
    }
  }
}

const BACKDROP_STYLES = ({
  backdrop: {
    pointerEvents: 'all'
  }
});

@Component({
  selector: 'ly-overlay-backdrop',
  template: ``
})
export class LyOverlayBackdrop {
  /** @ignore */
  classes = this._theme.addStyleSheet(BACKDROP_STYLES);
  @HostListener('click') onclick() {
    this._overlayConfig.fnDestroy();
  }
  constructor(
    el: ElementRef,
    private _theme: LyTheme2,
    @Inject('overlayConfig') private _overlayConfig: any,
    commonStyles: LyCoreStyles
  ) {
    el.nativeElement.classList.add(commonStyles.classes.fill);
    if (_overlayConfig.backdrop) {
      el.nativeElement.classList.add(this.classes.backdrop);
    }
  }
}
