import { NavLink, Outlet } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`;

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <span className="mr-auto text-lg font-bold">Jess</span>
          <NavLink to="/" end className={linkClass}>
            首頁
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            關於
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
