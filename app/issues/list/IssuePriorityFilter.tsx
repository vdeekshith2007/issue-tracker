"use client";

import { Priority } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const priorities: { label: string; value: Priority | "ALL" }[] = [
  { label: "All Priorities", value: "ALL" },
  { label: "🚨 Critical / Urgent", value: "URGENT" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

const IssuePriorityFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select.Root
      defaultValue={searchParams.get("priority") || "ALL"}
      onValueChange={(priority) => {
        const params = new URLSearchParams();
        if (searchParams.get("status")) {
          params.append("status", searchParams.get("status")!);
        }
        if (priority && priority !== "ALL") {
          params.append("priority", priority);
        }
        if (searchParams.get("orderBy")) {
          params.append("orderBy", searchParams.get("orderBy")!);
        }

        const query = params.size ? "?" + params.toString() : "";
        router.push("/issues/list" + query);
      }}
    >
      <Select.Trigger placeholder="Filter by priority..." />
      <Select.Content>
        {priorities.map((item) => (
          <Select.Item key={item.value} value={item.value}>
            {item.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssuePriorityFilter;
