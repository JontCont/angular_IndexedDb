import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDatabase();
  }
  private async connectDataBase(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('MyDatabase', 1);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const objectStoreNames = db.objectStoreNames;
        console.log(objectStoreNames);
        resolve(db);
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }

  private initDatabase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('MyDatabase', 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        // 创建数据表
        const contactsStore = db.createObjectStore('contacts', {
          keyPath: 'id',
          autoIncrement: true,
        });
        // 定义数据表的索引
        contactsStore.createIndex('name', 'name', { unique: false });
        contactsStore.createIndex('email', 'email', { unique: true });
        console.log('数据库升级成功');
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        console.log('数据库打开成功');
        resolve();
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }

  async getContactList(): Promise<any> {
    await this.connectDataBase();

    if (!this.db) {
      throw new Error('Database is not initialized.');
    }

    const transaction = this.db.transaction(['contacts'], 'readonly');
    const store = transaction.objectStore('contacts');

    return new Promise<void>((resolve, reject) => {
      const getRequest = store.getAll();
      getRequest.onsuccess = (event: any) => {
        const contact = event.target.result;
        resolve(contact);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getContact(id: number): Promise<any> {
    await this.connectDataBase();

    if (!this.db) {
      throw new Error('Database is not initialized.');
    }

    const transaction = this.db.transaction(['contacts'], 'readonly');
    const store = transaction.objectStore('contacts');

    return new Promise<void>((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = (event: any) => {
        const contact = event.target.result;
        resolve(contact);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async addContact(contact: any): Promise<void> {
    await this.connectDataBase();

    if (!this.db) {
      throw new Error('Database is not initialized.');
    }

    const transaction = this.db.transaction(['contacts'], 'readwrite');
    const store = transaction.objectStore('contacts');

    return new Promise<void>((resolve, reject) => {
      const addRequest = store.add(contact);
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);
    });
  }

  async updateContact(contact: any): Promise<void> {
    await this.connectDataBase();

    if (!this.db) {
      throw new Error('Database is not initialized.');
    }

    const transaction = this.db.transaction(['contacts'], 'readwrite');
    const store = transaction.objectStore('contacts');

    return new Promise<void>((resolve, reject) => {
      const updateRequest = store.put(contact);
      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    });
  }

  async deleteContact(id: number): Promise<void> {
    await this.connectDataBase();

    if (!this.db) {
      throw new Error('Database is not initialized.');
    }

    const transaction = this.db.transaction(['contacts'], 'readwrite');
    const store = transaction.objectStore('contacts');

    return new Promise<void>((resolve, reject) => {
      const deleteRequest = store.delete(id);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
  }

}
