import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { IssueQuery, columnNames } from "./IssueTable";
import { Callout, Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<IssueQuery>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const statuses = Object.values(Status);
  const status =
    resolvedSearchParams?.status && statuses.includes(resolvedSearchParams.status)
      ? resolvedSearchParams.status
      : undefined;
  const where = { status };

  const orderBy =
    resolvedSearchParams?.orderBy && columnNames.includes(resolvedSearchParams.orderBy)
      ? { [resolvedSearchParams.orderBy]: "asc" as const }
      : undefined;

  const page = parseInt(resolvedSearchParams?.page || "1", 10) || 1;
  const pageSize = 10;

  let issues: Awaited<ReturnType<typeof prisma.issue.findMany>> = [];
  let issueCount = 0;
  let dbError: string | null = null;

  try {
    [issues, issueCount] = await Promise.all([
      prisma.issue.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.issue.count({ where }),
    ]);
  } catch (err) {
    console.error("[IssuesPage] Database error:", err);
    dbError = "Could not connect to the database. Check your DATABASE_URL and ensure MySQL is running.";
  }

  return (
    <Flex direction="column" gap="3">
      {dbError && (
        <Callout.Root color="red">
          <Callout.Text>⚠ {dbError}</Callout.Text>
        </Callout.Root>
      )}
      <IssueActions />
      <IssueTable searchParams={resolvedSearchParams || {}} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker Pro - Issue List",
  description: "View and filter all project issues",
};

export default IssuesPage;
