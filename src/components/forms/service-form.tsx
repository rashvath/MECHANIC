"use client";

import { useEffect, useState } from "react";
import { createService, deleteService, fetchServices, getAdminToken, updateService, type ApiService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function parseDescriptionPoints(description: string) {
  return description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s*/, ""));
}

function buildDescription(points: string[]) {
  return points
    .map((point) => point.trim())
    .filter(Boolean)
    .map((point) => `- ${point}`)
    .join("\n");
}

export function ServiceForm() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [includedPoints, setIncludedPoints] = useState<string[]>([""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data))
      .catch((error: unknown) => {
        const err = error instanceof Error ? error.message : "Unable to load services";
        setMessage(err);
      });
  }, []);

  function resetForm() {
    setName("");
    setPrice("");
    setIncludedPoints([""]);
    setSelectedId("");
  }

  function loadService(service: ApiService) {
    setSelectedId(service._id);
    setName(service.name);
    setPrice(String(service.startingPrice));
    const points = parseDescriptionPoints(service.description);
    setIncludedPoints(points.length > 0 ? points : [""]);
  }

  function updatePoint(index: number, value: string) {
    setIncludedPoints((curr) => curr.map((point, idx) => (idx === index ? value : point)));
  }

  function addPoint() {
    setIncludedPoints((curr) => [...curr, ""]);
  }

  function removePoint(index: number) {
    setIncludedPoints((curr) => {
      const next = curr.filter((_point, idx) => idx !== index);
      return next.length > 0 ? next : [""];
    });
  }

  function validateFields() {
    const description = buildDescription(includedPoints);

    if (!name || !price || !description) {
      setMessage("Please fill all required fields.");
      return false;
    }

    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      setMessage("Price must be a valid number greater than 0.");
      return false;
    }

    return true;
  }

  function handleAdd() {
    setMessage("");
    if (!validateFields()) return;
    const token = getAdminToken();
    if (!token) {
      setMessage("Admin login required.");
      return;
    }

    setLoading(true);
    createService({ name, description: buildDescription(includedPoints), startingPrice: Number(price) }, token)
      .then((newService) => {
        setServices((curr) => [newService, ...curr]);
        setMessage("Service package added successfully.");
        loadService(newService);
      })
      .catch((error: unknown) => {
        const err = error instanceof Error ? error.message : "Unable to add service";
        setMessage(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleUpdate() {
    setMessage("");
    if (!selectedId) {
      setMessage("Select a service card first to update.");
      return;
    }

    if (!validateFields()) return;

    const token = getAdminToken();
    if (!token) {
      setMessage("Admin login required.");
      return;
    }

    setLoading(true);
    updateService(selectedId, { name, description: buildDescription(includedPoints), startingPrice: Number(price) }, token)
      .then((updated) => {
        setServices((curr) => curr.map((service) => (service._id === selectedId ? updated : service)));
        setMessage("Service package updated successfully.");
      })
      .catch((error: unknown) => {
        const err = error instanceof Error ? error.message : "Unable to update service";
        setMessage(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDelete() {
    if (!selectedId) {
      setMessage("Select a service card first to delete.");
      return;
    }

    const token = getAdminToken();
    if (!token) {
      setMessage("Admin login required.");
      return;
    }

    setLoading(true);
    deleteService(selectedId, token)
      .then(() => {
        setServices((curr) => curr.filter((service) => service._id !== selectedId));
        setMessage("Service disabled.");
        resetForm();
      })
      .catch((error: unknown) => {
        const err = error instanceof Error ? error.message : "Unable to delete service";
        setMessage(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Card className="border-[#3c2d1d]">
      <CardContent className="space-y-4 p-5">
        <h2 className="font-heading text-lg font-semibold">Service Management</h2>
        <p className="text-sm text-(--muted-foreground)">Create package cards with included services and one final amount.</p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <button
              key={service._id}
              type="button"
              onClick={() => loadService(service)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedId === service._id ? "border-(--primary) bg-(--primary-soft)" : "border-(--border)"
              }`}
            >
              <p className="font-semibold text-base">{service.name}</p>
              <p className="mt-2 text-xl font-bold">₹{service.startingPrice}</p>
              <div className="mt-3 space-y-1">
                {parseDescriptionPoints(service.description).slice(0, 5).map((point, index) => (
                  <p key={`${service._id}-${index}`} className="text-xs text-(--muted-foreground)">• {point}</p>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Package name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input type="number" min={1} placeholder="Final amount" value={price} onChange={(event) => setPrice(event.target.value)} />
        </div>

        <div className="space-y-2 rounded-xl border border-(--border) p-3">
          <p className="text-sm font-medium">Included Services</p>
          {includedPoints.map((point, index) => (
            <div key={`point-${index}`} className="flex gap-2">
              <Input
                placeholder={`Point ${index + 1}`}
                value={point}
                onChange={(event) => updatePoint(index, event.target.value)}
              />
              <Button type="button" variant="ghost" onClick={() => removePoint(index)} disabled={loading}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addPoint} disabled={loading}>Add Point</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleAdd} disabled={loading}>Add</Button>
          <Button type="button" variant="secondary" onClick={handleUpdate} disabled={loading}>Update</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button>
          <Button type="button" variant="ghost" onClick={resetForm} disabled={loading}>Clear</Button>
        </div>

        {message ? <p className="text-sm text-(--muted-foreground)">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
