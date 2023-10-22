import { Component } from '@angular/core';
import { IndexedDbService } from 'src/app/@Service/indexed-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private dbService: IndexedDbService) {}
  data: any;
  row = {
    id: 0,
    name: '',
    email: '',
  } as any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listContacts();
  }

  addContact(row: any) {
    this.dbService
      .addContact(row)
      ?.then(() => {
        this.listContacts();
      })
      .catch((error) => {
        console.error('Error adding contact', error);
      });
  }

  listContacts() {
    this.dbService
      .getContactList()
      .then((contact) => {
        // console.log(contact);
        this.data = contact;
      })
      .catch((error) => {
        console.error('Error getting contact', error);
      });
  }

  getContact() {
    this.dbService
      .getContact(2)
      .then((contact) => {
        console.log(contact);
      })
      .catch((error) => {
        console.error('Error getting contact', error);
      });
  }

  deleteContact(row: any) {
    let id = row.id;
    this.dbService
      .deleteContact(id)
      .then(() => {
        this.listContacts();
      })
      .catch((error) => {
        console.error('Error deleting contact', error);
      });
  }

  updateContact(row: any) {
    this.dbService
      .updateContact(row)
      .then(() => {
        this.listContacts();
      })
      .catch((error) => {
        console.error('Error deleting contact', error);
      });
  }

  saveContact() {
    if (this.row.id == 0) {
      this.addContact(this.row);
    } else {
      this.updateContact(this.row);
    }
    this.row = {
      id: 0,
      name: '',
      email: '',
    };
  }

  onClickUpdate(row:any){
    console.log(row);
    this.row = {
      id: row.id,
      name: row.name,
      email: row.email,
    };
  }
}
