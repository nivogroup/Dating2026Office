import { Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from '../../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // this is for the parents to child communication in this case Home to register
  //membersFromHome = input.required<User[]>();
  private accountService = inject(AccountService);
  private router = inject(Router);
  // this is for the child to parents communication in this case register to home
  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;

  // For The Form Builder
  private fb = inject(FormBuilder);
  // For the register form extension
  protected credentialsFrom: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);

  constructor() {
    this.credentialsFrom = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.credentialsFrom.controls['password'].valueChanges.subscribe(() => {
      this.credentialsFrom.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }

  nextStep() {
    if (this.credentialsFrom.valid) {
      this.currentStep.update((prevStep) => prevStep + 1);
    }
  }

  prevStep() {
    this.currentStep.update((prevStep) => prevStep - 1);
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {
    if (this.credentialsFrom.valid && this.profileForm.valid) {
      const formData = { ...this.credentialsFrom.value, ...this.profileForm.value };
      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members')
        },
        error: (error) => {
          console.log(error);
          this.validationErrors.set(error);
        }
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
