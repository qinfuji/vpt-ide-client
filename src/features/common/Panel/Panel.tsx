import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as styles from './Panel.scss';

export interface IPanelToolButton {
  icon: string;
  key: string;
  onClick?: (key: string) => void;
}

export interface IPanelState {
  showContent: boolean;
}

export interface IPanelProps {
  icon?: string;
  title?: string;
  toolbtns?: IPanelToolButton[];
  showContent?: boolean;
}

export class Panel extends React.Component<IPanelProps> {
  render() {
    let { showContent = true } = this.props;
    return (
      <div className={styles.root}>
        {this._panHead()}
        <div className={styles.content}>{showContent && this.props.children}</div>
      </div>
    );
  }

  private _panHead(): React.ReactNode | null {
    let { icon, title, toolbtns } = this.props;
    if (title) {
      return (
        <div className={styles.head}>
          <div className={styles.title}>
            {icon ? <Icon iconName={icon} /> : <Icon iconName="CaretHollow" />}
            {title}
          </div>
          <div className={styles.toolbar}>
            {toolbtns &&
              toolbtns.map(toolbtn => {
                return (
                  <Icon
                    className={styles.toolbarIcon}
                    key={toolbtn.key}
                    iconName={toolbtn.icon}
                    onClick={() => {
                      toolbtn.onClick && toolbtn.onClick(toolbtn.key);
                    }}
                  />
                );
              })}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
