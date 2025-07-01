import { FaLock, FaSliders, FaUser } from 'react-icons/fa6';
import { Outlet } from 'react-router';
import { type SidebarGroup } from '@/03_templates/main-template/_components/app-sidebar';
import MainTemplate from '@/03_templates/main-template/main-template';

const SettingsLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Settings',
      sidebarItems: [
        {
          title: 'Profile',
          url: '/settings/profile',
          icon: FaUser,
          end: true,
        },
        {
          title: 'Password',
          url: '/settings/password',
          icon: FaLock,
        },
        {
          title: 'General',
          url: '/settings/general',
          icon: FaSliders,
        },
      ],
    },
  ];

  return (
    <MainTemplate sidebarGroups={sidebarGroups}>
      <Outlet />
    </MainTemplate>
  );
};

export default SettingsLayout;
