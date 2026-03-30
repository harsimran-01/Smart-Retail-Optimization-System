import { useEffect, useState } from "react";
import { api, type Product, type SaleEntry } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function Sales() {
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const load = () => {
    api.getSales().then(setSales);
    api.getProducts().then(setProducts);
  };
  useEffect(() => { load(); }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleAddSale = async () => {
    if (!selectedProduct) { toast.error("Select a product"); return; }
    if (quantity <= 0) { toast.error("Quantity must be positive"); return; }
    if (quantity > selectedProduct.stock) { toast.error("Not enough stock"); return; }

    // await api.addSale({
    //   date: new Date().toISOString().split("T")[0],
    //   productId: selectedProduct.id,
    //   productName: selectedProduct.name,
    //   quantity,
    //   revenue: quantity * selectedProduct.price,
    // });
    await api.addSale({
  date: new Date().toISOString().split("T")[0],
  productId: selectedProduct.id,
  quantity,
});
    toast.success("Sale recorded");
    setSelectedProductId("");
    setQuantity(1);
    load();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sales Entry</h1>
        <p className="text-sm text-muted-foreground mt-1">Record daily sales transactions</p>
      </div>

      {/* Quick Entry */}
      <div className="glass-card-elevated p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">New Sale</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Label>Product</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} (stock: {p.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-32">
            <Label>Quantity</Label>
            <Input type="number" min={1} value={quantity} onChange={e => setQuantity(+e.target.value)} />
          </div>
          <div className="w-32">
            <Label>Total</Label>
            <p className="text-lg font-semibold text-foreground h-10 flex items-center">
              ${selectedProduct ? (selectedProduct.price * quantity).toFixed(2) : "0.00"}
            </p>
          </div>
          <Button onClick={handleAddSale} className="gap-2">
            <Plus className="w-4 h-4" /> Record Sale
          </Button>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="glass-card-elevated">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Recent Sales</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map(s => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground">{s.date}</TableCell>
                <TableCell className="font-medium">{s.productName}</TableCell>
                <TableCell className="text-right">{s.quantity}</TableCell>
                <TableCell className="text-right font-medium">${s.revenue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
