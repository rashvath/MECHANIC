import Link from "next/link";
import { mechanics } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AdminMechanicsTable() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mechanic</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Jobs Completed</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mechanics.map((mechanic) => (
              <TableRow key={mechanic.id}>
                <TableCell className="font-medium">{mechanic.name}</TableCell>
                <TableCell>{mechanic.phone}</TableCell>
                <TableCell>{mechanic.location}</TableCell>
                <TableCell>{mechanic.rating}</TableCell>
                <TableCell>{mechanic.jobsCompleted}</TableCell>
                <TableCell><Badge variant={mechanic.availability ? "success" : "neutral"}>{mechanic.availability ? "Available" : "Offline"}</Badge></TableCell>
                <TableCell><Badge>Approved</Badge></TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="secondary" asChild><Link href={`/admin/mechanics/${mechanic.id}`}>View</Link></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
