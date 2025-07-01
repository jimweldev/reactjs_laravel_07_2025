import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CodePreview from '@/components/code/code-preview';
import ReactQuillEditor from '@/components/editor/react-quill-editor';
import PageHeader from '@/components/typography/page-header';
import PageSubHeader from '@/components/typography/page-sub-header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const FormSchema = z.object({
  text: z
    .string()
    .min(1, {
      message: 'Required',
    })
    .refine(val => val.trim() !== '<p><br></p>', {
      message: 'Required',
    }),
});

const ReactQuillPage = () => {
  const formFull = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
    },
  });

  const formSimple = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmitFull = (_data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  const onSubmitSimple = (_data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  const codeStringFull = `
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ReactQuillEditor from '@/components/editor/react-quill-editor';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const FormSchema = z.object({
  text: z.string().min(1, {
    message: 'Required',
  }),
});

const ReactQuillPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = (_data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  return (
    <>
      <PageHeader className="mb-3">React Quill</PageHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            <FormField
              control={form.control}
              name="text"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <ReactQuillEditor
                      className={\`\${fieldState.invalid ? 'invalid' : ''}\`}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-12 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ReactQuillPage;
  `.trim();

  const codeStringSimple = `
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ReactQuillEditor from '@/components/editor/react-quill-editor';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const FormSchema = z.object({
  text: z.string().min(1, {
    message: 'Required',
  }),
});

const ReactQuillPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = (_data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  return (
    <>
      <PageHeader className="mb-3">React Quill</PageHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            <FormField
              control={form.control}
              name="text"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <ReactQuillEditor
                      className={\`\${fieldState.invalid ? 'invalid' : ''}\`}
                      type="simple"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-12 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ReactQuillPage;
  `.trim();

  const codeStringDisplay = `
<div
  className="react-quill-content rounded border p-3"
  dangerouslySetInnerHTML={{ __html: '<p>Hello World</p>' }}
/>
  `.trim();

  return (
    <>
      <PageHeader className="mb-3">React Quill</PageHeader>

      <PageSubHeader className="mb-1">Full</PageSubHeader>
      <CodePreview
        className="mb-6"
        code={codeStringFull}
        lineNumbers={[
          42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
        ]}
      >
        <Form {...formFull}>
          <form onSubmit={formFull.handleSubmit(onSubmitFull)}>
            <div className="grid grid-cols-12 gap-3">
              <FormField
                control={formFull.control}
                name="text"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <ReactQuillEditor
                        className={`${fieldState.invalid ? 'invalid' : ''}`}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-12 flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </CodePreview>

      <PageSubHeader className="mb-1">Simple</PageSubHeader>
      <CodePreview
        className="mb-6"
        code={codeStringSimple}
        lineNumbers={[
          42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
          59,
        ]}
      >
        <Form {...formSimple}>
          <form onSubmit={formSimple.handleSubmit(onSubmitSimple)}>
            <div className="grid grid-cols-12 gap-3">
              <FormField
                control={formSimple.control}
                name="text"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <ReactQuillEditor
                        className={`${fieldState.invalid ? 'invalid' : ''}`}
                        type="simple"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-12 flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </CodePreview>

      <h5 className="text-medium mb-1 font-semibold">Display Content</h5>
      <CodePreview code={codeStringDisplay} lineNumbers={[1, 2, 3, 4, 5]}>
        <div
          className="react-quill-content rounded border p-3"
          dangerouslySetInnerHTML={{ __html: `<p>Hello World</p>` }}
        />
      </CodePreview>
    </>
  );
};

export default ReactQuillPage;
