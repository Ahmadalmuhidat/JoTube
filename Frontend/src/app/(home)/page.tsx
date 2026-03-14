"use client";

import { useUsers } from "@/hooks/use-users";

export default function Home() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Backend Integration Test</h1>
      <p className="mb-4 text-gray-400">Fetching users from {process.env.NEXT_PUBLIC_API_URL}/users</p>
      
      {users && users.length > 0 ? (
        <ul className="space-y-4">
          {users.map((user: any) => (
            <li key={user.id} className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 flex items-center gap-4">
              {user.image && <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />}
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-zinc-500">{user.clerkId}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-4 border border-dashed border-zinc-700 rounded-lg text-zinc-500">
          No users found in database. Try signing in to trigger a webhook sync.
        </p>
      )}
    </div>
  );
}
