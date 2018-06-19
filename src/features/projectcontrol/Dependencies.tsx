import * as React from 'react';
import { IDependency } from '../../common/types';
export interface IDependenciseProps {
  items: IDependency[];
}

class Dependencise extends React.Component<IDependenciseProps> {
  render() {
    return <div>Dependencise</div>;
  }
}

export default Dependencise;
