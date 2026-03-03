import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { DesignTokensPage } from './pages/DesignTokensPage';
import { DSDetailPage } from './pages/DSDetailPage';
import { CLIPage } from './pages/CLIPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'component/:id', Component: DSDetailPage },
      { path: 'design-system', Component: DesignSystemPage },
      { path: 'design-system/:type/:id', Component: DSDetailPage },
      { path: 'design-tokens', Component: DesignTokensPage },
      { path: 'cli', Component: CLIPage },
    ],
  },
]);