import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Vault, TrendingUp, Users, DollarSign } from 'lucide-react';

interface VaultInfo {
  id: string;
  name: string;
  tvl: string;
  apy: string;
  users: number;
  status: 'active' | 'paused' | 'deprecated';
}

interface VaultSelectorProps {
  vaultList?: VaultInfo[];
  onVaultChange?: (vault: VaultInfo) => void;
}

export default function VaultSelector({ vaultList, onVaultChange }: VaultSelectorProps) {
  const [selectedVault, setSelectedVault] = useState<VaultInfo | null>(null);

  const handleVaultChange = (vaultId: string) => {
    const vault = vaultList.find(v => v.id === vaultId);
    if (vault) {
      setSelectedVault(vault);
      onVaultChange?.(vault);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success-foreground border-success/30">Active</Badge>;
      case 'paused':
        return <Badge className="bg-warning/20 text-warning-foreground border-warning/30">Paused</Badge>;
      case 'deprecated':
        return <Badge variant="destructive">Deprecated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Vault className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Vault Selection</h2>
          <p className="text-sm text-muted-foreground">Choose a vault to manage requests</p>
        </div>
      </div>

      <div className="space-y-4">
        <Select onValueChange={handleVaultChange}>
          <SelectTrigger className="bg-vault-bg border-primary/30">
            <SelectValue placeholder="Select a vault to manage" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/30">
            {vaultList.map((vault) => (
              <SelectItem key={vault.id} value={vault.id} className="focus:bg-primary/10">
                <div className="flex items-center gap-3 w-full">
                  <Vault className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{vault.name}</div>
                    <div className="text-xs text-muted-foreground">TVL: {vault.tvl}</div>
                  </div>
                  {getStatusBadge(vault.status)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedVault && (
          <div className="p-4 rounded-lg bg-vault-bg border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{selectedVault.name}</h3>
              {getStatusBadge(selectedVault.status)}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-accent mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">TVL</span>
                </div>
                <p className="text-lg font-bold">{selectedVault.tvl}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-success mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">APY</span>
                </div>
                <p className="text-lg font-bold text-success">{selectedVault.apy}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Users</span>
                </div>
                <p className="text-lg font-bold">{selectedVault.users}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}