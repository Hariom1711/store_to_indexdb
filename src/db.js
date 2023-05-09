import Dexie from 'dexie';

class MyDatabase extends Dexie {
  icons: Dexie.Table<{ name: string, dataUrl: string }, string>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      icons: 'name,dataUrl',
    });
    this.icons = this.table('icons');
  }
}

export const db = new MyDatabase();
