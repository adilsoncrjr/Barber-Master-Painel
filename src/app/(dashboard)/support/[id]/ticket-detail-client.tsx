"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";

type Message = {
  id: string;
  authorType: string;
  message: string;
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em progresso",
  waiting_customer: "Aguardando cliente",
  closed: "Fechado",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export function TicketDetailClient({
  ticketId,
  initialMessages,
  status: initialStatus,
  priority: initialPriority,
}: {
  ticketId: string;
  initialMessages: Message[];
  status: string;
  priority: string;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState(initialPriority);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  async function handleSend() {
    const msg = reply.trim();
    if (!msg || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json().catch(() => ({} as { id?: string; createdAt?: string }));

      if (!res.ok) {
        alert(data?.error ?? "Erro ao enviar mensagem.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.id ?? String(Date.now()),
          authorType: "HUB",
          message: msg,
          createdAt: data.createdAt ?? new Date().toISOString(),
        },
      ]);
      setReply("");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao enviar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handlePriorityChange(newPriority: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (res.ok) {
        setPriority(newPriority);
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Status:</span>
          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={loading}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["open", "in_progress", "waiting_customer", "closed"] as const).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Prioridade:</span>
          <Select
            value={priority}
            onValueChange={handlePriorityChange}
            disabled={loading}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["low", "medium", "high", "urgent"] as const).map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_LABEL[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-h-[400px] space-y-4 overflow-y-auto rounded-lg border bg-muted/20 p-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            Nenhuma mensagem ainda.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.authorType === "HUB" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  m.authorType === "HUB"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{m.message}</p>
                <p
                  className={`mt-1 text-xs ${
                    m.authorType === "HUB"
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {m.authorType === "HUB" ? "Hub" : "Barbearia"} • {formatDate(m.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {status !== "closed" && (
        <div className="flex gap-2">
          <Input
            placeholder="Responder ao ticket..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!reply.trim() || loading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
