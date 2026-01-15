"use client";

import { useState } from "react";
import { Container, Stack, Button, Flex } from "@mantine/core";
import { useAppStore } from "../../store/useAppStore";
import { QueryConsole } from "../Queries/QueryConsole";
import { AppShellLayout } from "../Layout/app-shell";
import { CreateTableModal } from "../Tables/CreateTableModal";
import { TableSchemaModal } from "../Tables/TableSchemaModal";
import { Database } from "../../types/api";
import { TableViewer } from "../Tables/TableViewer";
import { IconPlus } from "@tabler/icons-react";

export default function HomePage({ databases }: { databases: Database[] }) {
  const [activeTab, setActiveTab] = useState("query");
  const [createTableOpened, setCreateTableOpened] = useState(false);
  const [schemaModalOpened, setSchemaModalOpened] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const { currentDatabase } = useAppStore();

  const handleViewSchema = (tableName: string) => {
    setSelectedTable(tableName);
    setSchemaModalOpened(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "query":
        return <QueryConsole />;
      case "tables":
        return (
          <Stack gap="md">
            <Flex direction="row" justify="end">
              {currentDatabase && (
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setCreateTableOpened(true)}
                >
                  Create Table
                </Button>
              )}
            </Flex>
            <TableViewer onViewSchema={handleViewSchema} />
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AppShellLayout
        databases={databases}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <Container>{renderContent()}</Container>
      </AppShellLayout>
      <CreateTableModal
        opened={createTableOpened}
        onClose={() => setCreateTableOpened(false)}
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
