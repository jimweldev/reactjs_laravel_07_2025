import { useNavigate, useParams } from 'react-router';
import { CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PermissionsTab from './_tabs/permissions/permissions-tab';
import RolesTab from './_tabs/roles/roles-tab';

// RBAC (Role-Based Access Control) management tab component
const RbacTab = () => {
  // Get current tab from URL params
  const { rbacTab } = useParams();
  const navigate = useNavigate();
  // Default to roles tab if no tab specified
  const currentTab = rbacTab || 'roles';

  // Handle tab change navigation
  const handleTabChange = (value: string) =>
    navigate(`/admin/users/rbac/${value}`);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      {/* Tab navigation controls for RBAC sections */}
      <TabsList variant="outline">
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      {/* Main content area */}
      <CardBody>
        {/* Roles management tab content */}
        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>

        {/* Permissions management tab content */}
        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
      </CardBody>
    </Tabs>
  );
};

export default RbacTab;
