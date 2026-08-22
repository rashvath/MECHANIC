"use client";

import { useEffect, useState } from "react";
import { createService, deleteService, fetchServices, getAdminToken, updateService, type ApiService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ServiceForm() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
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
    setDescription("");
    setSelectedId("");
  }

  function loadService(service: ApiService) {
    setSelectedId(service._id);
    setName(service.name);
    setPrice(String(service.startingPrice));
    setDescription(service.description);
  }

  function validateFields() {
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
    createService({ name, description, startingPrice: Number(price) }, token)
      .then((newService) => {
        setServices((curr) => [newService, ...curr]);
        setMessage("Service added successfully.");
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
    updateService(selectedId, { name, description, startingPrice: Number(price) }, token)
      .then((updated) => {
        setServices((curr) => curr.map((service) => (service._id === selectedId ? updated : service)));
        setMessage("Service updated successfully.");
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
        <p className="text-sm text-[var(--muted-foreground)]">Add, update, and delete service packages with pricing.</p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <button
              key={service._id}
              type="button"
              onClick={() => loadService(service)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedId === service._id ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)]"
              }`}
            >
              <p className="font-semibold">{service.name}</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{service.description}</p>
              <p className="mt-1 text-sm">₹{service.startingPrice}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Service name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
        </div>
        <Textarea placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleAdd} disabled={loading}>Add</Button>
          <Button type="button" variant="secondary" onClick={handleUpdate} disabled={loading}>Update</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button>
          <Button type="button" variant="ghost" onClick={resetForm} disabled={loading}>Clear</Button>
        </div>

        {message ? <p className="text-sm text-[var(--muted-foreground)]">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
