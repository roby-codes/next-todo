"use server";

import { z } from "zod";

import { count, eq, desc } from "drizzle-orm";
import { db } from "~/db";
import { todos } from "~/db/schema";

import { AddTodoFormSchemaType } from "~/types/todo-form";
import { revalidatePath } from "next/cache";

const addTodo = async (values: z.infer<AddTodoFormSchemaType>) =>
  await db
    .insert(todos)
    .values({
      title: values.title,
      description: values.description,
    })
    .then(() => {
      revalidatePath("/");
      revalidatePath("/add-new");
    })
    .then(() => {
      return true;
    });

const updateTodo = async () =>
  await db
    .update(todos)
    .set({
      title: "Updated Title 2",
      description: "Updated Description 2",
    })
    .where(eq(todos.id, "18683a76-c219-4b9d-b207-6f6f127a536e"))
    .returning({
      oldTimestamp: todos.createdAt,
      newTimestamp: todos.updatedAt,
    });

const deleteTodo = async (id: string) =>
  await db
    .delete(todos)
    .where(eq(todos.id, id))
    .returning({
      deletedId: todos.id,
    })
    .then((data) => {
      revalidatePath("/");
      revalidatePath("/add-new");
      return data;
    });

const getAll = async (page: number = 1) =>
  await db
    .select({
      id: todos.id,
      title: todos.title,
      description: todos.description,
    })
    .from(todos)
    .orderBy(desc(todos.pagination_id))
    .limit(3)
    .offset((page > 0 ? page - 1 : 0) * 3)
    .execute();

const getTotal = async () => await db.select({ count: count() }).from(todos);

export { addTodo, updateTodo, deleteTodo, getAll, getTotal };
