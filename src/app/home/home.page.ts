import { SplashScreen } from '@capacitor/splash-screen';
import { Component, computed, signal, ViewChild } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonIcon, IonItemOption, IonItemOptions, 
  IonItemSliding, IonItem, IonSelect, IonSelectOption, 
  IonLabel, IonText, IonList, IonListHeader, IonFabButton, 
  IonFab, IonInput, IonModal, IonButton, IonButtons, IonCard, 
  IonFooter, IonNote, IonAlert,IonMenu,IonMenuButton } from '@ionic/angular/standalone';
import { DatabaseService, employee } from '../services/database.service';
import { FormsModule, NgModel } from '@angular/forms';
import {  NgClass, NgFor,NgIf,TitleCasePipe } from '@angular/common';
import { IonModalCustomEvent, OverlayEventDetail } from '@ionic/core';
import { addIcons } from 'ionicons';
import { add, pencil, trash } from 'ionicons/icons';
import {  Observable, take, takeWhile } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonAlert,IonMenu,IonMenuButton,
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

  // employees:employee[] = []
  // search_array:employee[] = []
  employeeObservable =new Observable<employee[]>()
  employees = signal<employee[]>([])
  search = signal<string>("")
  search_array1 = computed(()=>{

    const filtered_employees = this.employees()
    .filter(employee => 
      employee.name.toLowerCase().includes(this.search())||
      employee.department.toLowerCase().includes(this.search())||
      employee.employee_id!.toString().includes(this.search())
    )
    const new_list = this.search() == "" ? this.employees() : filtered_employees
    return new_list
  })

  data: employee = {
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    salary: null
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

  filterOptions = signal("")


  constructor(private readonly db: DatabaseService,private readonly router:Router) {
    SplashScreen.hide()  
   
    // this.employees.set(this.db.employees())
    addIcons({ add, pencil, trash });
  }

  ngOnInit(){
    this.db.employees$
    .subscribe((employees)=>this.employees.set(employees))  
  }


  async init() {
    await this.db.initializePlugin()
    SplashScreen.hide()  
    this.db.employees$
    .subscribe((employees)=>this.employees.set(employees))
  }

  logout(){
    this.router.navigate([''])
  }

  onChange(e:any){

  }



  onSearchChange(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value ?? "";
    this.search.set(query)
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
     async (eventDetail)=>{
        if(eventDetail.role == "confirm"){
          await this.db.deleteEmployee(employeeId)
          alert(" success")
          this.deleteAlert.isOpen = false
        }
      }
    )
    
  }

  async dismissAlert(event: CustomEvent<OverlayEventDetail>){
    if(event.detail.role==='cancel'){
      this.deleteAlert.isOpen = false
      this.deleteAlert.dismiss()
    }
  }



  async onWillDismiss(event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    // add task if confirm button is clicked
    if (event.detail.role === 'confirm') {

      let new_employee = event.detail.data as employee
      new_employee.employee_id = this.employees().length==0? 10110 : Math.max(...this.employees().map((employee)=>employee.employee_id!))+1
      
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

    this.addModal.dismiss();
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


