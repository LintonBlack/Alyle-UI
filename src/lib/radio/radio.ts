import {
  Component,
  forwardRef,
  NgModule,
  Input,
  Output,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ContentChildren,
  QueryList,
  Optional,
  EventEmitter,
  ChangeDetectionStrategy,
  NgZone,
  ViewChild,
  ElementRef,
  Renderer2,
  SimpleChanges,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LyCommonModule, LyTheme2, LyCoreStyles, toBoolean, mixinColor, mixinDisableRipple } from '@alyle/ui';
import { LyRadioService } from './radio.service';

const STYLE_PRIORITY = -2;
const DEFAULT_DISABLE_RIPPLE = false;

export const LY_RADIO_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyRadioGroup),
  multi: true
};

let idx = 0;

export class UndefinedValue {
  constructor() { }
}

const styles = theme => ({
  label: {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    position: 'relative',
    display: 'flex',
    alignItems: 'baseline'
  },
  container: {
    position: 'relative',
    width: '1.5em',
    margin: 'auto',
    '&>div *': {
      margin: 'auto',
      borderRadius: '50%',
      transition: 'transform cubic-bezier(.1, 1, 0.5, 1)',
      transitionDuration: '250ms',
      width: '1em',
      height: '1em'
    },
    '& div>:nth-child(2)': {
      background: 'currentColor',
      transform: 'scale(0)'
    },
    '& div>:nth-child(1)': {
      transform: 'scale(1)',
      border: 'solid .08em currentColor',
      color: theme.radio.radioOuterCircle
    }
  }
});

@Component({
  selector: 'ly-radio-group',
  template: `<ng-content></ng-content>`,
  providers: [LY_RADIO_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'lyRadioGroup'
})
export class LyRadioGroup implements ControlValueAccessor {
  _value = new UndefinedValue;
  name = `ly-radio-name-${idx++}`;
  _color = 'accent';

  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);

  @Input()
  set value(val: any) {
    if (this._value !== val) {
      if (this._radios) {
        this._updateCheckFromValue(val);
      }
    }
  }
  get value() {
    return this._value;
  }

  @Output() readonly change: EventEmitter<void> = new EventEmitter<void>();

  @Input() color = 'accent';
  @ContentChildren(forwardRef(() => LyRadio)) _radios: QueryList<LyRadio>;

  /** The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   * @docs-private
   */
  onTouched: () => any = () => {};

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  writeValue(value: any) {
    if (!!this._radios) {
      this.value = value;
      this.markForCheck();
    }
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean) {
    // this.disabled = isDisabled;
    this.markForCheck();
  }

  constructor(
    public _radioService: LyRadioService,
    elementRef: ElementRef,
    _renderer: Renderer2,
    public theme: LyTheme2,
    public ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    _renderer.addClass(elementRef.nativeElement, this._radioService.classes.root);
  }

  _updateCheckFromValue(val: any) {
    let newChecked: boolean;
    this._radios.forEach(radioButton => {
      if (val === radioButton.value) {
        this.updatevalue(val);
        newChecked = true;
        radioButton.checked = true;
      } else if (radioButton.checked) {
        radioButton.checked = false;
      }
    });
    if (!newChecked) {
      /** when val not exist in radio button !==  */
      this._controlValueAccessorChangeFn(null);
      if (this._value !== null) {
        this._value = null;
      }
    }
  }

  updatevalue(value: any) {
    this._value = value;
    this._controlValueAccessorChangeFn(value);
    this.change.emit();
    this.markForCheck();
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  _radioResetChecked() {
    this._radios.forEach(_ => _._setCheckedToFalsy());
  }

}

/** @docs-private */
export class LyRadioBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

/** @docs-private */
export const LyRadioMixinBase = mixinDisableRipple(mixinColor(LyRadioBase));

@Component({
  selector: 'ly-radio',
  template: `
  <label #_labelContainer [attr.for]="inputId" [className]="radioGroup.classes.label">
    <input
      [className]="coreStyles.classes.visuallyHidden"
      [id]="inputId"
      [checked]="checked"
      [name]="name"
      (change)="_onInputChange($event)"
      (click)="_onInputClick($event)"
      type="radio"
      >
    <div #_radioContainer>
      <div>
        <div [className]="coreStyles.classes.fill"></div>
        <div [className]="coreStyles.classes.fill"></div>
      </div>
    </div>
    <div
    [className]="radioGroup._radioService.classes.labelContent">
      <ng-content></ng-content>
    </div>
  </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  inputs: [
    'color',
    'disableRipple'
  ]
})
export class LyRadio extends LyRadioMixinBase implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  id = `ly-radio-id-${idx++}`;
  name = '';
  _value = null;
  // private _withColor: string;
  private _checked = false;
  private checkedClass: string;
  @ViewChild('_radioContainer') private _radioContainer: ElementRef;
  @ViewChild('_labelContainer') _labelContainer: ElementRef;
  // @Input()
  // set withColor(val: string) {
  //   if (this._withColor !== val) {
  //     this._withColor = val;
  //     if (this.checkedClass) {
  //       /** create new class if exist `this.checkedClass` */
  //       this.checkedClass = this._createStyleWithColor(val);
  //     }
  //   }
  // }
  // get withColor() {
  //   return this._withColor;
  // }
  @Output() change = new EventEmitter<boolean>();

  @Input()
  set value(val) {
    if (this._value !== val) {
      this._value = val;
    }
  }
  get value() { return this._value; }

  @Input()
  set checked(val: boolean) {
    const newCheckedState = toBoolean(val);
    const before = this._checked;
    if (before !== newCheckedState) {
      this._checked = newCheckedState;
      if (!before && newCheckedState) {
        /** Use current checked class or create new class */
        this.checkedClass = this.checkedClass || this._createStyleWithColor(this.color || this.radioGroup.color);
        /** Add class checked */
        this._renderer.addClass(this._radioContainer.nativeElement, this.checkedClass);

        if (this.value !== this.radioGroup.value) {
          /** update Value */
          this.radioGroup.updatevalue(this.value);
        }
      } else {
        /** Remove class checked */
        this._renderer.removeClass(this._radioContainer.nativeElement, this.checkedClass);
      }
      this._markForCheck();
    }
  }
  get checked() {
    return this._checked;
  }
  get inputId(): string {
    return `${this.id}-input`;
  }

  _onInputChange(event: any) {
    event.stopPropagation();
    this.radioGroup._updateCheckFromValue(this.value);
    this.radioGroup._touch();
  }

  _onInputClick(event: Event) { event.stopPropagation(); }

  _setCheckedToFalsy() {
    this.checked = false;
  }

  _createStyleWithColor(val: string) {
    return this._theme.addStyle(
      `lyRadio-checked:${val}`, theme => ({
        color: theme.colorOf(val),
        '& div>:nth-child(1)': {
          transform: 'scale(1.25)',
          color: theme.colorOf(val),
        },
        '& div>:nth-child(2)': {
          transform: 'scale(0.8)'
        },
      }),
      this._radioContainer.nativeElement,
      this.checkedClass,
      STYLE_PRIORITY
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.color) {
      if (this.checkedClass) {
        /** create new class if exist `this.checkedClass` */
        this.checkedClass = this._createStyleWithColor(changes.color.currentValue);
      }
    }
  }

  ngOnInit() {
    if (this.radioGroup) {
      // Copy name from parent radio group
      this.name = this.radioGroup.name;
      this._renderer.addClass(this._radioContainer.nativeElement, this.radioGroup.classes.container);
    }
  }

  ngAfterViewInit() {
    this._rippleContainer = this._radioContainer;

    // set default disable ripple
    if (this.disableRipple === null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this._removeRippleEvents();
  }


  constructor(
    @Optional() public radioGroup: LyRadioGroup,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    theme: LyTheme2,
    private changeDetectorRef: ChangeDetectorRef,
    ngZone: NgZone,
    public coreStyles: LyCoreStyles
  ) {
    super(theme, ngZone);
    this._triggerElement = this._elementRef;
    this._rippleConfig = {
      centered: true,
      radius: 'containerSize',
      percentageToIncrease: 100
    };
    _renderer.addClass(_elementRef.nativeElement, radioGroup._radioService.classes.radioButton);
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, LyCommonModule],
  exports: [LyRadioGroup, LyRadio],
  declarations: [LyRadioGroup, LyRadio],
})
export class LyRadioModule { }
