import { BsInputCursor } from 'react-icons/bs';
import { FaCaretSquareDown } from 'react-icons/fa';
import { FaBoxOpen, FaChevronDown, FaKeyboard, FaTable } from 'react-icons/fa6';
import { Outlet } from 'react-router';
import { type SidebarGroup } from '@/03_templates/main-template/_components/app-sidebar';
import MainTemplate from '@/03_templates/main-template/main-template';

const ExamplesLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Forms',
      sidebarItems: [
        {
          title: 'Input',
          url: '/examples/forms/input',
          icon: BsInputCursor,
          end: true,
        },
        {
          title: 'React Select',
          url: '/examples/forms/react-select',
          icon: FaCaretSquareDown,
          end: true,
        },
        {
          title: 'React Dropzone',
          url: '/examples/forms/react-dropzone',
          icon: FaBoxOpen,
          end: true,
        },
        {
          title: 'React Quill',
          url: '/examples/forms/react-quill',
          icon: FaKeyboard,
          end: true,
        },
        {
          title: 'Global Dropdown',
          url: '/examples/forms/global-dropdown',
          icon: FaChevronDown,
          end: true,
        },
      ],
    },
    {
      sidebarLabel: 'CRUD',
      sidebarItems: [
        {
          title: 'Data Table',
          url: '/examples/crud/data-table',
          icon: FaTable,
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

export default ExamplesLayout;
