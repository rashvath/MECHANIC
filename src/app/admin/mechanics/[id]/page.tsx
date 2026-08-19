import { Card, CardContent } from "@/components/ui/card";

export default async function AdminMechanicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Card>
      <CardContent className="space-y-2 p-5 text-sm">
        <h1 className="font-heading text-xl font-semibold">Mechanic Detail: {id}</h1>
        <p>Profile, documents, service areas, skills, ratings, completed jobs, earnings, availability.</p>
      </CardContent>
    </Card>
  );
}
