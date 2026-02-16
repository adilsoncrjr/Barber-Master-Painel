import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admins das barbearias</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestão de administradores</CardTitle>
          <CardDescription>
            Listar admins por barbearia, resetar senha, reenviar acesso, bloquear. (Módulo em construção.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Use a página de cada barbearia para ver e gerenciar os admins dessa unidade.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
