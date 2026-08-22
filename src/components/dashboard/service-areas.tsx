"use client";

import { useEffect, useMemo, useState } from "react";
import { createAdminServiceZone, deleteAdminServiceZone, fetchAdminServiceZones, getAdminToken, type ApiServiceZone, updateAdminServiceZone } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ServiceAreas() {
  const [zones, setZones] = useState<ApiServiceZone[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeCount = useMemo(() => zones.filter((zone) => zone.isActive).length, [zones]);

  async function loadZones() {
    const token = getAdminToken();
    if (!token) {
      setError("Admin login required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminServiceZones(token);
      setZones(data);
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Unable to load service zones";
      setError(text);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadZones();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function handleCreateZone() {
    const token = getAdminToken();
    if (!token) {
      setError("Admin login required.");
      return;
    }

    const zoneName = name.trim();
    if (!zoneName) {
      setError("Service zone name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const created = await createAdminServiceZone(zoneName, token);
      setZones((current) => [created, ...current]);
      setName("");
      setMessage("Service zone added.");
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Unable to add service zone";
      setError(text);
    } finally {
      setSaving(false);
    }
  }

  async function toggleZone(zone: ApiServiceZone) {
    const token = getAdminToken();
    if (!token) {
      setError("Admin login required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const updated = await updateAdminServiceZone(zone._id, { isActive: !zone.isActive }, token);
      setZones((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      setMessage(`Zone ${updated.isActive ? "enabled" : "disabled"}.`);
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Unable to update service zone";
      setError(text);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteZone(zone: ApiServiceZone) {
    const token = getAdminToken();
    if (!token) {
      setError("Admin login required.");
      return;
    }

    const confirmed = window.confirm(`Delete service zone \"${zone.name}\"?`);
    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await deleteAdminServiceZone(zone._id, token);
      setZones((current) => current.filter((item) => item._id !== zone._id));
      setMessage("Service zone deleted.");
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Unable to delete service zone";
      setError(text);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="font-heading text-lg font-semibold">Service Area Management</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Add areas from admin and only active zones will be visible to customers.</p>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            placeholder="e.g. Koramangala"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={saving}
          />
          <Button onClick={handleCreateZone} disabled={saving}>{saving ? "Saving..." : "Add Service Zone"}</Button>
        </div>

        <p className="text-sm text-[var(--muted-foreground)]">Active zones: {activeCount} / {zones.length}</p>

        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}

        <div className="space-y-2">
          {loading ? <p className="text-sm text-[var(--muted-foreground)]">Loading service zones...</p> : null}
          {!loading && zones.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">No zones found. Add your first service zone above.</p> : null}

          {zones.map((zone) => (
            <div key={zone._id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2">
              <div>
                <p className="font-medium">{zone.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{zone.isActive ? "Visible to customers" : "Hidden from customers"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={saving}
                  onClick={() => toggleZone(zone)}
                >
                  {zone.isActive ? "Disable" : "Enable"}
                </Button>
                {!zone.isActive ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={saving}
                    onClick={() => handleDeleteZone(zone)}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
