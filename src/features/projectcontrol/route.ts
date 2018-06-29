import { PageControl } from '../pagecontrol';
import Welcome from '../app/Welcome';
import { ProjectControl } from './';

export default {
  path: '/project',
  name: 'Project',
  component: ProjectControl as any,
  childRoutes: [{ path: 'file/:path/:type', component: PageControl }, { path: 'welcome', component: Welcome }]
};
