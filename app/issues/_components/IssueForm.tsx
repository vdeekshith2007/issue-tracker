'use client';

import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { issueSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue, Priority } from '@prisma/client';
import { Button, Callout, Flex, Select, Text, TextField } from '@radix-ui/themes';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Controller, useForm } from 'react-hook-form';
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });
import { z } from 'zod';

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || 'MEDIUM',
    },
  });
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) await axios.patch('/api/issues/' + issue.id, data);
      else await axios.post('/api/issues', data);
      router.push('/issues/list');
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError('An unexpected error occurred. Ensure you are signed in.');
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <TextField.Root
            placeholder="Issue Title"
            {...register('title')}
          />
          <ErrorMessage>{errors.title?.message}</ErrorMessage>
        </div>

        <Flex align="center" gap="3">
          <Text size="2" weight="medium">
            Priority:
          </Text>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select.Root
                defaultValue={field.value || 'MEDIUM'}
                onValueChange={(val) => field.onChange(val as Priority)}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="URGENT">🚨 Critical / Urgent</Select.Item>
                  <Select.Item value="HIGH">High Priority</Select.Item>
                  <Select.Item value="MEDIUM">Medium Priority</Select.Item>
                  <Select.Item value="LOW">Low Priority</Select.Item>
                </Select.Content>
              </Select.Root>
            )}
          />
        </Flex>

        <div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE placeholder="Detailed issue description and reproduction steps..." {...field} />
            )}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>

        <Button disabled={isSubmitting}>
          {issue ? 'Update Issue' : 'Submit New Issue'}{' '}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;
