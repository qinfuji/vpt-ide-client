import { ITreeMode, ITreeItem } from '../common/tree/Tree.types';
import { IFile } from '../../common/types';

export interface IFsTreeItem extends ITreeItem, IFile {}

export class FsTreeMode implements ITreeMode<IFsTreeItem> {
  private _items: IFsTreeItem[];

  setItems(items: IFsTreeItem[]) {
    this._items = items; ///items;
  }

  isLeaf(item: IFsTreeItem) {
    return item.isLeaf;
  }

  getItemIndex(item: IFsTreeItem): number {
    return this._items!.indexOf(item);
  }

  getItem(index: number): IFsTreeItem {
    return this._items[index];
  }
  getRoot(): IFsTreeItem[] {
    return this._items.filter(function(item, index) {
      return item.parent == null || item.parent === undefined;
    });
  }
  getChild(parent: IFsTreeItem): IFsTreeItem[] {
    return this._items.filter(function(item, index) {
      return item.parent === parent.path;
    });
  }
  isExpanded(ITreeItem: IFsTreeItem): boolean {
    return false;
  }

  getId(item: IFsTreeItem): string | number {
    return item.path;
  }

  getParent(item: IFsTreeItem): IFsTreeItem | null {
    for (let index = 0; index < this._items.length; index++) {
      const element = this._items[index];
      if (element.path === item.parent) {
        return element;
      }
    }
    return null;
  }
}
