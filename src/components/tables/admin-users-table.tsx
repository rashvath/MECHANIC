"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAdminUsers, getAdminToken, type ApiAdminUser } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AdminUsersTable() {
  const token = getAdminToken();
  const [users, setUsers] = useState<ApiAdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(token ? "" : "Admin login required.");

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchAdminUsers(token)
      .then((data) => {
        setUsers(data);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load users";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return users;
    return users.filter((user) => user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
  }, [query, users]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search users" className="max-w-xs" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">Loading users...</CardContent>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">{error}</CardContent>
        </Card>
      ) : null}

      {!loading && !error && filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">No users found.</CardContent>
        </Card>
      ) : null}

      {!loading && !error && filteredUsers.length > 0 ? (
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.totalBookings}</TableCell>
                  <TableCell><Badge variant={user.status === "active" ? "success" : "neutral"}>{user.status}</Badge></TableCell>
                  <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      ) : null}

      {!loading && !error && filteredUsers.length > 0 ? (
      <div className="space-y-3 md:hidden">
        {filteredUsers.map((user) => (
          <Card key={user._id}>
            <CardContent className="space-y-2 p-4 text-sm">
              <p className="font-semibold">{user.name}</p>
              <p>{user.email}</p>
              <p>Bookings: {user.totalBookings}</p>
              <Badge variant={user.status === "active" ? "success" : "neutral"}>{user.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      ) : null}

      {!loading && !error ? (
        <div className="text-sm text-[var(--muted-foreground)]">Total users: {filteredUsers.length}</div>
      ) : null}
    </div>
  );
}
