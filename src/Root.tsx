import * as React from 'react';
import { Provider } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import history from './common/history';
import { IRouter } from './common/routeConfig';

function renderRouteConfigV3(
  Container: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> | null,
  routes: IRouter[],
  contextPath = '/'
): JSX.Element {
  // Resolve route config object in React Router v3.
  const children: JSX.Element[] = []; // children component list

  const renderRoute = (item: IRouter, routeContextPath: string) => {
    let newContextPath: string;
    if (/^\//.test(item.path)) {
      newContextPath = item.path;
    } else {
      newContextPath = `${routeContextPath}/${item.path}`;
    }
    newContextPath = newContextPath.replace(/\/+/g, '/');

    if (item.component && item.childRoutes) {
      children.push(renderRouteConfigV3(item.component, item.childRoutes, newContextPath));
    } else if (item.component) {
      children.push(<Route component={item.component} exact key={newContextPath} path={newContextPath} />);
    } else if (item.childRoutes) {
      item.childRoutes.forEach(r => renderRoute(r, newContextPath));
    }
  };

  routes.forEach(item => renderRoute(item, contextPath));

  // Use Switch as the default container by default
  if (!Container) return <Switch>{children}</Switch>;

  return (
    <Container key={contextPath}>
      <Switch>{children}</Switch>
    </Container>
  );
}

export interface IRootProps {
  routeConfig: IRouter[];
  store: any;
}

export default class Root extends React.Component<IRootProps> {
  render() {
    const children = renderRouteConfigV3(null, this.props.routeConfig, '/');
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={history}>{children}</ConnectedRouter>
      </Provider>
    );
  }
}
