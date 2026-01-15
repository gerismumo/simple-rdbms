"use client";

import { useState } from "react";
import {
  Card,
  Textarea,
  Button,
  Stack,
  Table,
  Text,
  Group,
  Badge,
  Paper,
  Code,
  Box,
  Alert,
} from "@mantine/core";
import { IconInfoCircle, IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import { useAppStore } from "../../store/useAppStore";
import { queriesApi } from "../../lib/api/queries";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function QueryConsole() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { currentDatabase, loading, setLoading } = useAppStore();
  const router = useRouter();

  const executeQuery = async () => {
    if (!query.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }

    if (!currentDatabase) {
      toast.error("Please select a database first");

      return;
    }

    setLoading("query", true);
    try {
      const response = await queriesApi.execute(query, currentDatabase);

      if (response.success) {
        setResult(response.data);
        setHistory((prev) => [query, ...prev].slice(0, 10));

        toast.success(response.message || "Query executed successfully");

        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to execute query");

      setResult({ error: error.message || "Query failed" });
    } finally {
      setLoading("query", false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setQuery("");
  };

  const loadFromHistory = (historicalQuery: string) => {
    setQuery(historicalQuery);
  };

  return (
    <Stack gap="md">
      <Alert
        variant="light"
        color="blue"
        title="Alert"
        icon={<IconInfoCircle />}
      >
        Select or Create database on the sidebar to execute queries
      </Alert>
      <Card withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="lg" fw={600}>
              SQL Console
            </Text>
            {currentDatabase && (
              <Badge color="blue" variant="light">
                {currentDatabase}
              </Badge>
            )}
          </Group>

          <Textarea
            placeholder="Enter your SQL query here...
             Example: SELECT * FROM users WHERE id = 1"
            minRows={6}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            styles={{
              input: {
                fontFamily: "monospace",
                fontSize: "14px",
              },
            }}
          />

          <Group>
            <Button
              leftSection={<IconPlayerPlay size={16} />}
              onClick={executeQuery}
              loading={loading.query}
              disabled={!currentDatabase}
            >
              Execute
            </Button>
            <Button
              variant="light"
              color="gray"
              leftSection={<IconTrash size={16} />}
              onClick={clearResults}
            >
              Clear
            </Button>
          </Group>
        </Stack>
      </Card>
      {result && (
        <Card withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="lg" fw={600}>
                Results
              </Text>
              {result.rowCount !== undefined && (
                <Badge color="green" variant="light">
                  {result.rowCount} row{result.rowCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </Group>

            {result.error ? (
              <Paper p="md" withBorder bg="red.0">
                <Code color="red" block>
                  {result.error}
                </Code>
              </Paper>
            ) : result.rows && result.rows.length > 0 ? (
              <Box style={{ overflowX: "auto" }}>
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      {Object.keys(result.rows[0]).map((key) => (
                        <Table.Th key={key}>{key}</Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {result.rows.map((row: any, idx: number) => (
                      <Table.Tr key={idx}>
                        {Object.values(row).map(
                          (value: any, cellIdx: number) => (
                            <Table.Td key={cellIdx}>
                              {value === null ? (
                                <Text c="dimmed" fs="italic">
                                  NULL
                                </Text>
                              ) : typeof value === "boolean" ? (
                                <Badge
                                  color={value ? "green" : "red"}
                                  size="sm"
                                >
                                  {value.toString()}
                                </Badge>
                              ) : (
                                String(value)
                              )}
                            </Table.Td>
                          )
                        )}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>
            ) : (
              <Paper p="md" withBorder bg="gray.0">
                <Text c="dimmed" ta="center">
                  {result.rowCount === 0
                    ? "No rows returned"
                    : "Query executed successfully"}
                </Text>
              </Paper>
            )}
          </Stack>
        </Card>
      )}

      {history.length > 0 && (
        <Card withBorder>
          <Stack gap="md">
            <Text size="lg" fw={600}>
              Recent Queries
            </Text>
            <Stack gap="xs">
              {history.map((q, idx) => (
                <Paper
                  key={idx}
                  p="sm"
                  withBorder
                  style={{ cursor: "pointer" }}
                  onClick={() => loadFromHistory(q)}
                >
                  <Code block style={{ fontSize: "12px" }}>
                    {q}
                  </Code>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Card>
      )}
      <Card withBorder bg="gray.0">
        <Stack gap="sm">
          <Text size="sm" fw={600}>
            SQL Examples
          </Text>
          <Stack gap="xs">
            <Code block style={{ fontSize: "12px" }}>
              -- Create table{"\n"}
              CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR(100),
              email VARCHAR(255) UNIQUE);
            </Code>
            <Code block style={{ fontSize: "12px" }}>
              -- Select all rows{"\n"}
              SELECT * FROM users;
            </Code>
            <Code block style={{ fontSize: "12px" }}>
              -- Insert new row{"\n"}
              INSERT INTO users (name, email) VALUES ('Alice',
              'alice@example.com');
            </Code>
            <Code block style={{ fontSize: "12px" }}>
              -- Update rows{"\n"}
              UPDATE users SET name = 'Bob' WHERE id = 1;
            </Code>
            <Code block style={{ fontSize: "12px" }}>
              -- Delete rows{"\n"}
              DELETE FROM users WHERE id = 1;
            </Code>
            <Code block style={{ fontSize: "12px" }}>
              -- Join tables{"\n"}
              SELECT users.name, orders.amount{"\n"}
              FROM users{"\n"}
              INNER JOIN orders ON users.id = orders.user_id;
            </Code>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
