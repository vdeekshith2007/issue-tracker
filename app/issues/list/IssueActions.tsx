import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import IssueStatusFilter from "./IssueStatusFilter";
import IssuePriorityFilter from "./IssuePriorityFilter";
import { PlusIcon } from "@radix-ui/react-icons";

const IssueActions = () => {
  return (
    <Flex justify="between" align="center" wrap="wrap" gap="3">
      <Flex gap="3" align="center">
        <IssueStatusFilter />
        <IssuePriorityFilter />
      </Flex>
      <Button>
        <Link href="/issues/new" className="flex items-center gap-1">
          <PlusIcon /> New Issue
        </Link>
      </Button>
    </Flex>
  );
};

export default IssueActions;
