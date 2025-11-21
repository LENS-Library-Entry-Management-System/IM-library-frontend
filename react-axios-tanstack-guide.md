# Professional React Developer Guide: Axios + TanStack Query (React + Vite)

This document provides a clean and scalable pattern for using **Axios**
and **TanStack Query** inside a **React + Vite** environment. It follows
production‑grade conventions used by professional React developers.

------------------------------------------------------------------------

## 🏗 Project Structure

A recommended folder layout:

    src/
      api/
        axios.ts
        endpoints/
          user.ts
          auth.ts
          products.ts
      hooks/
        queries/
          useUser.ts
          useProducts.ts
        mutations/
          useUpdateUser.ts
      components/
      pages/
      main.tsx

------------------------------------------------------------------------

## ⚙️ 1. Axios Setup (`src/api/axios.ts`)

Centralized Axios instance with interceptors:

``` ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized → redirect to login");
    }
    return Promise.reject(err);
  }
);
```

------------------------------------------------------------------------

## 📡 2. API Endpoints (`src/api/endpoints/user.ts`)

Each endpoint file contains pure request functions only:

``` ts
import { api } from "../axios";

export const getUser = async () => {
  const { data } = await api.get("/user");
  return data;
};

export const updateUser = async (payload: any) => {
  const { data } = await api.put("/user", payload);
  return data;
};
```

------------------------------------------------------------------------

## 🔗 3. TanStack Query Setup (`main.tsx`)

``` ts
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

------------------------------------------------------------------------

## 🔍 4. Query Hooks (`src/hooks/queries/useUser.ts`)

``` ts
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/endpoints/user";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

Using it inside a component:

``` tsx
const Profile = () => {
  const { data, isLoading, error } = useUser();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
```

------------------------------------------------------------------------

## ✏️ 5. Mutation Hooks (`src/hooks/mutations/useUpdateUser.ts`)

``` ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../api/endpoints/user";

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
```

Component usage:

``` tsx
const SettingsPage = () => {
  const { mutate } = useUpdateUser();

  const submit = () => {
    mutate({ name: "Boss" });
  };

  return <button onClick={submit}>Update</button>;
};
```

------------------------------------------------------------------------

## 🚀 Best Practices

### ✔ Keep Axios functions pure

No React imports inside `/api/endpoints`.

### ✔ Keep React Query hooks separate

Queries = GET\
Mutations = POST / PUT / DELETE

### ✔ Centralize configuration

Tokens, base URL, and interceptors stay in `axios.ts`.

### ✔ Use `queryKey` naming conventions

    ["user"]
    ["products", categoryId]
    ["cart", userId]

### ✔ Cache strategically

Use `staleTime` and `gcTime` for performance.

------------------------------------------------------------------------

## 🧪 Example `.env` for Vite

    VITE_API_URL=https://api.example.com

------------------------------------------------------------------------

## 📦 Summary

You now have: - A clean, scalable Axios setup\
- Fully typed API request functions\
- Production‑grade query + mutation hooks\
- A structure that works for large applications

------------------------------------------------------------------------

If you'd like, I can generate: - A full project template\
- The entire folder structure with real files\
- A TypeScript‑strict version
