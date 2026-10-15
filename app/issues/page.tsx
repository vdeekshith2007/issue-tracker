import { redirect } from "next/navigation";

export default function IssuesRootPage() {
  redirect("/issues/list");
}
