"use client";

import { useState, useEffect } from "react";
import { Modal, Table, Loader, Text, Stack, Badge, Group } from "@mantine/core";
import { TableSchema } from "../../types/api";
import { tablesApi } from "../../lib/api/tables";
import { useAppStore } from "../../store/useAppStore";
import toast from "react-hot-toast";

interface TableSchemaModalProps {
  opened: boolean;
  onClose: () => void;
  tableName: string | null;
}

export function TableSchemaModal({
  opened,
  onClose,
  tableName,
}: TableSchemaModalProps) {
  const { currentDatabase } = useAppStore();
  const [schema, setSchema] = useState<TableSchema | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened && tableName) {
      loadSchema();
    }
  }, [opened, tableName]);

  const loadSchema = async () => {
    if (!tableName) return;

    setLoading(true);
    try {
      const response = await tablesApi.getSchema({
        name: tableName,
        db: currentDatabase as string,
      });
      if (response.success && response.data) {
        setSchema(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load table schema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Table Schema: ${tableName}`}
      centered
      size="lg"
    >
      {loading ? (
        <Stack align="center" p="xl">
          <Loader size="md" />
        </Stack>
      ) : schema ? (
        <Stack gap="md">
          <Group>
            <Text size="sm" c="dimmed">
              Total Rows: {schema.rowCount}
            </Text>
          </Group>

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Column</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Nullable</Table.Th>
                <Table.Th>Key</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {schema.columns.map((col) => (
                <Table.Tr key={col.name}>
                  <Table.Td>
                    <Text fw={500}>{col.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">{col.type}</Badge>
                  </Table.Td>
                  <Table.Td>{col.nullable}</Table.Td>
                  <Table.Td>
                    {col.key === "PRI" && <Badge color="blue">PRIMARY</Badge>}
                    {col.key === "UNI" && <Badge color="cyan">UNIQUE</Badge>}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      ) : (
        <Text c="dimmed" ta="center">
          No schema data available
        </Text>
      )}
    </Modal>
  );
}
