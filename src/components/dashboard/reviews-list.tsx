import { reviews } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ReviewsList() {
  return (
    <div className="grid gap-3">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{review.customer}</p>
              <Badge>{review.rating} ★</Badge>
            </div>
            <p className="text-sm">{review.service} · {review.mechanic}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{review.review}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{review.date}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">View</Button>
              <Button size="sm" variant="secondary">Respond</Button>
              <Button size="sm" variant="ghost">Hide</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
