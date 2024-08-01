import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/core/models/contact.model';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-portal-contact-messages',
  templateUrl: './contact-messages.component.html',
  styleUrls: ['./contact-messages.component.scss'],
})
export class ContactMessagesComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt: Table | undefined;

  contactMessages: Contact[] = [];
  filteredContactMessages: Contact[] = [];
  numberOfCols = 6;
  isLoading = false;
  selectedItem: Contact;
  selectedItems: Contact[];
  statusOptions = [
    { name: 'Văzut', code: 'true' },
    { name: 'Nevăzut', code: 'false' },
  ];

  subscription: Subscription = null;
  isDialogVisible = false;

  constructor(
    private contactService: ContactService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription = this.contactService.getContactMessage().subscribe({
      next: (c) => {
        this.contactMessages = c;
        this.filteredContactMessages = c;
        this.isLoading = false;
      },
    });
  }

  filterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  filterGlobalStatus($event) {
    if ($event.value) {
      this.filteredContactMessages = this.contactMessages.filter(m => m.viewed === $event.value.code)
    } else {
      this.filteredContactMessages = [...this.contactMessages];
    }
  }

  editItem(item: Contact) {
    this.isDialogVisible = true;
    this.selectedItem = item;
  }

  viewItem() {
    this.selectedItem.viewed = 'true';
    this.contactService.updateContactMessages(this.selectedItem, this.selectedItem.id).subscribe({
      next: (v: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Starea a fost actualizată.',
          life: 3000,
        });
        this.isDialogVisible = false;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Eroare',
          detail: e.error.error,
          life: 3000,
        });
      },
    });
  }

  deleteItem(item: Contact) {
    this.confirmationService.confirm({
      message: 'Sunteți sigur că doriți să ștergeți acest mesaj?',
      accept: () => {
        this.contactService.deleteContactMessage(item.id).subscribe({
          next: (v: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: v.success,
              life: 3000,
            });
            this.contactMessages = this.contactMessages.filter(
              m => m.id !== item.id
            );
            this.filteredContactMessages = [...this.contactMessages];
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Eroare',
              detail: e.error.error,
              life: 3000,
            });
          },
        });
      },
    });
  }

  deleteItems() {
    this.confirmationService.confirm({
      message: `Sunteți sigur că doriți să ștergeți mesajele selectate? (${this.selectedItems.length} mesaje)`,
      accept: () => {
        const messagesToDelete = {ids: []};

        this.selectedItems.forEach(m => {
          messagesToDelete.ids.push(m.id);
        })

        this.contactService.deleteContactMessages(messagesToDelete).subscribe({
          next: (v: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: v.success,
              life: 3000,
            });
            this.contactMessages = this.contactMessages.filter(
              m => !messagesToDelete.ids.includes(m.id)
            );
            this.filteredContactMessages = [...this.contactMessages];
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Eroare',
              detail: e.error.error,
              life: 3000,
            });
          },
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
