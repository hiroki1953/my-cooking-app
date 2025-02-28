import { getUserGroups } from "@/lib/repositories/groupRepository";

export async function fetchUserGroups(userId: string) {
  const groups = await getUserGroups(userId);
  if (!groups.length) {
    throw new Error("No groups found");
  }
  return groups;
}
