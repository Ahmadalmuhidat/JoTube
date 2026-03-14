"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useApiClient() {
  const { getToken } = useAuth();

  const fetchWithAuth = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
  }, [getToken]);

  return { fetchWithAuth };
}
