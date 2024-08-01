import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Contact } from 'src/app/core/models/contact.model';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private router: Router, private messageService: MessageService, private contactService: ContactService) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.contactForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(48)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(52)]),
      message: new FormControl(null, [Validators.required, Validators.maxLength(320)])
    });
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }

 
  onSubmit() {
    console.log(this.contactForm);
    
    if (!this.contactForm.valid) {
      this.name.markAsTouched();
      this.email.markAsTouched();
      this.message.markAsTouched();

      return;
    }

    const contactInfo: Contact = this.contactForm.value;

    this.contactForm.disable();

    this.contactService.postContactMessage(contactInfo).subscribe({
      next: (v: any) => {
        this.contactForm.reset();
        this.contactForm.enable();
        this.messageService.add({ severity: 'success', summary: "Succes", detail: v.success, life: 5000 });
      },
      error: (e) => {
        this.contactForm.reset();
        this.contactForm.enable();
        this.messageService.add({ severity: 'error', summary: "Eroare", detail: e.error.error, life: 5000 });
        }
  });
  }

  onNavigate() {
    this.router.navigate(['/programari']);
  }
}
