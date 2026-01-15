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
  Flex,
} from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { useAppStore } from "../../store/useAppStore";
import { tablesApi } from "../../lib/api/tables";
import { TableRowsResponse } from "../../types/api";
import toast from "react-hot-toast";
import { modals } from "@mantine/modals";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface TableListProps {
  onViewSchema: (tableName: string) => void;
}

const fetchTableRows = async ([_key, db, table]: [
  string,
  string,
  string,
]): Promise<TableRowsResponse> => {
  const res = await tablesApi.getRows({
    db,
    name: table,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load table data");
  }

  return res.data;
};
export function TableViewer({ onViewSchema }: TableListProps) {
  const { currentDatabase, selectedTable } = useAppStore();
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR<TableRowsResponse, Error>(
    currentDatabase && selectedTable
      ? ["table-rows", currentDatabase, selectedTable]
      : null,
    fetchTableRows,
    {
      revalidateOnFocus: false,
    }
  );

  const columns = data?.columns ?? [];
  const rows = data?.rows ?? [];

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
            mutate();
            router.refresh();
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

  if (error) {
    return (
      <Card withBorder>
        <Text c="red" ta="center">
          {error.message}
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
          <Badge variant="light">{rows.length} rows</Badge>
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
        {isLoading ? (
          <Loader />
        ) : rows.length === 0 ? (
          <Text c="dimmed" ta="center">
            No data available , please execute the insert query on the query
            console
          </Text>
        ) : (
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  {columns.map((col) => (
                    <Table.Th key={col.name}>
                      <Flex direction="row" align="center" gap="xs">
                        {col.name}
                        <Text size="xs" fw={400}>
                          ({col.type})
                        </Text>
                      </Flex>
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((row, i) => (
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
