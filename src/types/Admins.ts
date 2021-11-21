import { FirestoraDoc, FirestoreProperty } from '../libs/firebase/libs';

@FirestoraDoc('Admins')
export class Admin {
  @FirestoreProperty('id')
  id?: string;
}
