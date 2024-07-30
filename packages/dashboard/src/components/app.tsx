import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import 'react-grid-layout/css/styles.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, PrivateRoute } from 'rmf-auth';
import { AppConfigContext, AuthenticatorContext, ResourcesContext } from '../app-config';
import { DashboardRoute, LoginRoute, RobotsRoute, TasksRoute } from '../util/url';
import { AppBase } from './app-base';
import { SettingsContext } from './app-contexts';
import { AppEvents } from './app-events';
import './app.css';
import { dashboardWorkspace } from './dashboard';
import { RmfApp } from './rmf-app';
import { robotsWorkspace } from './robots/robots-workspace';
import { tasksWorkspace } from './tasks/tasks-workspace';
import { Workspace } from './workspace';

export default function App(): JSX.Element | null {
  const authenticator = React.useContext(AuthenticatorContext);
  const [authInitialized, setAuthInitialized] = React.useState(!!authenticator.user);
  const [user, setUser] = React.useState<string | null>(authenticator.user || null);

  React.useEffect(() => {
    let cancel = false;
    const onUserChanged = (newUser: string | null) => {
      setUser(newUser);
      AppEvents.justLoggedIn.next(true);
    };
    authenticator.on('userChanged', onUserChanged);
    (async () => {
      await authenticator.init();
      if (cancel) {
        return;
      }
      setUser(authenticator.user || null);
      setAuthInitialized(true);
    })();
    return () => {
      cancel = true;
      authenticator.off('userChanged', onUserChanged);
    };
  }, [authenticator]);

  const appConfig = React.useContext(AppConfigContext);
  const settings = React.useContext(SettingsContext);
  const resources = appConfig.resources[settings.themeMode] || appConfig.resources.default;

  const loginRedirect = React.useMemo(() => <Navigate to={LoginRoute} />, []);

  return authInitialized ? (
    <ResourcesContext.Provider value={resources}>
      {user ? (
        <RmfApp>
          <AppBase>
            <Routes>
              <Route path={LoginRoute} element={<Navigate to={DashboardRoute} />} />

              <Route
                path={DashboardRoute}
                element={
                  <PrivateRoute unauthorizedComponent={loginRedirect} user={user}>
                    <Workspace key="dashboard" state={dashboardWorkspace} />
                  </PrivateRoute>
                }
              />

              <Route
                path={RobotsRoute}
                element={
                  <PrivateRoute unauthorizedComponent={loginRedirect} user={user}>
                    <Workspace key="robots" state={robotsWorkspace} />
                  </PrivateRoute>
                }
              />

              <Route
                path={TasksRoute}
                element={
                  <PrivateRoute unauthorizedComponent={loginRedirect} user={user}>
                    <Workspace key="tasks" state={tasksWorkspace} />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AppBase>
        </RmfApp>
      ) : (
        <Routes>
          <Route
            path={LoginRoute}
            element={
              <LoginPage
                title={'Dashboard'}
                logo="assets/defaultLogo.png"
                onLoginClick={() =>
                  authenticator.login(`${window.location.origin}${DashboardRoute}`)
                }
              />
            }
          />
          <Route path="*" element={<Navigate to={LoginRoute} />} />
        </Routes>
      )}
    </ResourcesContext.Provider>
  ) : null;
}
