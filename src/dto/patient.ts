import {AbstractUser} from "./abstract-user";
import {WorkPlace} from "./work-place";
import {Relation} from "./relation";
import {Category} from "./category";

export class Patient extends AbstractUser {
  careHome: string;
  workPlaces: WorkPlace[] = [];
  relations: Relation[] = [];
  interests: Category[] = [];

  constructor(json?) {
    super(json);
    if (!json)
      return;
    this.careHome = json.carehome;
    if (json.workPlaces)
      json.workPlaces.forEach(workPlace => this.workPlaces.push(new WorkPlace(workPlace)));
    if (json.connections)
      json.connections.forEach(connection => this.relations.push(new Relation(connection)));
    if (json.interests)
      json.interests.forEach(category => this.interests.push(new Category(category)));
  }
}
