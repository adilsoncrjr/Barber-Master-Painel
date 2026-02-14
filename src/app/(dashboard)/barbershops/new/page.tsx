import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewBarbershopForm } from "./new-barbershop-form";

export const dynamic = "force-dynamic";

export default function NewBarbershopPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Nova barbearia</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dados da barbearia e do admin</CardTitle>
          <CardDescription>
            Crie a barbearia e o usuário administrador (dono) em um único passo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewBarbershopForm />
        </CardContent>
      </Card>
    </div>
  );
}
