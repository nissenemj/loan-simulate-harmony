
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';

interface DebtFormData {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'loan' | 'credit-card';
}

interface EnhancedDebtFormProps {
  onAddDebt: (debt: DebtFormData) => void;
}

const EnhancedDebtForm: React.FC<EnhancedDebtFormProps> = ({ onAddDebt }) => {
  const [formData, setFormData] = React.useState<DebtFormData>({
    name: '',
    balance: 0,
    interestRate: 0,
    minimumPayment: 0,
    type: 'loan'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDebt(formData);
    setFormData({
      name: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: 'loan'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lisää velka</CardTitle>
        <CardDescription>Syötä velkatiedot laskentaa varten</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Velan nimi</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Esim. Asuntolaina"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Velan tyyppi</Label>
            <Select value={formData.type} onValueChange={(value: 'loan' | 'credit-card') => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loan">Laina</SelectItem>
                <SelectItem value="credit-card">Luottokortti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="balance">Jäljellä oleva saldo (€)</Label>
            <Input
              id="balance"
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="interestRate">Korko (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="minimumPayment">Vähimmäismaksu (€)</Label>
            <Input
              id="minimumPayment"
              type="number"
              value={formData.minimumPayment}
              onChange={(e) => setFormData({ ...formData, minimumPayment: Number(e.target.value) })}
              min="0"
              step="0.01"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Lisää velka
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedDebtForm;
