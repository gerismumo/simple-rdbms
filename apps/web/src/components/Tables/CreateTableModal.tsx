"use client";

import { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Select,
  Group,
  ActionIcon,
  NumberInput,
  Switch,
  Card,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { ColumnDefinition } from "../../types/api";
import { tablesApi } from "../../lib/api/tables";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import { useTables } from "../../lib/hook/useTable";
import { useRouter } from "next/navigation";

interface CreateTableModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateTableModal({ opened, onClose }: CreateTableModalProps) {
  const { currentDatabase } = useAppStore();
  const [loading, setLoading] = useState(false);
  const { mutate } = useTables();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      columns: [
        {
          name: "id",
          type: "INTEGER" as const,
          primaryKey: true,
          unique: false,
          nullable: false,
          maxLength: undefined,
        },
      ] as ColumnDefinition[],
    },
    validate: {
      name: (value) => (!value ? "Table name is required" : null),
      columns: {
        name: (value) => (!value ? "Column name is required" : null),
        type: (value) => (!value ? "Column type is required" : null),
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const response = await tablesApi.create({
        data: values,
        db: currentDatabase as string,
      });
      if (response.success) {
        toast.success(response.message || "Table created successfully");
        form.reset();
        mutate();
        router.refresh();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create table");
    } finally {
      setLoading(false);
    }
  };

  const addColumn = () => {
    form.insertListItem("columns", {
      name: "",
      type: "VARCHAR" as const,
      primaryKey: false,
      unique: false,
      nullable: true,
      maxLength: 255,
    });
  };

  const removeColumn = (index: number) => {
    form.removeListItem("columns", index);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create New Table"
      centered
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Table Name"
            placeholder="users"
            required
            {...form.getInputProps("name")}
          />

          <div>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Columns
              </Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={addColumn}
              >
                Add Column
              </Button>
            </Group>

            <Stack gap="xs">
              {form.values.columns.map((column, index) => (
                <Card key={index} withBorder padding="sm">
                  <Stack gap="xs">
                    <Group grow>
                      <TextInput
                        placeholder="Column name"
                        required
                        {...form.getInputProps(`columns.${index}.name`)}
                      />
                      <Select
                        placeholder="Type"
                        data={["INTEGER", "VARCHAR", "BOOLEAN", "FLOAT"]}
                        required
                        {...form.getInputProps(`columns.${index}.type`)}
                      />
                    </Group>

                    {column.type === "VARCHAR" && (
                      <NumberInput
                        label="Max Length"
                        placeholder="255"
                        min={1}
                        {...form.getInputProps(`columns.${index}.maxLength`)}
                      />
                    )}

                    <Group>
                      <Switch
                        label="Primary Key"
                        {...form.getInputProps(`columns.${index}.primaryKey`, {
                          type: "checkbox",
                        })}
                      />
                      <Switch
                        label="Unique"
                        {...form.getInputProps(`columns.${index}.unique`, {
                          type: "checkbox",
                        })}
                      />
                      <Switch
                        label="Nullable"
                        {...form.getInputProps(`columns.${index}.nullable`, {
                          type: "checkbox",
                        })}
                      />
                    </Group>

                    {form.values.columns.length > 1 && (
                      <Group justify="flex-end">
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => removeColumn(index)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          </div>

          <Button type="submit" loading={loading} fullWidth>
            Create Table
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
