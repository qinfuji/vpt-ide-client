import { ITreeMode, ITreeItem } from './Tree.types';

export interface IFlatTreeItem extends ITreeItem {
  parentId: string | null;
  name: string;
  id: string;
  isExpanded?: boolean;
  isLeaf: boolean;
}

export class DefaultTreeMode implements ITreeMode<IFlatTreeItem> {
  private _items: IFlatTreeItem[];

  setItems(items: IFlatTreeItem[]) {
    this._items = items; ///items;
  }

  isLeaf(item: IFlatTreeItem) {
    return item.isLeaf;
  }

  getItemIndex(item: IFlatTreeItem): number {
    return this._items!.indexOf(item);
  }

  getItem(index: number): IFlatTreeItem {
    return this._items[index];
  }
  getRoot(): IFlatTreeItem[] {
    return this._items.filter(function(item, index) {
      return item.parentId == null || item.parentId === undefined;
    });
  }
  getChild(parent: IFlatTreeItem): IFlatTreeItem[] {
    return this._items.filter(function(item, index) {
      return item.parentId === parent.id;
    });
  }
  isExpanded(ITreeItem: IFlatTreeItem): boolean {
    return true;
  }

  getId(item: IFlatTreeItem): string | number {
    return item.id;
  }
}
