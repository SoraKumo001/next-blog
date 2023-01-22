import { FirestoreDoc, FirestoreProperty } from '../libs/firebase/libs';

@FirestoreDoc('Application')
export class Application {
  @FirestoreProperty('id')
  id?: string;
  @FirestoreProperty('string')
  title!: string;
  @FirestoreProperty('string')
  host!: string;
  @FirestoreProperty('string')
  description!: string;
  @FirestoreProperty('boolean')
  directStorage!: boolean;
  @FirestoreProperty('string')
  cardUrl?: string;
}
