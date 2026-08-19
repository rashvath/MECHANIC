import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ServiceForm() {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <h2 className="font-heading text-lg font-semibold">Service Management</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Service name" />
          <Input placeholder="Category" />
          <Input placeholder="Price" />
          <Input placeholder="Duration" />
        </div>
        <Textarea placeholder="Description" />
        <Textarea placeholder="Included items" />
        <div className="flex flex-wrap gap-2">
          <Button>Add</Button>
          <Button variant="secondary">Edit</Button>
          <Button variant="secondary">Duplicate</Button>
          <Button variant="secondary">Disable</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
}
