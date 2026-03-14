"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";

export function useUsers() {
  const { fetchWithAuth } = useApiClient();

  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchWithAuth('/users'),
  });
}
