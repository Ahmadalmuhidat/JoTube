"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/use-api-client";

export function useUsers() {
  const { fetchWithAuth } = useApiClient();

  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchWithAuth('/users'),
  });
}
