import { FirestoreDoc, FirestoreProperty } from '../libs/firebase/libs';

@FirestoreDoc('Admins')
export class Admin {
  @FirestoreProperty('id')
  id?: string;
}
