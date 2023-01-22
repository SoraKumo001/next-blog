import { FirestoreDoc, FirestoreProperty } from '../libs/firebase/libs';

@FirestoreDoc('Content')
export class Content {
  @FirestoreProperty('id')
  id?: string;
  @FirestoreProperty('string')
  title!: string;
  @FirestoreProperty('boolean')
  visible!: boolean;
  @FirestoreProperty('boolean')
  system!: boolean;
  @FirestoreProperty('array')
  keywords!: string[];
  @FirestoreProperty('created')
  createdAt?: Date;
  @FirestoreProperty('updated')
  updatedAt?: Date;
}
@FirestoreDoc('ContentBody')
export class ContentBody {
  @FirestoreProperty('id')
  id?: string;
  @FirestoreProperty('string')
  body?: string;
}
