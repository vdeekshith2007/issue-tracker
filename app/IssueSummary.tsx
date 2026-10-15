import { Status } from "@prisma/client";
import { Badge, Card, Flex, Grid, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
  urgent: number;
}

const IssueSummary = ({ open, inProgress, closed, urgent }: Props) => {
  const containers: {
    label: string;
    value: number;
    href: string;
    color?: "red" | "violet" | "green";
    isUrgent?: boolean;
  }[] = [
    {
      label: "Open Issues",
      value: open,
      href: "/issues/list?status=OPEN",
      color: "red",
    },
    {
      label: "In Progress",
      value: inProgress,
      href: "/issues/list?status=IN_PROGRESS",
      color: "violet",
    },
    {
      label: "Closed Issues",
      value: closed,
      href: "/issues/list?status=CLOSED",
      color: "green",
    },
    {
      label: "Critical / Urgent",
      value: urgent,
      href: "/issues/list?priority=URGENT",
      isUrgent: true,
    },
  ];

  return (
    <Grid columns={{ initial: "2", sm: "4" }} gap="3">
      {containers.map((container) => (
        <Card
          key={container.label}
          className={
            container.isUrgent && container.value > 0
              ? "border-red-400 bg-red-50/50 shadow-sm"
              : "shadow-sm"
          }
        >
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Link
                className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-900"
                href={container.href}
              >
                {container.label}
              </Link>
              {container.isUrgent && (
                <Badge color="red" variant="solid" radius="full" size="1">
                  Alert
                </Badge>
              )}
            </Flex>
            <Text
              size="6"
              className={
                container.isUrgent && container.value > 0
                  ? "font-extrabold text-red-600"
                  : "font-extrabold text-zinc-900"
              }
            >
              {container.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
};

export default IssueSummary;
