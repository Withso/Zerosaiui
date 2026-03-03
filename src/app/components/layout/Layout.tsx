import { Outlet, useLocation, Link } from 'react-router';
import { Sun, Moon, Sparkles, X, PanelLeft } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { componentRegistry } from '../../data/componentRegistry';
import { TokenTableButton } from '../TokenTablePopup';
import { useState, useEffect } from 'react';

export function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isComponents = location.pathname.startsWith('/design-system');
  const isTokens = location.pathname.startsWith('/design-tokens');
  const isCLI = location.pathname.startsWith('/cli');
  const isHome = !isComponents && !isTokens && !isCLI;
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    padding: isMobile ? 'var(--token-space-3) var(--token-space-4)' : 'var(--token-space-2) var(--token-space-3)',
    fontSize: 'var(--token-text-xs)',
    fontWeight: active ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
    color: active ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
    textDecoration: 'none',
    borderBottom: isMobile ? 'none' : (active ? '2px solid var(--token-accent)' : '2px solid transparent'),
    borderLeft: isMobile ? (active ? '2px solid var(--token-accent)' : '2px solid transparent') : 'none',
    background: isMobile && active ? 'var(--token-bg-hover)' : 'transparent',
    transition: 'all var(--token-duration-fast)',
    marginBottom: isMobile ? 0 : -1,
    display: 'block',
  });

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
      }}
    >
      <header
        className="flex items-center justify-between shrink-0"
        style={{
          height: isMobile ? 48 : 56,
          padding: isMobile ? '0 var(--token-space-3)' : '0 var(--token-space-6)',
          borderBottom: '1px solid var(--token-border)',
          background: 'var(--token-bg)',
          zIndex: 'var(--token-z-sticky)',
        }}
      >
        <div className="flex items-center" style={{ gap: isMobile ? 'var(--token-space-2)' : 'var(--token-space-6)' }}>
          {isMobile && (
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 32,
                height: 32,
                border: 'none',
                background: mobileNavOpen ? 'var(--token-bg-hover)' : 'transparent',
                color: 'var(--token-text-secondary)',
                borderRadius: 'var(--token-radius-md)',
                transition: 'all var(--token-duration-fast)',
                flexShrink: 0,
              }}
            >
              {mobileNavOpen ? <X size={16} /> : <PanelLeft size={16} />}
            </button>
          )}

          <Link
            to="/"
            className="flex items-center no-underline"
            style={{
              gap: 'var(--token-space-2)',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: isMobile ? 22 : 26,
                height: isMobile ? 22 : 26,
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-text-primary)',
              }}
            >
              <Sparkles size={isMobile ? 11 : 14} style={{ color: 'var(--token-text-inverse)' }} />
            </div>
            <span
              style={{
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-semibold)',
                color: 'var(--token-text-primary)',
                letterSpacing: 'var(--token-tracking-tight)',
              }}
            >
              Zeros AI Kit
            </span>
            {!isMobile && (
              <span
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  fontFamily: 'var(--token-font-mono)',
                  marginLeft: 'var(--token-space-1)',
                }}
              >
                {componentRegistry.length}
              </span>
            )}
          </Link>

          {!isMobile && (
            <nav className="flex items-center header-nav-tabs" style={{ gap: 0, marginLeft: 'var(--token-space-2)' }}>
              <Link to="/" style={navLinkStyle(isHome)}>Gallery</Link>
              <Link to="/design-system" style={navLinkStyle(isComponents)}>Components</Link>
              <Link to="/design-tokens" style={navLinkStyle(isTokens)}>Design Tokens</Link>
              <Link to="/cli" style={navLinkStyle(isCLI)}>CLI</Link>
            </nav>
          )}
        </div>

        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {!isMobile && <TokenTableButton />}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: isMobile ? 32 : 34,
              height: isMobile ? 32 : 34,
              borderRadius: 'var(--token-radius-md)',
              border: '1px solid var(--token-border)',
              background: 'var(--token-bg)',
              color: 'var(--token-text-secondary)',
              transition: 'all var(--token-duration-normal) var(--token-ease-default)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--token-border-strong)';
              (e.currentTarget as HTMLElement).style.color = 'var(--token-text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--token-border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--token-text-secondary)';
            }}
          >
            {theme === 'light' ? <Moon size={isMobile ? 13 : 15} /> : <Sun size={isMobile ? 13 : 15} />}
          </button>
        </div>
      </header>

      {isMobile && mobileNavOpen && (
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 0,
            right: 0,
            background: 'var(--token-bg)',
            borderBottom: '1px solid var(--token-border)',
            boxShadow: 'var(--token-shadow-lg)',
            zIndex: 'var(--token-z-modal)',
          }}
        >
          <nav className="flex flex-col">
            <Link to="/" style={navLinkStyle(isHome)}>Gallery</Link>
            <Link to="/design-system" style={navLinkStyle(isComponents)}>Components</Link>
            <Link to="/design-tokens" style={navLinkStyle(isTokens)}>Design Tokens</Link>
            <Link to="/cli" style={navLinkStyle(isCLI)}>CLI</Link>
          </nav>
          <div
            style={{
              padding: 'var(--token-space-3) var(--token-space-4)',
              borderTop: '1px solid var(--token-border)',
            }}
          >
            <TokenTableButton />
          </div>
        </div>
      )}

      {isMobile && mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 'calc(var(--token-z-modal) - 1)' as any,
          }}
        />
      )}

      <main className="flex-1" style={{ minHeight: 0, overflow: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}