'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  ActionIcon,
  Stack,
  Badge,
  Button,
  Loader,
  Box,
} from '@mantine/core';
import {
  IconDatabase,
  IconTrash,
  IconCheck,
  IconRefresh,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useAppStore } from '../../store/useAppStore';
import { databasesApi } from '../../lib/api/databases';


export function DatabaseList() {
  const { databases, setDatabases, currentDatabase, setCurrentDatabase, loading, setLoading } =
    useAppStore();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    loadDatabases();
  }, []);

  const loadDatabases = async () => {
    setLoading('databases', true);
    try {
      const response = await databasesApi.getAll();
      if (response.success && response.data) {
        setDatabases(response.data);
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.error || 'Failed to load databases',
        color: 'red',
      });
    } finally {
      setLoading('databases', false);
    }
  };

  const handleSwitch = async (dbName: string) => {
    setLocalLoading(true);
    try {
      const response = await databasesApi.switchTo(dbName);
      if (response.success) {
        setCurrentDatabase(dbName);
        notifications.show({
          title: 'Success',
          message: response.message || `Switched to ${dbName}`,
          color: 'green',
        });
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.error || 'Failed to switch database',
        color: 'red',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = (dbName: string) => {
    modals.openConfirmModal({
      title: 'Delete Database',
      children: (
        <Text size="sm">
          Are you sure you want to delete database <strong>{dbName}</strong>? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const response = await databasesApi.delete(dbName);
          if (response.success) {
            notifications.show({
              title: 'Success',
              message: response.message || 'Database deleted',
              color: 'green',
            });
            if (currentDatabase === dbName) {
              setCurrentDatabase(null);
            }
            loadDatabases();
          }
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error.error || 'Failed to delete database',
            color: 'red',
          });
        }
      },
    });
  };

  if (loading.databases) {
    return (
      <Box p="xl" style={{ textAlign: 'center' }}>
        <Loader size="md" />
      </Box>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="lg" fw={600}>
          Databases
        </Text>
        <ActionIcon variant="light" onClick={loadDatabases} disabled={localLoading}>
          <IconRefresh size={18} />
        </ActionIcon>
      </Group>

      {databases.length === 0 ? (
        <Card withBorder>
          <Text c="dimmed" size="sm" ta="center">
            No databases found
          </Text>
        </Card>
      ) : (
        <Stack gap="xs">
          {databases.map((db) => (
            <Card
              key={db.name}
              withBorder
              padding="sm"
              style={{
                cursor: 'pointer',
                backgroundColor:
                  currentDatabase === db.name ? 'var(--mantine-color-indigo-0)' : undefined,
              }}
              onClick={() => handleSwitch(db.name)}
            >
              <Group justify="space-between">
                <Group gap="xs">
                  <IconDatabase size={20} />
                  <div>
                    <Text size="sm" fw={500}>
                      {db.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {db.tables} table{db.tables !== 1 ? 's' : ''}
                    </Text>
                  </div>
                </Group>
                <Group gap="xs">
                  {currentDatabase === db.name && (
                    <Badge color="green" variant="light" size="sm">
                      <IconCheck size={12} />
                    </Badge>
                  )}
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(db.name);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}