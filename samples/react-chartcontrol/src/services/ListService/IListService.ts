import { IListField } from "./IListField";
import { IListItem } from "./IListItem";

export interface IListService {
  getFields(listId: string): Promise<Array<IListField>>;
  getListItems(listId: string, labelField: string, xValueField: string, yValueField?: string, rValueField?: string): Promise<Array<IListItem>>;
}
