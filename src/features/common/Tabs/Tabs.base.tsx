import * as React from 'react';
import * as styles from './tabs.scss';
import {
  BaseComponent,
  divProperties,
  getNativeProps,
  customizable,
  classNamesFunction
} from 'office-ui-fabric-react/lib/Utilities';

import { ITabsProps, ITabsStyleProps, ITabsStyles } from './Tabs.types';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
const getClassNames = classNamesFunction<ITabsStyleProps, ITabsStyles>();
const stylesImport = styles;

@customizable('Tabs', ['theme'])
export class TabsBase extends BaseComponent<ITabsProps, {}> {
  public render(): JSX.Element {
    const { className, theme, styles } = this.props;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className: className
    });

    return (
      <div className={classNames.root + ' ' + stylesImport.tabs + ' ' + stylesImport['is-boxed']}>
        <ul>
          <li className={stylesImport.tabs + ' ' + stylesImport['is-active']}>
            <a>
              <span className="icon is-small">
                <i className="fas fa-image" aria-hidden="true" />
              </span>
              <span>Pictures</span>
              <Icon iconName="ChromeClose" />
            </a>
          </li>
          <li>
            <a>
              <span className="icon is-small">
                <i className="fas fa-music" aria-hidden="true" />
              </span>
              <span>Music</span>
              <Icon iconName="ChromeClose" />
            </a>
          </li>
          <li>
            <a>
              <span className="icon is-small">
                <i className="fas fa-film" aria-hidden="true" />
              </span>
              <span>Videos</span>
              <Icon iconName="ChromeClose" />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
