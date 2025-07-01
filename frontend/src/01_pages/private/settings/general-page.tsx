import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment-timezone';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { toast } from 'sonner';
import { z } from 'zod';
import useAuthUserStore from '@/05_stores/auth-user-store';
import useFontSizeStore from '@/05_stores/font-size-store';
import useThemeStore from '@/05_stores/theme-store';
import useTimezoneStore from '@/05_stores/timezone-store';
import { mainInstance } from '@/07_instances/main-instance';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Generate timezone options from moment-timezone
const timezones = moment.tz.names().map(tz => ({ label: tz, value: tz }));

// Define form schema with Zod for validation
const FormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    message: 'Theme must be either light or dark',
  }),
  font_size: z.string().min(1, {
    message: 'Required',
  }),
  timezone: z.object({
    label: z.string().min(1, {
      message: 'Required',
    }),
    value: z.string().min(1, {
      message: 'Required',
    }),
  }),
  date_format: z.string().min(1, {
    message: 'Required',
  }),
  time_format: z.string().min(1, {
    message: 'Required',
  }),
});

// Main component for the General Settings Page
const GeneralPage = () => {
  // Access state management stores
  const { setUser } = useAuthUserStore();
  const { theme, setTheme } = useThemeStore();
  const { fontSize, setFontSize } = useFontSizeStore();
  const {
    timezone,
    date_format,
    time_format,
    setTimezone,
    setDateFormat,
    setTimeFormat,
  } = useTimezoneStore();

  // Initialize form with default values and schema resolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      theme: theme || 'light',
      font_size: fontSize || '1rem',
      timezone: timezone
        ? timezones.find(tz => tz.value === timezone)
        : undefined,
      date_format: date_format || 'YYYY-MM-DD',
      time_format: time_format || 'HH:mm:ss',
    },
  });

  // Local loading state for async form submission
  const [isLoadingUpdateProfile, setIsLoadingUpdateProfile] =
    useState<boolean>(false);

  // Form submit handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // Extract value from timezone object
    const newData = { ...data, timezone: data.timezone?.value };

    setIsLoadingUpdateProfile(true);

    // Show loading, success, or error toast during async request
    toast.promise(mainInstance.patch(`/api/settings`, newData), {
      loading: 'Loading...',
      success: response => {
        // Update user and UI settings from response
        setUser(response.data);

        setTheme(response.data.user_setting.theme);
        setFontSize(response.data.user_setting.font_size);
        setTimezone(response.data.user_setting.timezone);
        setDateFormat(response.data.user_setting.date_format);
        setTimeFormat(response.data.user_setting.time_format);

        return 'Success!';
      },
      error: error => {
        return (
          error.response?.data?.message || error.message || 'An error occurred'
        );
      },
      finally: () => {
        setIsLoadingUpdateProfile(false);
      },
    });
  };

  return (
    <div className="relative">
      {/* Page header */}
      <div className="mb-3">
        <PageHeader>General</PageHeader>
      </div>

      {/* Form wrapper */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <Card className="max-w-md">
            <CardBody>
              <div className="grid grid-cols-12 gap-3">
                {/* Theme selection using radio buttons */}
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-5"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light">Light</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark">Dark</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Font size selection dropdown */}
                <FormField
                  control={form.control}
                  name="font_size"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Font Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="0.875rem">Small</SelectItem>
                            <SelectItem value="1rem">Medium</SelectItem>
                            <SelectItem value="1.125rem">Large</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Timezone selection with react-select */}
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field, fieldState }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Timezone</FormLabel>
                      <ReactSelect
                        classNamePrefix="react-select"
                        className={`react-select-container ${fieldState.invalid ? 'invalid' : ''}`}
                        placeholder="Select timezone"
                        value={field.value}
                        onChange={field.onChange}
                        options={timezones}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date format dropdown */}
                <FormField
                  control={form.control}
                  name="date_format"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Date Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="YYYY-MM-DD">
                              YYYY-MM-DD
                            </SelectItem>
                            <SelectItem value="MM/DD/YYYY">
                              MM/DD/YYYY
                            </SelectItem>
                            <SelectItem value="DD/MM/YYYY">
                              DD/MM/YYYY
                            </SelectItem>
                            <SelectItem value="MMM DD, YYYY">
                              MMM DD, YYYY
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time format dropdown */}
                <FormField
                  control={form.control}
                  name="time_format"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Time Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="hh:mm:ss A">12 Hour</SelectItem>
                            <SelectItem value="HH:mm:ss">24 Hour</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardBody>

            {/* Submit button */}
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoadingUpdateProfile}>
                Submit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default GeneralPage;
