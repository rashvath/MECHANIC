import { bookings } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const filters = ["All", "Assigned", "In Progress", "Completed"];

function statusVariant(status: string): "default" | "success" | "warning" | "neutral" {
  if (status.includes("Completed")) return "success";
  if (status.includes("Cancelled")) return "warning";
  if (status.includes("Pending")) return "neutral";
  return "default";
}

export function AdminBookingsTable() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => <Button key={filter} variant="secondary" size="sm">{filter}</Button>)}
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Bike</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Mechanic</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>Honda Activa 6G</TableCell>
                  <TableCell>Premium Service</TableCell>
                  <TableCell>Rajesh Kumar</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>₹{booking.amount}</TableCell>
                  <TableCell><Badge variant={statusVariant(booking.status)}>{booking.status}</Badge></TableCell>
                  <TableCell className="space-x-2"><Button size="sm" variant="secondary">View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
