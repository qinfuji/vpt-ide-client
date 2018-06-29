import * as React from 'react';
import * as styles from './styles/Welcome.scss';

export default class WelcomePage extends React.Component {
  static propTypes = {};

  render() {
    return (
      <div className={styles['home-welcome-page']}>
        <div className={styles['content-container']}>
          <h2>Welcome to VPT-IDE!</h2>
        </div>
      </div>
    );
  }
}
