import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2
  } from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinDisabled,
  mixinElevation,
  mixinFlat,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  ThemeVariables
  } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = 'startTop';
const DEFAULT_BG = 'primary';
const DEFAULT_POSITION_VALUE = {
  end: '-11px',
  top: '-11px'
};
const styles = (theme: ThemeVariables) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    width: '22px',
    height: '22px',
    borderRadius: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
    zIndex: 1,
    fontSize: theme.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.badge.root
  },
  relative: {
    position: 'relative'
  }
});

/** @docs-private */
export class LyBadgeBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyBadgeMixinBase = mixinStyleUpdater(
mixinBg(
  mixinFlat(
    mixinColor(
      mixinRaised(
        mixinDisabled(
          mixinOutlined(
            mixinElevation(
              mixinShadowColor(LyBadgeBase)))))))));

@Directive({
  selector: 'ly-badge, [lyBadge]',
  inputs: [
    'bg',
    'flat',
    'color',
    'raised',
    'disabled',
    'outlined',
    'elevation',
    'shadowColor'
  ]
})
export class LyBadge extends LyBadgeMixinBase implements OnChanges, OnInit {
  /**
   * Styles
   * @docs-private
   */
  classes = this._theme.addStyleSheet(styles, STYLE_PRIORITY);
  private _content: string | number;
  private _position: string;
  private _positionClass: string;
  private _elContainer: any;
  private _badgeElementRef: any;
  private _lyBadgeBgClass: string;

  /** The content for the badge */
  @Input('lyBadge')
  set content(val: string | number) {
    if (val !== this.content) {
      this._content = val;
      this._createBadge();
    }
  }
  get content(): string | number {
    return this._content;
  }

  /** The position for the badge */
  @Input('lyBadgePosition')
  set position(val: string) {
    if (val !== this.position) {
      this._position = val;
      this._positionClass = this._theme.addStyle(`ly-badge.position:${val}`, (theme: ThemeVariables) => {
        const sty = theme.badge.position && theme.badge.position[val] || val === DEFAULT_POSITION ? DEFAULT_POSITION_VALUE : null;
        if (sty) {
          return sty;
        } else {
          throw new Error(`LyBadge.position \`${val}\` not found in \`ThemeVariables\``);
        }
      },
      this._badgeElementRef, this._positionClass, STYLE_PRIORITY);
    }

  }
  get position() {
    return this._position;
  }

  /** The color of the badge */
  @Input()
  get lyBadgeBg() {
    return this._lyBadgeBg;
  }
  set lyBadgeBg(val: string) {
    if (val !== this.lyBadgeBg) {
      this._lyBadgeBg = val;
      this._lyBadgeBgClass = this._theme.addStyle(`ly-badge.bg:${val}`, (theme: ThemeVariables) => ({
        backgroundColor: theme.colorOf(val),
        color: theme.colorOf(`${val}:contrast`)
      }),
      this._badgeElementRef, this._lyBadgeBgClass, STYLE_PRIORITY);
    }
  }
  private _lyBadgeBg: string;

  constructor(
    private _el: ElementRef,
    _theme: LyTheme2,
    private _renderer: Renderer2
  ) {
    super(_theme);
    this.setAutoContrast();
    this._badgeElementRef = this._el.nativeElement;
  }

  ngOnChanges() {
    if (!this.content) {
      this.updateStyle(this._el);
    }
  }

  ngOnInit() {

    /** Add root styles */
    this._renderer.addClass(this._badgeElementRef, this.classes.root);

    /** Set default position */
    if (!this.position) {
      this.position = DEFAULT_POSITION;
    }

    /** Set default bg */
    if (this.content && !this.lyBadgeBg) {
      this.lyBadgeBg = DEFAULT_BG;
    }
  }

  private _createBadge() {
    if (!this._elContainer) {
      const container = this._elContainer = this._renderer.createElement('div');
      this._renderer.appendChild(this._el.nativeElement, container);
      this._badgeElementRef = container;

      /** Add position relative */
      this._renderer.addClass(this._el.nativeElement, this.classes.relative);
    }
    this._elContainer.textContent = `${this.content}`;
  }

}
