import {
  FaArrowRightFromBracket,
  FaBell,
  FaCode,
  FaGear,
  FaHouse,
  FaUserGear,
} from 'react-icons/fa6';
import { Link, NavLink, useLocation } from 'react-router';
import useAuthUserStore from '@/05_stores/auth-user-store';
import ReactImage from '@/components/images/react-image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarProvider } from '@/components/ui/sidebar';
import { formatName } from '@/lib/format-name';
import { getImageUrl } from '@/lib/get-image-url';
import AppSidebar, { type SidebarGroup } from './_components/app-sidebar';
import AppSidebarToggle from './_components/app-sidebar-toggle';
import fallbackImage from '/images/default-avatar.png';

type MainTemplateProps = {
  sidebarGroups: SidebarGroup[];
  children: React.ReactNode;
};

const MainTemplate = ({ sidebarGroups, children }: MainTemplateProps) => {
  const location = useLocation();

  const excludedPaths = ['/admin', '/examples', '/settings'];
  const isExcluded = excludedPaths.some(path =>
    location.pathname.startsWith(path),
  );

  const { user, clearAuthUser } = useAuthUserStore();

  const paths = [
    ...(user?.is_admin
      ? [
          {
            path: '/admin',
            icon: <FaUserGear className="text-inherit" />,
            label: 'Admin',
          },
        ]
      : []),
    {
      path: '/',
      icon: <FaHouse className="text-inherit" />,
      label: 'Home',
    },
    ...(import.meta.env.VITE_ENV === 'development'
      ? [
          {
            path: '/examples',
            icon: <FaCode className="text-inherit" />,
            label: 'Examples',
          },
        ]
      : []),
  ];

  return (
    <SidebarProvider>
      <AppSidebar sidebarGroups={sidebarGroups} />
      <main className="flex-1">
        <header className="bg-card flex justify-between p-2 shadow-sm">
          <div className="flex gap-2">
            <AppSidebarToggle />

            <div className="flex gap-2">
              {paths.map(path =>
                path.path === '/' ? (
                  <NavLink to={path.path} key={path.path} tabIndex={-1}>
                    {() => {
                      const active = !isExcluded;
                      return (
                        <Button
                          variant={active ? 'default' : 'ghost'}
                          size="icon"
                        >
                          {path.icon}
                        </Button>
                      );
                    }}
                  </NavLink>
                ) : (
                  <NavLink to={path.path} key={path.path} tabIndex={-1}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        size="icon"
                      >
                        {path.icon}
                      </Button>
                    )}
                  </NavLink>
                ),
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="rounded-full" variant="outline" size="icon">
              <FaBell />
            </Button>
            <Button className="rounded-full" variant="outline" size="icon">
              <FaHouse />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="size-10 cursor-pointer rounded-full p-1">
                  <div className="outline-primary flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent object-contain outline-2">
                    <ReactImage
                      className="pointer-events-none h-full w-full object-cover"
                      src={getImageUrl(
                        `${import.meta.env.VITE_STORAGE_BASE_URL}/`,
                        user?.avatar_path,
                      )}
                      unloaderSrc={fallbackImage}
                    />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mx-2 min-w-56">
                <DropdownMenuLabel>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {formatName(user)}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to="/settings">
                    <DropdownMenuItem>
                      <FaGear className="text-inherit" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={clearAuthUser}>
                    <FaArrowRightFromBracket className="text-inherit" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="@container/main p-4 sm:p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default MainTemplate;
