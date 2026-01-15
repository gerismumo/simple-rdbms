"use client";

import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Text,
  Button,
  NavLink,
  ScrollArea,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDatabase,
  IconTable,
  IconTerminal,
} from "@tabler/icons-react";

import { DatabaseList } from "../Databases/DatabaseList";
import { useAppStore } from "../../store/useAppStore";
import { CreateDatabaseModal } from "../Databases/CreateDatabaseModal";
import { Database } from "../../types/api";
import { useTables } from "../../lib/hook/useTable";

interface AppShellLayoutProps {
  children: React.ReactNode;
  databases: Database[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppShellLayout({
  children,
  databases,
  activeTab,
  onTabChange,
}: AppShellLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const [createDbOpened, setCreateDbOpened] = useState(false);
  const { currentDatabase, setSelectedTable } = useAppStore();
  const { data: tables } = useTables();
  const [tablesOpened, setTablesOpened] = useState(false);

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <IconDatabase size={28} />
              <Text size="xl" fw={700}>
                MyRDBMS
              </Text>
            </Group>
            {currentDatabase && (
              <Badge color="indigo" size="lg" variant="light">
                {currentDatabase}
              </Badge>
            )}
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <AppShell.Section>
            <Group justify="space-between" mb="md">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Databases
              </Text>
              <Button size="xs" onClick={() => setCreateDbOpened(true)}>
                New
              </Button>
            </Group>
            <DatabaseList databases={databases} />
          </AppShell.Section>
          <AppShell.Section grow component={ScrollArea} mt="md">
            <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="sm">
              Navigation
            </Text>
            <NavLink
              active={activeTab === "query"}
              label="Query Console"
              leftSection={<IconTerminal size={20} />}
              onClick={() => onTabChange("query")}
              mb={4}
            />
            <NavLink
              label="Tables"
              leftSection={<IconTable size={20} />}
              active={activeTab === "tables"}
              opened={tablesOpened}
              onClick={() => {
                onTabChange("tables");
                setTablesOpened((o) => !o);
              }}
            >
              {!currentDatabase && (
                <Text size="xs" c="dimmed" px="sm">
                  Select a database
                </Text>
              )}

              {tables?.map((table) => (
                <NavLink
                  key={table.name}
                  label={table.name}
                  onClick={() => {
                    onTabChange("tables");
                    setSelectedTable(table.name);
                  }}
                />
              ))}
            </NavLink>
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>

      <CreateDatabaseModal
        opened={createDbOpened}
        onClose={() => setCreateDbOpened(false)}
        onSuccess={() => {}}
      />
    </>
  );
}
