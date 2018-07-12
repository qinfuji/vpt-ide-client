import { Dir, Dest } from './types';

export function dirToDest(dir: Dir, bottom: boolean, collapsed: boolean, hasChildren: boolean): Dest | null {
  if (dir === 'down') {
    if (bottom || collapsed || !hasChildren) {
      return 'nextSibling';
    }
    return 'firstChild';
  }

  if (dir === 'up') {
    if (!bottom || collapsed || !hasChildren) {
      return 'prevSibling';
    }
    return 'lastChild';
  }

  if (dir === 'left') {
    if (!collapsed && hasChildren) {
      return bottom ? 'selectTop' : 'collapse';
    }
    return 'parent';
  }

  if (dir === 'right') {
    if (collapsed && hasChildren) {
      return 'uncollapse';
    }
    if (hasChildren) {
      if (bottom) {
        return null;
      } else {
        return 'firstChild';
      }
    }
  }

  return null;
}
