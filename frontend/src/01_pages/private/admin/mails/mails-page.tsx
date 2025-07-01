import { useNavigate, useParams } from 'react-router';
// Import UI components and custom tabs
import PageHeader from '@/components/typography/page-header';
import { Card, CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MailLogsTab from './_tabs/logs/mail-logs-tab';
import MailTemplatesTab from './_tabs/templates/mail-templates-tab';

const MailsPage = () => {
  // Extract the `mailTab` parameter from the URL
  const { mailTab } = useParams();

  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Default to 'logs' tab if no tab is specified in the URL
  const currentTab = mailTab || 'logs';

  // Handle tab change by updating the route
  const handleTabChange = (value: string) => navigate(`/admin/mails/${value}`);

  return (
    // Tabs component handles switching between Logs and Templates
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      {/* Header section with page title and tab navigation */}
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>Mails</PageHeader>

        {/* Tab triggers for Logs and Templates */}
        <TabsList size="sm">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
      </div>

      {/* Card containing the tab content */}
      <Card>
        {/* Tab content for Mail Logs */}
        <TabsContent value="logs">
          <CardBody>
            <MailLogsTab />
          </CardBody>
        </TabsContent>

        {/* Tab content for Mail Templates */}
        <TabsContent value="templates">
          <CardBody>
            <MailTemplatesTab />
          </CardBody>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default MailsPage;
