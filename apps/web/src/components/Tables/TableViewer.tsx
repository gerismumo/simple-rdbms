"use client";

import {
  Card,
  Group,
  Text,
  Table,
  Loader,
  Stack,
  Button,
  Badge,
  ScrollArea,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { tablesApi } from "../../lib/api/tables";
import { Column } from "../../types/api";
import toast from "react-hot-toast";
import { modals } from "@mantine/modals";
import { useRouter } from "next/navigation";

interface TableListProps {
  onViewSchema: (tableName: string) => void;
}

export function TableViewer({ onViewSchema }: TableListProps) {
  const { currentDatabase, selectedTable } = useAppStore();
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!selectedTable) return;

    const loadTable = async () => {
      setLoading(true);
      try {
        const res = await tablesApi.getRows({
          db: currentDatabase!,
          name: selectedTable,
        });

        if (res.success) {
          setColumns(res?.data?.columns || []);
          setData(res?.data?.rows || []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTable();
  }, [selectedTable]);

  const handleDelete = (tableName: string) => {
    modals.openConfirmModal({
      title: "Drop Table",
      children: (
        <Text size="sm">
          Are you sure you want to drop table <strong>{tableName}</strong>? This
          action cannot be undone and all data will be lost.
        </Text>
      ),
      labels: { confirm: "Drop", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await tablesApi.drop({
            name: tableName,
            db: currentDatabase as string,
          });
          if (response.success) {
            toast.success(response.message || "Table dropped successfully");
            router.refresh();
            //   mutate();
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to drop table");
        }
      },
    });
  };

  if (!selectedTable) {
    return (
      <Card withBorder>
        <Text c="dimmed" ta="center">
          Select a table to view its data
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group>
          <Text fw={600} size="lg">
            {selectedTable}
          </Text>
          <Badge variant="light">{data.length} rows</Badge>
        </Group>
        <Group gap="xs">
          <Button
            variant="light"
            leftSection={<IconEye size={16} />}
            size="xs"
            onClick={() => onViewSchema(selectedTable)}
          >
            View schema
          </Button>
          <Tooltip label="Delete table">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDelete(selectedTable)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Card withBorder>
        {loading ? (
          <Loader />
        ) : data.length === 0 ? (
          <Text c="dimmed" ta="center">
            No data available
          </Text>
        ) : (
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  {columns.map((col) => (
                    <Table.Th key={col.name}>{col.name}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((row, i) => (
                  <Table.Tr key={i}>
                    {columns.map((col) => (
                      <Table.Td key={col.name}>{row[col.name]}</Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Card>
    </Stack>
  );
}
