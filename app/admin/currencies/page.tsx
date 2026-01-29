import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";

async function getCurrencies() {
  return prisma.currency.findMany({
    orderBy: { code: "asc" },
  });
}

export default async function CurrenciesPage() {
  const currencies = await getCurrencies();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Currencies</h1>
            <p className="text-muted-foreground">
              Manage supported currencies and exchange rates
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/currencies/new">
              <Plus className="size-4 mr-2" />
              Add Currency
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No currencies yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/admin/currencies/new">
                        Add your first currency
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                currencies.map((currency) => (
                  <TableRow key={currency.id}>
                    <TableCell className="font-medium">
                      {currency.code}
                    </TableCell>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell className="font-mono">
                      {currency.symbol}
                    </TableCell>
                    <TableCell>
                      {Number(currency.exchangeRate).toFixed(4)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={currency.isActive ? "default" : "secondary"}
                      >
                        {currency.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {currency.isDefault && (
                        <Badge variant="outline">Default</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/currencies/${currency.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminShell>
  );
}
