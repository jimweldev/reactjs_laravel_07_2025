import PageHeader from '@/components/typography/page-header';
import DashboardAccountTypesChart from './_components/dashboard-account-types-chart';
import DashboardStatistics from './_components/dashboard-statistics';
import DashboardUserRegistrationStats from './_components/dashboard-user-registration-stats';

const DashboardPage = () => {
  return (
    <>
      {/* Page header section with dashboard title */}
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>Dashboard</PageHeader>
      </div>

      {/* Dashboard content area */}
      <div className="space-y-3">
        {/* Statistics overview cards */}
        <DashboardStatistics />

        {/* Grid layout for charts */}
        <div className="grid grid-cols-12 gap-3">
          {/* User registration statistics chart */}
          <DashboardUserRegistrationStats />

          {/* Account types distribution chart */}
          <DashboardAccountTypesChart />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
