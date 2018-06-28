import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { showme as openProjectSelector } from '../selectproject/redux/actions';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

const noop = () => {};

export interface ITopMenuProps {
  actions: any;
}

class TopMenu extends React.Component<ITopMenuProps> {
  state = {
    current: 'mail'
  };

  getMenuData() {
    let { openProjectSelector } = this.props.actions;
    return [
      {
        key: 'file',
        name: '文件',
        cacheKey: 'fileCacheKey',
        subMenuProps: {
          items: [
            {
              key: 'create-project',
              name: '创建项目',
              iconProps: { iconName: 'ProjectLogo32' },
              onClick: noop
            },
            {
              key: 'open-project',
              name: '打开项目',
              iconProps: { iconName: 'FabricOpenFolderHorizontal' },
              onClick: openProjectSelector.bind(this, true)
            },
            {
              key: 'close-project',
              name: '关闭项目',
              onClick: noop
            },
            {
              key: 'divider_1',
              itemType: ContextualMenuItemType.Divider
            },

            {
              key: 'project-setting',
              name: '项目设置',
              iconProps: { iconName: 'Settings' },
              onClick: noop
            },
            {
              key: 'project-structure',
              name: '项目结构',
              onClick: noop
            },

            {
              key: 'project-export',
              iconProps: { iconName: 'Download' },
              name: '导出项目',
              onClick: noop
            }
          ]
        }
      }
    ];
  }

  render() {
    let menuData = this.getMenuData();
    return <CommandBar items={menuData} styles={{ root: { height: '30px', paddingTop: '2px' } }} />;
  }
}

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators({ openProjectSelector }, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopMenu);
