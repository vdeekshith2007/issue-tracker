import prisma from '@/prisma/client';
import { Avatar, Card, Flex, Heading, Table, Text } from '@radix-ui/themes';
import React from 'react';
import { IssueStatusBadge } from './components';
import Link from 'next/link';

const LatestIssues = async () => {
  let issues: Awaited<ReturnType<typeof prisma.issue.findMany<{ include: { assignedToUser: true } }>>> = [];

  try {
    issues = await prisma.issue.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        assignedToUser: true,
      },
    });
  } catch (err) {
    console.error("[LatestIssues] Database error:", err);
    return (
      <Card>
        <Heading size="4" mb="3">Latest Issues</Heading>
        <Text size="2" color="gray">Could not load issues — database connection failed.</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Heading size="4" mb="5">Latest Issues</Heading>
      {issues.length === 0 ? (
        <Text size="2" color="gray">No issues yet. Create your first issue to get started.</Text>
      ) : (
        <Table.Root>
          <Table.Body>
            {issues.map((issue) => (
              <Table.Row key={issue.id}>
                <Table.Cell>
                  <Flex justify="between">
                    <Flex direction="column" align="start" gap="2">
                      <Link href={`/issues/${issue.id}`} className="font-medium hover:underline">
                        {issue.title}
                      </Link>
                      <IssueStatusBadge status={issue.status} />
                    </Flex>
                    {issue.assignedToUser && (
                      <Avatar
                        src={issue.assignedToUser.image ?? undefined}
                        fallback={issue.assignedToUser.name?.charAt(0) ?? '?'}
                        size="2"
                        radius="full"
                      />
                    )}
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Card>
  );
};

export default LatestIssues;
