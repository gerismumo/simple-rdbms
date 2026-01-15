'use client';

import { useState } from 'react';
import { Modal, TextInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAppStore } from '../../store/useAppStore';
import { databasesApi } from '../../lib/api/databases';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


interface CreateDatabaseModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateDatabaseModal({ opened, onClose, onSuccess }: CreateDatabaseModalProps) {
  const [loading, setLoading] = useState(false);
  const { setCurrentDatabase } = useAppStore();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) => {
        if (!value) return 'Database name is required';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Only alphanumeric characters and underscores allowed';
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const response = await databasesApi.create(values.name);
      if (response.success) {
        toast.success(response.message || 'Database created successfully')
        setCurrentDatabase(values.name);
        form.reset();
        router.refresh();
        onSuccess();
        onClose();
        
      }
    } catch (error: any) {
      toast.error( error.error || 'Failed to create database')
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create New Database" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Database Name"
            placeholder="myapp"
            required
            {...form.getInputProps('name')}
          />
          <Button type="submit" loading={loading} fullWidth>
            Create Database
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}