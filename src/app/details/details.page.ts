import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, 
  IonNote, IonButtons, IonButton, 
  IonSelect, IonSelectOption, IonInput, IonIcon, IonAlert, IonCheckbox } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackSharp } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService, employee } from '../services/database.service';
import { OverlayEventDetail } from '@ionic/core';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonCheckbox, IonAlert, IonIcon,
    IonButton, IonButtons, IonNote, IonContent,
    IonHeader, IonToolbar,
    IonSelect, IonSelectOption, IonInput,
    CommonModule, FormsModule]
})
export class DetailsPage implements OnInit {
  
    //get alert
    @ViewChild('updateAlert') updateAlert!:IonAlert;

employee_details!:employee

alertButtons = [
  {
    text: 'OK',
    role: 'confirm',
  },
  {
    text: 'cancel',
    role: 'cancel',
  }
];


  constructor(
    private readonly router:Router,
    private readonly activeRoute:ActivatedRoute,
    private readonly db: DatabaseService) { }

  ngOnInit() {
    const id = this.activeRoute.snapshot.params['id']
    this.employee_details = this.db.employees().filter(emp=>emp.id==id)[0]
   
    
      addIcons({arrowBackSharp });
  }

  back(){
    this.router.navigate([''],{replaceUrl:true})
  }

    async editEmp(emp: employee) {
      await this.db.updateEmployeeStatus(emp)
      this.updateAlert.isOpen= true
    }

     dismissAlert(event: CustomEvent<OverlayEventDetail>){
        if(event.detail.role==='confirm'){
          this.router.navigate([''],{replaceUrl:true})
        }
        this.updateAlert.isOpen= false
        this.updateAlert.dismiss()
        
      }

}
