import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { LyTheme, PALETTE, PaletteVariables as LyPalette } from 'alyle-ui/core';

@Component({
  selector: 'multiple-themes-demo-01',
  templateUrl: './multiple-themes-demo-01.component.html',
  styleUrls: ['./multiple-themes-demo-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleThemesDemo01Component {

  constructor(
    private theme: LyTheme,
    @Inject(PALETTE) public palette: LyPalette
  ) { }

}
