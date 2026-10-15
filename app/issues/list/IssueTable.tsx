import { IssuePriorityBadge, IssueStatusBadge } from "@/app/components";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import NextLink from "next/link";
import { Issue, Priority, Status } from "@prisma/client";

export interface IssueQuery {
  status?: Status;
  priority?: Priority;
  orderBy?: keyof Issue;
  page?: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={String(column.value)}
              className={column.className}
            >
              <NextLink
                href={{
                  pathname: "/issues/list",
                  query: {
                    ...(searchParams.status && { status: searchParams.status }),
                    ...(searchParams.priority && { priority: searchParams.priority }),
                    orderBy: column.value,
                  },
                }}
              >
                {column.label}
              </NextLink>
              {column.value === searchParams.orderBy && (
                <ArrowUpIcon className="inline ml-1" />
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map((issue) => (
          <Table.Row key={issue.id} className="hover:bg-slate-50 transition-colors">
            <Table.Cell>
              <Link
                href={`/issues/${issue.id}`}
                className="font-medium hover:underline text-violet-700"
              >
                {issue.title}
              </Link>
              <div className="flex items-center gap-2 md:hidden mt-2">
                <IssueStatusBadge status={issue.status} />
                <IssuePriorityBadge priority={issue.priority} />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusBadge status={issue.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <IssuePriorityBadge priority={issue.priority} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell text-zinc-500">
              {new Date(issue.createdAt).toLocaleDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof Issue;
  className?: string;
}[] = [
  { label: "Issue", value: "title" },
  {
    label: "Status",
    value: "status",
    className: "hidden md:table-cell",
  },
  {
    label: "Priority",
    value: "priority",
    className: "hidden md:table-cell",
  },
  {
    label: "Created",
    value: "createdAt",
    className: "hidden md:table-cell",
  },
];

export const columnNames = columns.map((column) => column.value);

export default IssueTable;