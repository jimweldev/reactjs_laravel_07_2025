import { FaHouse } from 'react-icons/fa6';
import { Outlet } from 'react-router';
import { type SidebarGroup } from '@/03_templates/main-template/_components/app-sidebar';
import MainTemplate from '@/03_templates/main-template/main-template';

const HomeLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Pages',
      sidebarItems: [
        {
          title: 'Home',
          url: '/',
          icon: FaHouse,
          end: true,
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

export default HomeLayout;
