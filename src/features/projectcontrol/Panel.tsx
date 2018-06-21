import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as styles from './styles/Panel.scss';

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
  title: string;
  toolbtns?: IPanelToolButton[];
  showContent?: boolean;
}

class Panel extends React.Component<IPanelProps> {
  render() {
    let { icon, title, toolbtns, showContent = true } = this.props;
    return (
      <div className={styles.root}>
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
        <div className={styles.content}>{showContent && this.props.children}</div>
      </div>
    );
  }
}

export default Panel;
