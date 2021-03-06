import * as React from 'react';
import App from '../features/app/App';
import Welcome from '../features/app/Welcome';
import { PageNotFound } from '../features/common/PageNotFound';
import { PageControl } from '../features/pagecontrol';
import { RouteComponentProps } from 'react-router-dom';
export interface IRouter {
  path: string;
  name?: string;
  isIndex?: boolean;
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  childRoutes?: IRouter[];
}

const routes: IRouter[] = [
  {
    path: '/',
    component: App,
    childRoutes: [
      { path: '/project/:projectId/file/:path/:type', name: 'edit file', component: PageControl },
      { path: '/welcome', name: 'welcome', component: Welcome },
      { path: '*', name: 'Page not found', component: PageNotFound }
    ].filter((r: IRouter) => r.component || (r.childRoutes && r.childRoutes.length > 0))
  }
];

function handleIndexRoute(route: IRouter) {
  if (!route.childRoutes || !route.childRoutes.length) {
    return;
  }

  const indexRoute = route.childRoutes.find((child: IRouter): boolean => !!child.isIndex);
  if (indexRoute) {
    const first = { ...indexRoute };
    first.path = route.path;
    route.childRoutes.unshift(first);
  }
  route.childRoutes.forEach(handleIndexRoute);
}

routes.forEach(handleIndexRoute);

export default routes;
