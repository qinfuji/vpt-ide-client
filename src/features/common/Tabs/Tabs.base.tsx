import * as React from 'react';
import { TooltipHost, TooltipDelay } from 'office-ui-fabric-react/lib/Tooltip';
import { DirectionalHint } from 'office-ui-fabric-react/lib/common/DirectionalHint';
import * as styles from './tabs.scss';
import {
  BaseComponent,
  divProperties,
  getNativeProps,
  customizable,
  classNamesFunction
} from 'office-ui-fabric-react/lib/Utilities';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFile } from '@fortawesome/free-solid-svg-icons';

import { ITabsProps, ITabsStyleProps, ITabsStyles, ITabItem } from './Tabs.types';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
const getClassNames = classNamesFunction<ITabsStyleProps, ITabsStyles>();
const stylesImport = styles;

@customizable('Tabs', ['theme'])
export class TabsBase extends BaseComponent<ITabsProps, {}> {
  private _renderItem(item: ITabItem, index: number, isActiveTab: boolean): JSX.Element {
    const { mode } = this.props;
    let icon = mode.icon(item);
    let name = mode.name(item);
    let tooltip = mode.tooltip(item);
    let canClose = mode.canClose(item);

    return (
      <li
        key={index}
        className={stylesImport.tabs + ' ' + (isActiveTab ? stylesImport['is-active'] : '') + ' is-boxed'}
        onClick={isActiveTab ? null : this._onTabChange.bind(this, item, index)}
      >
        <TooltipHost
          calloutProps={{
            directionalHint: DirectionalHint.bottomLeftEdge,
            isBeakVisible: false
          }}
          content={tooltip || ''}
          delay={TooltipDelay.long}
        >
          <a>
            {icon && <Icon iconName={icon} />}
            <span>{name}</span>
            {canClose && (
              // <FontAwesomeIcon icon="stroopwafel" />
              <Icon
                iconName="Clear"
                onClick={this._onCloseHandle.bind(this, item, index)}
                style={{
                  fontSize: '9px',
                  fontWeight: 'bold',
                  marginLeft: '12px',
                  height: '9px',
                  width: '9px',
                  lineHeight: '9px'
                }}
              />
            )}
          </a>
        </TooltipHost>
      </li>
    );
  }

  private _onCloseHandle(item: ITabItem, index: number, ev: React.MouseEvent<{}>) {
    const { onTabClosed } = this.props;
    if (onTabClosed) {
      onTabClosed(item, index);
    }
    ev.preventDefault();
    ev.stopPropagation();
  }

  private _onTabChange(item: ITabItem, index: number, ev: React.MouseEvent<{}>) {
    const { onTabChanged } = this.props;
    if (onTabChanged) {
      onTabChanged(item, index);
    }
    ev.preventDefault();
    ev.stopPropagation();
  }

  public render(): JSX.Element {
    const { className, theme, styles, items, activeTab, mode } = this.props;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className: className
    });

    return (
      <div className={classNames.root + ' ' + stylesImport.tabs + ' ' + stylesImport['is-boxed']}>
        <ul>
          {items &&
            items.map((item, index) => {
              let isActive = false;
              if (!activeTab && index === 0) {
                isActive = true;
              } else if (activeTab) {
                isActive = mode.id(activeTab) === mode.id(item);
              }
              return this._renderItem(item, index, isActive);
            })}
        </ul>
      </div>
    );
  }
}
