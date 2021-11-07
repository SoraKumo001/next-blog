import { FirestoraDoc, FirestoreProperty } from '../libs/firebase/libs';

@FirestoraDoc('Content')
export class Content {
  @FirestoreProperty('id')
  id?: string;
  @FirestoreProperty('string')
  title!: string;
  @FirestoreProperty('boolean')
  visible!: boolean;
  @FirestoreProperty('array')
  keywords!: string[];
  @FirestoreProperty('created')
  createdAt?: Date;
  @FirestoreProperty('updated')
  updatedAt?: Date;
}
@FirestoraDoc('ContentBody')
export class ContentBody {
  @FirestoreProperty('id')
  id?: string;
  @FirestoreProperty('string')
  body?: string;
}
