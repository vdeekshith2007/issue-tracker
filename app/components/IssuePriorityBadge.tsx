import { Priority } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const priorityMap: Record<
  Priority,
  { label: string; color: "gray" | "blue" | "amber" | "red" }
> = {
  LOW: { label: "Low", color: "gray" },
  MEDIUM: { label: "Medium", color: "blue" },
  HIGH: { label: "High", color: "amber" },
  URGENT: { label: "Critical / Urgent", color: "red" },
};

const IssuePriorityBadge = ({ priority }: { priority: Priority }) => {
  const config = priorityMap[priority] || { label: priority, color: "gray" };

  return (
    <Badge
      color={config.color}
      variant={priority === "URGENT" ? "solid" : "soft"}
      radius="full"
      className={priority === "URGENT" ? "animate-pulse font-bold" : "font-medium"}
    >
      {priority === "URGENT" && <span className="mr-1">🚨</span>}
      {config.label}
    </Badge>
  );
};

export default IssuePriorityBadge;
