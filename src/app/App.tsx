import { Component, type ReactNode } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './components/ThemeProvider';

/* —— Error Boundary to catch and display runtime errors —— */
interface EBState { error: Error | null; info: string }

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null, info: '' };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    this.setState({ info: info.componentStack || '' });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 32,
          fontFamily: 'ui-monospace, monospace',
          background: '#09090b',
          color: '#f87171',
          height: '100vh',
          overflow: 'auto',
        }}>
          <div style={{ fontSize: 20, marginBottom: 16, color: '#fbbf24' }}>
            Runtime Error Caught
          </div>
          <div style={{ fontSize: 14, marginBottom: 12, color: '#f87171' }}>
            {this.state.error.message}
          </div>
          <pre style={{
            fontSize: 11,
            color: '#a1a1aa',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
          }}>
            {this.state.error.stack}
          </pre>
          {this.state.info && (
            <pre style={{
              fontSize: 11,
              color: '#6b7280',
              whiteSpace: 'pre-wrap',
              marginTop: 16,
              lineHeight: 1.5,
            }}>
              Component Stack:{this.state.info}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
