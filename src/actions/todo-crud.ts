"use server";

import { count, eq, gt } from "drizzle-orm";
import { db } from "~/db";
import { todos } from "~/db/schema";

const addTodo = async () =>
  await db.insert(todos).values({
    title: "Test Todo 1",
    description: "Test Description 1",
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

const getAll = async (lastPageTodoId: number = 0) =>
  await db
    .select({
      id: todos.id,
      title: todos.title,
      description: todos.description,
    })
    .from(todos)
    .where(gt(todos.pagination_id, lastPageTodoId))
    .limit(5)
    .execute();

const getTotal = async () => await db.select({ count: count() }).from(todos);

export { addTodo, updateTodo, getAll, getTotal };
