import { IssuePriorityBadge, IssueStatusBadge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

const IssueDetails = ({ issue }: { issue: Issue }) => {
  return (
    <>
      <Heading size="6">{issue.title}</Heading>
      <Flex gap="3" align="center" my="3" wrap="wrap">
        <IssueStatusBadge status={issue.status} />
        <IssuePriorityBadge priority={issue.priority} />
        <Text size="2" color="gray">
          Created on {new Date(issue.createdAt).toLocaleDateString()}
        </Text>
      </Flex>
      <Card className="prose max-w-full shadow-sm" mt="4">
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetails;
