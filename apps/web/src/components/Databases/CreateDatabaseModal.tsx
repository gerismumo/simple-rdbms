'use client';

import { useState } from 'react';
import { Modal, TextInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAppStore } from '../../store/useAppStore';
import { databasesApi } from '../../lib/api/databases';


interface CreateDatabaseModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateDatabaseModal({ opened, onClose, onSuccess }: CreateDatabaseModalProps) {
  const [loading, setLoading] = useState(false);
  const { setCurrentDatabase } = useAppStore();

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
        notifications.show({
          title: 'Success',
          message: response.message || 'Database created successfully',
          color: 'green',
        });
        setCurrentDatabase(values.name);
        form.reset();
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.error || 'Failed to create database',
        color: 'red',
      });
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