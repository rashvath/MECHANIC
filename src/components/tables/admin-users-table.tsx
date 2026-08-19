import { bikes } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const users = [
  { name: "Rahul Shetty", phone: "+91 98450 12345", email: "rahul@example.com", bikes: 2, totalBookings: 14, status: "Active", joined: "Jan 2025" },
  { name: "Sneha M", phone: "+91 99876 56789", email: "sneha@example.com", bikes: 1, totalBookings: 6, status: "Active", joined: "Mar 2025" },
  { name: "Akash P", phone: "+91 98812 44556", email: "akash@example.com", bikes: 1, totalBookings: 4, status: "Inactive", joined: "Nov 2024" },
];

export function AdminUsersTable() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search users" className="max-w-xs" />
        <Button variant="secondary">Active Only</Button>
      </div>

      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Bikes</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.bikes}</TableCell>
                  <TableCell>{user.totalBookings}</TableCell>
                  <TableCell><Badge variant={user.status === "Active" ? "success" : "neutral"}>{user.status}</Badge></TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell className="space-x-2"><Button size="sm" variant="secondary">View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <Card key={user.email}>
            <CardContent className="space-y-2 p-4 text-sm">
              <p className="font-semibold">{user.name}</p>
              <p>{user.phone} · {user.email}</p>
              <p>Bikes: {user.bikes} · Bookings: {user.totalBookings}</p>
              <Badge variant={user.status === "Active" ? "success" : "neutral"}>{user.status}</Badge>
              <div className="flex gap-2"><Button size="sm" variant="secondary">View</Button></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-[var(--muted-foreground)]">Page 1 of 8 · Total bikes indexed: {bikes.length}</div>
    </div>
  );
}
