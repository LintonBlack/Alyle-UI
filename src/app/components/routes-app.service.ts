import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoutesAppService {
  routesApp: { routes: any[], name: string, route: string }[];
  componentState: string;
  constructor( ) {
    this.routesApp = [
      {
        name: 'Getting Started',
        route: 'getting-started',
        routes: [
          { route: 'installation', name: 'Install' }
        ]
      },
      {
        name: 'Customization',
        route: 'customization',
        routes: [
          { route: 'theming', name: 'Theming' },
          { route: 'multiple-themes', name: 'Multiple themes' },
          { route: 'bg-color', name: 'Bg & Color' },
          { route: 'dynamic-styles', name: 'Dynamic styles'}
        ]
      },
      {
        name: 'Layout',
        route: 'layout',
        routes: [
          { route: 'grid', name: 'Grid' },
          { route: 'responsive', name: 'Responsive' },
          { route: 'tabs', name: 'Tabs' }
        ]
      },
      {
        name: 'Components',
        route: 'components',
        routes: [
          { route: 'button', name: 'Button' },
          { route: 'card', name: 'Card' },
          { route: 'carousel', name: 'Carousel' },
          { route: 'drawer', name: 'Drawer', status: 'alpha' },
          { route: 'icon-button', name: 'Icon button' },
          { route: 'input', name: 'Input', status: 'alpha' },
          { route: 'menu', name: 'Menu' },
          { route: 'radio', name: 'Radio' },
          { route: 'resizing-cropping-images', name: 'Resizing & cropping' },
          { route: 'ripple', name: 'Ripple' },
          { route: 'shadow', name: 'Shadow' },
          { route: 'toolbar', name: 'Toolbar' },
          { route: 'typography', name: 'Typography' },
        ]
      }
    ];
  }
}
