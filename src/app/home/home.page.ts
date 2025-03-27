import { SplashScreen } from '@capacitor/splash-screen';
import { Component, signal, ViewChild } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonIcon, IonItemOption, IonItemOptions, 
  IonItemSliding, IonItem, IonSelect, IonSelectOption, 
  IonLabel, IonText, IonList, IonListHeader, IonFabButton, 
  IonFab, IonInput, IonModal, IonButton, IonButtons, IonCard, 
  IonFooter, IonNote, IonAlert } from '@ionic/angular/standalone';
import { DatabaseService, employee } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import {  NgClass, NgFor,NgIf,TitleCasePipe } from '@angular/common';
import { IonModalCustomEvent, OverlayEventDetail } from '@ionic/core';
import { addIcons } from 'ionicons';
import { add, pencil, trash } from 'ionicons/icons';
import {  Observable, take } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonAlert,
    IonNote, IonFooter, IonCard, FormsModule, NgClass, NgFor, NgIf, TitleCasePipe,
    IonSelect, IonSelectOption, IonButtons, IonButton, IonModal,
    IonInput, IonFab, IonFabButton, IonListHeader, IonList,
    IonText, IonLabel, IonItem, IonItemSliding, IonItemOptions,
    IonItemOption, IonIcon, IonSearchbar, IonHeader, IonToolbar, IonTitle,
    IonContent],
})
export class HomePage {

  // get modal
  @ViewChild('addModal') addModal!: IonModal;

  //get alert
  @ViewChild('deleteAlert') deleteAlert!:IonAlert;

  employees = signal< employee[]>([])
  search_array = signal< employee[]>([])
  emp!: Observable<employee[]>
  delete_result ={delete:false}

  data: employee = {
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    salary: 0
  }

  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'confirm',
    },
  ];

  tempId:any



  constructor(private readonly db: DatabaseService,private readonly router:Router) {
    this.init()
    addIcons({ add, pencil, trash });
  }

  initStatus() {
    this.setBg()
  }

  async setBg() {
    await StatusBar.setBackgroundColor({ color: "green" })
    await StatusBar.setOverlaysWebView({ overlay: true })
    await StatusBar.setStyle({ style: Style.Dark });
  }


  init() {
    this.db.initializePlugin()
    // this.db.employeesObservable.subscribe((employees)=>{
    //   this.employees.set(employees)
    //   this.search_array.set(employees)
    // })

      this.employees = this.search_array = this.db.employees
     
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value ?? "";

    const filtered_employees = this.search_array()
    .filter(employee => 
      employee.name.toLowerCase().includes(query)||
      employee.department.toLowerCase().includes(query)||
      employee.employee_id!.toString().includes(query)
    )
    const new_list = query == "" ? this.search_array() : filtered_employees
    this.employees.update((value)=>value=new_list)
  }

  gotoDetails(id:number){
    this.router.navigate(["details",id]);
  }

  async createEmployee(emp: employee) {
    await this.db.addEmployee(emp)
  }

  async deleteEmp(employeeId: any) {
    this.deleteAlert.isOpen = true
    this.deleteAlert.onDidDismiss().then(
     async (v)=>{
        if(v.role == "confirm"){
          await this.db.deleteEmployee(employeeId)
          alert(" success")
          this.delete_result.delete = false
          this.deleteAlert.isOpen = false
        }
      }
    )
    
  }

  async dismissAlert(event: CustomEvent<OverlayEventDetail>){
    if(event.detail.role==='confirm'){
      this.deleteAlert.isOpen = false
      this.deleteAlert.dismiss()
    }
    if(event.detail.role==='cancel'){
      this.deleteAlert.dismiss()
    }
  }



  async onWillDismiss(event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    // add task if confirm button is clicked
    if (event.detail.role === 'confirm') {

      let new_employee = event.detail.data as employee
      new_employee.employee_id = Math.max(...this.employees().map((employee)=>employee.employee_id!))+1
      
      await this.createEmployee(new_employee)

      alert("insert success")
      this.data = {
        name: "",
        department: "",
        position: "",
        email: "",
        phone: "",
        salary: 0
      }
    }
  }

  //close modal
  cancel() {
    this.addModal.dismiss();
  }

  // confirm task in modal
  confirm() {
    this.addModal.dismiss(this.data, 'confirm');
  }


}


