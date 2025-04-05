import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle,
  IonToolbar, IonInput,IonInputPasswordToggle, IonToast, IonButton } from '@ionic/angular/standalone';
import { BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonToast, IonToast, IonInput, IonInputPasswordToggle, IonContent, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  data: { email: string; password: string; } = {email:"",password:""}
  isToast = false;
  toastMessage!: string;
  isPwd = false;
  server = 'www.goitseonekau-webdev.com';
  errorLogin = ""
  loginForm!:NgForm
  constructor(private router:Router,private activeRoute:ActivatedRoute) { 
   
  }

  ngOnInit() {
    if(this.router.navigated){
      this.loginForm.resetForm()
    }
  }

  login(form:NgForm){
    if(form.control.get('password')?.hasError('pattern')||form.control.get('password')?.value=="" || form.control.get('email')?.value==""){
      form.control.markAllAsTouched()
      return
    }
    this.performBiometricVerification()
  }

  register(form:NgForm){
    if(form.control.get('password')?.hasError('pattern')||form.control.get('password')?.value=="" || form.control.get('email')?.value==""){
      form.control.markAllAsTouched()
      return
    }
    this.saveCredentials(this.data)
    this.openToast('Credentials Saved');
  }

  async performBiometricVerification() {
    try {
      const result = await NativeBiometric.isAvailable({ useFallback: true });
      if (!result.isAvailable) return;

      const isFingerPrint = result.biometryType == BiometryType.FINGERPRINT;
      console.log(isFingerPrint);

      const verified = await NativeBiometric.verifyIdentity({
        reason: 'Authentication',
        title: 'Log in',
        subtitle: 'FINGER PRINT',
        description: 'Your Finger Print needed for authorisation',
        useFallback: true,
        maxAttempts: 2,
      })
        .then(() => true)
        .catch(() => false);

      

      this.errorLogin =""
      if(verified && (await this.getCredentials()).password == this.data.password && (await this.getCredentials()).username == this.data.email){
        this.router.navigate(['home'])
      }
       else{
          this.errorLogin = "Failed to login. No such credentials"
          return
        };
      
    } catch (e) {
      console.log(e);
    }
  }

  async saveCredentials(data: { email: string; password: string }) {
    try {
      const result = await NativeBiometric.isAvailable();
      if (!result.isAvailable) return;
      // Save user's credentials
      await NativeBiometric.setCredentials({
        username: data.email,
        password: data.password,
        server: this.server,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getCredentials() {
    
      const credentials = await NativeBiometric.getCredentials({
        server: this.server,
      });
    
      return credentials
   
  }

  deleteCredentials() {
    // Delete user's credentials
    NativeBiometric.deleteCredentials({
      server: this.server,
    }).then(() => {
      this.openToast('Credentials deleted');
    });
  }

  openToast(msg: string) {
    this.isToast = true;
    this.toastMessage = msg;
  }

}
