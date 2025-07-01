import { useNavigate, useParams } from 'react-router';
import PageHeader from '@/components/typography/page-header';
import { Card, CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalDropdownsTab from './_tabs/global-dropdowns-tab.tsx/global-dropdowns-tab';
import SettingsTab from './_tabs/settings/settings-tab';

// Main system configuration page component with tabbed interface
const SystemPage = () => {
  // Get current tab from URL params and navigation function
  const { systemTab } = useParams();
  const navigate = useNavigate();
  // Default to 'settings' tab if none specified
  const currentTab = systemTab || 'settings';

  // Handle tab changes by updating the URL
  const handleTabChange = (value: string) => navigate(`/admin/system/${value}`);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="mb-3 flex items-center justify-between">
        {/* Page header/title */}
        <PageHeader>System</PageHeader>

        {/* Tab selection controls */}
        <TabsList size="sm">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="global-dropdowns">Global Dropdowns</TabsTrigger>
        </TabsList>
      </div>

      {/* Main content area with tab-specific components */}
      <Card>
        <CardBody>
          {/* Settings tab content */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>

          {/* Global dropdowns tab content */}
          <TabsContent value="global-dropdowns">
            <GlobalDropdownsTab />
          </TabsContent>
        </CardBody>
      </Card>
    </Tabs>
  );
};

export default SystemPage;
