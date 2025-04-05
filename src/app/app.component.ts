import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import { StatusBar,Animation,Style ,BackgroundColorOptions} from '@capacitor/status-bar';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [ IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {

  }

  ngOnInit(){
    this.initStatus()
  }

  initStatus(){
    this.setBg()
  }

  async setBg(){
    //Display statusbar above app
      await StatusBar.setOverlaysWebView({overlay:false})
      //SET color of status bar i.e Dark=white text,LIGHT=black text
      await StatusBar.setStyle({ style: Style.Dark });
      //set mobile status bar background color
      await StatusBar.setBackgroundColor({color:"#0163aa"});
      await StatusBar.show()
  }
}
