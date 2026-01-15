"use client";

import { useState, useEffect } from "react";
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
} from "@mantine/core";
import {
  IconDatabase,
  IconTrash,
  IconCheck,
  IconRefresh,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useAppStore } from "../../store/useAppStore";
import { databasesApi } from "../../lib/api/databases";
import toast from "react-hot-toast";
import { Database } from "../../types/api";
import { useRouter } from "next/navigation";

export function DatabaseList({ databases }: { databases: Database[] }) {
  console.log("DatabaseList data:", databases);
  const router = useRouter();

  const { currentDatabase, setCurrentDatabase } = useAppStore();

  const handleSwitch = async (dbName: string) => {
    try {
      const response = await databasesApi.switchTo(dbName);
      if (response.success) {
        setCurrentDatabase(dbName);
        toast.success(response.message || `Switched to ${dbName}`);
      }
    } catch (error: any) {
      toast.error(error.error || "Failed to switch database");
    }
  };

  const handleDelete = (dbName: string) => {
    modals.openConfirmModal({
      title: "Delete Database",
      children: (
        <Text size="sm">
          Are you sure you want to delete database <strong>{dbName}</strong>?
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await databasesApi.delete(dbName);
          if (response.success) {
            toast.success(response.message || "Database deleted");
            if (currentDatabase === dbName) {
              setCurrentDatabase(null);
            }
            router.refresh();
          }
        } catch (error: any) {
          toast.error(error.error || "Failed to delete database");
        }
      },
    });
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="lg" fw={600}>
          Databases
        </Text>
        {/* <ActionIcon
          variant="light"
          onClick={loadDatabases}
          disabled={localLoading}
        >
          <IconRefresh size={18} />
        </ActionIcon> */}
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
                cursor: "pointer",
                backgroundColor:
                  currentDatabase === db.name
                    ? "var(--mantine-color-indigo-0)"
                    : undefined,
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
                      {db.tables} table{db.tables !== 1 ? "s" : ""}
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
