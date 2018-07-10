import * as PropTypes from 'prop-types';
import * as React from 'react';
import { PropVal } from './PropVal';
import { getInvertedMid } from './themes/utils';
import { Theme } from './types';

type PropsProps = {
  props: any;
  inverted: boolean;
};

class Props extends React.Component<PropsProps> {
  static contextTypes = {
    theme: PropTypes.object.isRequired
  };

  context: {
    theme: Theme;
  };

  shouldComponentUpdate(nextProps: PropsProps): boolean {
    return nextProps.props !== this.props.props || nextProps.inverted !== this.props.inverted;
  }

  render() {
    var theme = this.context.theme;
    var { inverted, props } = this.props;
    if (!props || typeof props !== 'object') {
      return <span />;
    }

    var names = Object.keys(props).filter(name => {
      return name[0] !== '_' && name !== 'children';
    });

    var items = [] as any[];

    names.slice(0, 3).forEach(name => {
      items.push(
        <span key={'prop-' + name} style={propStype(inverted, theme)}>
          <span style={attributeNameStyle(inverted, theme)}>{name}</span>
          =
          <PropVal val={props[name]} inverted={inverted} />
        </span>
      );
    });

    if (names.length > 3) {
      items.push(
        <span key="ellipsis" style={ellipsisStyle(inverted, theme)}>
          …
        </span>
      );
    }
    return <span>{items}</span>;
  }
}

const attributeNameStyle = (isInverted: boolean, theme: Theme): React.CSSProperties => ({
  color: isInverted ? getInvertedMid(theme.state02) : theme.special06
});

const ellipsisStyle = (isInverted: boolean, theme: Theme): React.CSSProperties => ({
  color: isInverted ? getInvertedMid(theme.state02) : theme.special06
});

const propStype = (isInverted: boolean, theme: Theme): React.CSSProperties => ({
  paddingLeft: 5,
  color: isInverted ? getInvertedMid(theme.state02) : theme.special06
});

export { Props };
