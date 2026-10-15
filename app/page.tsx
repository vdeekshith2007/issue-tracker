import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import IssueChart from "./IssueChart";
import { Callout, Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";

export default async function Home() {
  let open = 0;
  let inProgress = 0;
  let closed = 0;
  let urgent = 0;
  let dbError: string | null = null;

  try {
    [open, inProgress, closed, urgent] = await Promise.all([
      prisma.issue.count({ where: { status: "OPEN" } }),
      prisma.issue.count({ where: { status: "IN_PROGRESS" } }),
      prisma.issue.count({ where: { status: "CLOSED" } }),
      prisma.issue.count({ where: { priority: "URGENT", status: { not: "CLOSED" } } }),
    ]);
  } catch (err) {
    console.error("[Dashboard] Database error:", err);
    dbError =
      "Could not connect to the database. Check your DATABASE_URL and ensure MySQL is running.";
  }

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      {dbError && (
        <Callout.Root color="red" className="col-span-2">
          <Callout.Text>⚠ {dbError}</Callout.Text>
        </Callout.Root>
      )}
      <Flex direction="column" gap="5">
        <IssueSummary
          open={open}
          inProgress={inProgress}
          closed={closed}
          urgent={urgent}
        />
        <IssueChart open={open} inProgress={inProgress} closed={closed} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker Pro - Dashboard",
  description: "View a summary of project issues, metrics, and workload",
};
