import { Component } from '@angular/core';

import { Config, PopoverController } from '@ionic/angular';

import { PopoverPage } from '../about-popover/about-popover';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage {
  location = 'CampoGrande';

  ios: boolean;

  constructor(public popoverCtrl: PopoverController, public config: Config) { }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event
    });
    this.ios = this.config.get('mode') === 'ios';
    await popover.present();
  }
}
