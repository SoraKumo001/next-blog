import { FirestoraDoc, FirestoreProperty } from '../libs/firebase/libs';

@FirestoraDoc('Application')
export class Application {
  @FirestoreProperty('id')
  id?: string;
  @FirestoreProperty('string')
  title!: string;
  @FirestoreProperty('string')
  description!: string;
  @FirestoreProperty('boolean')
  directStorage!: boolean;
  @FirestoreProperty('string')
  cardUrl?: string;
}
