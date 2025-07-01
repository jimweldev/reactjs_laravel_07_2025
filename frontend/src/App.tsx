import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import DashboardPage from './01_pages/private/admin/dashboard/dashboard-page';
import MailsPage from './01_pages/private/admin/mails/mails-page';
import SystemPage from './01_pages/private/admin/system/system-page';
import UsersPage from './01_pages/private/admin/users/users-page';
import DataTablePage from './01_pages/private/examples/crud/data-table-page';
import GlobalDropdownPage from './01_pages/private/examples/forms/global-dropdown-page';
import InputPage from './01_pages/private/examples/forms/input-page';
import ReactDropzonePage from './01_pages/private/examples/forms/react-dropzone-page';
import ReactQuillPage from './01_pages/private/examples/forms/react-quill-page';
import ReactSelectPage from './01_pages/private/examples/forms/react-select-page';
import GeneralPage from './01_pages/private/settings/general-page';
import PasswordPage from './01_pages/private/settings/password-page';
import ProfilePage from './01_pages/private/settings/profile/profile-page';
import LoginPage from './01_pages/public/login-page';
import AdminLayout from './02_layouts/private/admin-layout';
import ExamplesLayout from './02_layouts/private/examples-layout';
import HomeLayout from './02_layouts/private/home-layout';
import PrivateLayout from './02_layouts/private/private-layout';
import SettingsLayout from './02_layouts/private/settings-layout';
import PublicLayout from './02_layouts/public/public-layout';
import useAuthUserStore from './05_stores/auth-user-store';

const App = () => {
  const { token, user } = useAuthUserStore();

  const privateRoutes = [
    {
      element: <PrivateLayout />,
      children: [
        // ACCOUNT TYPE | MAIN
        ...(user?.account_type === 'Main'
          ? [
              // ADMIN
              ...(user?.is_admin
                ? [
                    {
                      path: 'admin',
                      element: <AdminLayout />,
                      children: [
                        {
                          path: '',
                          element: <DashboardPage />,
                        },
                        {
                          path: 'users',
                          children: [
                            {
                              path: '',
                              element: <UsersPage />,
                            },
                            {
                              path: ':userTab',
                              element: <UsersPage />,
                              children: [
                                {
                                  path: ':rbacTab',
                                  element: <UsersPage />,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          path: 'system',
                          children: [
                            {
                              path: '',
                              element: <SystemPage />,
                            },
                            {
                              path: ':systemTab',
                              element: <SystemPage />,
                            },
                          ],
                        },
                        {
                          path: 'mails',
                          children: [
                            {
                              path: '',
                              element: <MailsPage />,
                            },
                            {
                              path: ':mailTab',
                              element: <MailsPage />,
                            },
                          ],
                        },
                      ],
                    },
                  ]
                : []),

              // HOME
              {
                path: '',
                element: <HomeLayout />,
                children: [
                  {
                    path: '',
                    element: <h1>Home</h1>,
                  },
                ],
              },

              // EXAMPLES
              ...(import.meta.env.VITE_ENV === 'development'
                ? [
                    {
                      path: 'examples',
                      element: <ExamplesLayout />,
                      children: [
                        {
                          path: '',
                          element: <Navigate to="forms" replace />,
                        },
                        {
                          path: 'forms',
                          children: [
                            {
                              path: '',
                              element: <Navigate to="input" replace />,
                            },
                            {
                              path: 'input',
                              element: <InputPage />,
                            },
                            {
                              path: 'react-select',
                              element: <ReactSelectPage />,
                            },
                            {
                              path: 'react-dropzone',
                              element: <ReactDropzonePage />,
                            },
                            {
                              path: 'react-quill',
                              element: <ReactQuillPage />,
                            },
                            {
                              path: 'global-dropdown',
                              element: <GlobalDropdownPage />,
                            },
                          ],
                        },
                        {
                          path: 'crud',
                          children: [
                            {
                              path: '',
                              element: <Navigate to="data-table" replace />,
                            },
                            {
                              path: 'data-table',
                              element: <DataTablePage />,
                            },
                          ],
                        },
                      ],
                    },
                  ]
                : []),

              {
                path: 'settings',
                element: <SettingsLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="profile" replace />,
                  },
                  {
                    path: 'profile',
                    element: <ProfilePage />,
                  },
                  {
                    path: 'password',
                    element: <PasswordPage />,
                  },
                  {
                    path: 'general',
                    element: <GeneralPage />,
                  },
                ],
              },
            ]
          : []),

        // ACCOUNT TYPE | GUEST
        ...(user?.account_type === 'Guest'
          ? [
              {
                path: '',
                element: <h1>Home</h1>,
              },
            ]
          : []),
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  const publicRoutes = [
    {
      element: <PublicLayout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ];

  const router = createBrowserRouter(!token ? publicRoutes : privateRoutes);

  return <RouterProvider router={router} />;
};

export default App;
