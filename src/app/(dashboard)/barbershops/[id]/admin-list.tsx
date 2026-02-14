"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export function AdminList({
  admins,
  barbershopId,
}: {
  admins: User[];
  barbershopId: string;
}) {
  const router = useRouter();
  const [resettingId, setResettingId] = useState<string | null>(null);

  const resetPassword = async (userId: string) => {
    setResettingId(userId);
    try {
      const res = await fetch(`/api/barbershops/${barbershopId}/users/${userId}/reset-password`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.newPassword) {
        await navigator.clipboard.writeText(data.newPassword);
        alert(`Nova senha gerada e copiada: ${data.newPassword}`);
      }
      router.refresh();
    } finally {
      setResettingId(null);
    }
  };

  if (admins.length === 0) {
    return <p className="text-muted-foreground text-sm">Nenhum admin cadastrado.</p>;
  }

  return (
    <ul className="space-y-3">
      {admins.map((admin) => (
        <li
          key={admin.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <p className="font-medium">{admin.name}</p>
            <p className="text-sm text-muted-foreground">{admin.phone}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetPassword(admin.id)}
            disabled={resettingId !== null}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {resettingId === admin.id ? "…" : "Resetar senha"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
