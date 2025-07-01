import { NavLink } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';

export type SidebarGroup = {
  sidebarLabel?: string;
  sidebarItems: SidebarItem[];
};

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  end?: boolean;
  subSidebarItems?: SidebarSubItem[];
};

type SidebarSubItem = {
  title: string;
  url: string;
};

type AppSidebarProps = {
  sidebarGroups: SidebarGroup[];
  side?: 'left' | 'right';
};

const AppSidebar = ({ sidebarGroups = [], ...props }: AppSidebarProps) => {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        {sidebarGroups.map(group => (
          <SidebarGroup key={group.sidebarLabel}>
            <SidebarGroupLabel>{group.sidebarLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.sidebarItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} end={item.end} tabIndex={-1}>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <item.icon />
                          {item.title}
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                    {item.subSidebarItems && (
                      <SidebarMenuSub>
                        {item.subSidebarItems.map(subItem => (
                          <SidebarMenuItem key={subItem.title}>
                            <NavLink to={subItem.url} end>
                              {({ isActive }) => (
                                <SidebarMenuButton isActive={isActive}>
                                  {subItem.title}
                                </SidebarMenuButton>
                              )}
                            </NavLink>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
