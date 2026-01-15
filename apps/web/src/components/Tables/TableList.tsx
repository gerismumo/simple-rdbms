'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  ActionIcon,
  Stack,
  Button,
  Loader,
  Box,
  Badge,
} from '@mantine/core';
import { IconTable, IconTrash, IconEye, IconRefresh } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useAppStore } from '../../store/useAppStore';
import { tablesApi } from '../../lib/api/tables';
import toast from 'react-hot-toast';


interface TableListProps {
  onViewSchema: (tableName: string) => void;
}

export function TableList({ onViewSchema }: TableListProps) {
  const { tables, setTables, currentDatabase, loading, setLoading } = useAppStore();

  useEffect(() => {
    if (currentDatabase) {
      loadTables();
    } else {
      setTables([]);
    }
  }, [currentDatabase]);

  const loadTables = async () => {
    setLoading('tables', true);
    try {
      const response = await tablesApi.getAll();
      if (response.success && response.data) {
        setTables(response.data);
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to load tables');
     
    } finally {
      setLoading('tables', false);
    }
  };

  const handleDelete = (tableName: string) => {
    modals.openConfirmModal({
      title: 'Drop Table',
      children: (
        <Text size="sm">
          Are you sure you want to drop table <strong>{tableName}</strong>? This action cannot be
          undone and all data will be lost.
        </Text>
      ),
      labels: { confirm: 'Drop', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const response = await tablesApi.drop(tableName);
          if (response.success) {
            toast.success(response.message || 'Table dropped successfully');
            loadTables();
          }
        } catch (error: any) {
          toast.error( error.error || 'Failed to drop table')
        }
      },
    });
  };

  if (!currentDatabase) {
    return (
      <Card withBorder>
        <Text c="dimmed" size="sm" ta="center">
          Please select a database first
        </Text>
      </Card>
    );
  }

  if (loading.tables) {
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
          Tables
        </Text>
        <ActionIcon variant="light" onClick={loadTables}>
          <IconRefresh size={18} />
        </ActionIcon>
      </Group>

      {tables.length === 0 ? (
        <Card withBorder>
          <Text c="dimmed" size="sm" ta="center">
            No tables found in {currentDatabase}
          </Text>
        </Card>
      ) : (
        <Stack gap="xs">
          {tables.map((table) => (
            <Card key={table.name} withBorder padding="sm">
              <Group justify="space-between">
                <Group gap="xs">
                  <IconTable size={20} />
                  <Text size="sm" fw={500}>
                    {table.name}
                  </Text>
                </Group>
                <Group gap="xs">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => onViewSchema(table.name)}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(table.name)}>
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