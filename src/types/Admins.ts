import { FirestoraDoc, FirestoreProperty } from '../libs/firebase/libs';

@FirestoraDoc('admins')
export class Admin {
  @FirestoreProperty('id')
  id?: string;
}
