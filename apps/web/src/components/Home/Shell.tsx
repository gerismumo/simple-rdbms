'use client';

import { useState } from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import { useAppStore } from '../../store/useAppStore';
import { QueryConsole } from '../Queries/QueryConsole';
import { TableList } from '../Tables/TableList';
import { AppShellLayout } from '../Layout/app-shell';
import { CreateTableModal } from '../Tables/CreateTableModal';
import { TableSchemaModal } from '../Tables/TableSchemaModal';


export default function HomePage() {
  const [activeTab, setActiveTab] = useState('query');
  const [createTableOpened, setCreateTableOpened] = useState(false);
  const [schemaModalOpened, setSchemaModalOpened] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const { currentDatabase } = useAppStore();

  const handleViewSchema = (tableName: string) => {
    setSelectedTable(tableName);
    setSchemaModalOpened(true);
  };

  const renderContent = () => {
    if (!currentDatabase) {
      return (
        <Container size="sm" py="xl">
          <Stack align="center" gap="md">
            <Title order={2}>Welcome to MyRDBMS</Title>
            <Text c="dimmed" ta="center">
              Create or select a database from the sidebar to get started.
            </Text>
          </Stack>
        </Container>
      );
    }

    switch (activeTab) {
      case 'query':
        return <QueryConsole />;
      case 'tables':
        return (
          <Stack gap="md">
            <TableList onViewSchema={handleViewSchema} />
            {currentDatabase && (
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--mantine-color-indigo-6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setCreateTableOpened(true)}
              >
                Create New Table
              </button>
            )}
          </Stack>
        );
      case 'tasks':
        // return <TasksPage />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppShellLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <Container>{renderContent()}</Container>
      </AppShellLayout>

      <CreateTableModal
        opened={createTableOpened}
        onClose={() => setCreateTableOpened(false)}
        onSuccess={() => {
          // Tables will reload via useEffect
        }}
      />

      <TableSchemaModal
        opened={schemaModalOpened}
        onClose={() => {
          setSchemaModalOpened(false);
          setSelectedTable(null);
        }}
        tableName={selectedTable}
      />
    </>
  );
}