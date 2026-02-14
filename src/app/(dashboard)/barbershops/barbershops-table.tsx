import Link from "next/link";
import { Barbershop } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BarbershopWithCount = Barbershop & { _count: { users: number } };

export function BarbershopsTable({ barbershops }: { barbershops: BarbershopWithCount[] }) {
  if (barbershops.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        Nenhuma barbearia encontrada.
      </p>
    );
  }
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Nome</th>
            <th className="text-left p-3 font-medium">Slug</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Plano</th>
            <th className="text-left p-3 font-medium">Usuários</th>
            <th className="text-right p-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {barbershops.map((b) => (
            <tr key={b.id} className="border-t hover:bg-muted/30">
              <td className="p-3 font-medium">
                <Link href={`/barbershops/${b.id}`} className="hover:underline">
                  {b.name}
                </Link>
              </td>
              <td className="p-3 text-muted-foreground">{b.slug}</td>
              <td className="p-3">
                <Badge variant={b.status === "active" ? "default" : "secondary"}>
                  {b.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </td>
              <td className="p-3 capitalize">{b.plan}</td>
              <td className="p-3">{b._count.users}</td>
              <td className="p-3 text-right">
                <Link
                  href={`/barbershops/${b.id}`}
                  className="text-primary hover:underline"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
