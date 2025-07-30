import { useEffect, useState } from 'react';
import WalletConnect from '@/components/WalletConnect';
import VaultSelector from '@/components/VaultSelector';
import RequestManagement from '@/components/RequestManagement';
import Header from '@/components/Header';
import { ethers } from 'ethers';
import { token_abi } from '@/abis/token_abi';
import { eRC7540Vault_abi } from '@/abis/eRC7540Vault_abi';
import { INVESTMENT_MANAGER, POOL_MANAGER, RPC_PROVIDER } from '@/config/config';
import { investmentManager_abi } from '@/abis/InvestmentManager_abi';
import { poolManager_abi } from '@/abis/poolManager_abi';
import { useWallet } from '@/contexts/WalletContext';

interface VaultInfo {
  id: string;
  name: string;
  symbol: string;
  address: string;
  tvl: string;
  apy: string;
  users: number;
  status: 'active' | 'paused' | 'deprecated';
}

const Index = () => {
  const {account, signer, chainId, provider} = useWallet();

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState('');
  const [selectedVault, setSelectedVault] = useState<VaultInfo | null>(null);

  const [vaultList, setVaultList] = useState<VaultInfo[]>([]);
  const handleWalletConnect = (address: string) => {
    setIsWalletConnected(true);
    setConnectedAddress(address);
  };

  const handleVaultChange = (vault: VaultInfo) => {
    setSelectedVault(vault);
  };

  const getVaultList = async () => {
    try {
      const rpc_provider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER);
      
      const poolManagerContract = new ethers.Contract(POOL_MANAGER, poolManager_abi, rpc_provider);
      const investmentManagerContract = new ethers.Contract(INVESTMENT_MANAGER, investmentManager_abi, rpc_provider);

      const vaults: any[] = await poolManagerContract.getAllVaults();


      const vaultDataPromises = vaults.map(async (vault) => {
        const shareContract = new ethers.Contract(vault.share, token_abi, rpc_provider);
        const assetContract = new ethers.Contract(vault.asset, token_abi, rpc_provider);
        const vaultContract = new ethers.Contract(vault.vaultAddress, eRC7540Vault_abi, rpc_provider);
        const timeLockPeriod = await vaultContract.timeLockPeriod();


        const [name, symbol, state, decimals] = await Promise.all([
          shareContract.name(),
          shareContract.symbol(),
          investmentManagerContract.vaultStates(vault.vaultAddress),
          assetContract.decimals(),
        ]);

        return {
          id: Number(vault.vaultId).toString(),
          name: String(name),
          symbol: String(symbol),
          address: String(vault.vaultAddress),
          tvl: (Number(state.totalAssets) / (10 ** decimals)).toString(),
          apy: '10',
          users: 100,
          status: "active" as 'active', // This should be derived from the state
        };
      });

      const vaultInfos: VaultInfo[] = await Promise.all(vaultDataPromises);
      setVaultList(vaultInfos);
    } catch (error) {
      console.error("Error fetching vaults:", error);
    }
  };

  useEffect(() => { 
    getVaultList();
  }, [account, provider]);
  

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
            <>
              {/* Vault Selection */}
              <VaultSelector vaultList={vaultList} onVaultChange={handleVaultChange} />
              
              {/* Request Management */}
              {selectedVault && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-primary/30 flex-1" />
                    <div className="text-center">
                      <h2 className="text-lg font-semibold text-primary">
                        Managing: {selectedVault.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Vault requests and transactions
                      </p>
                    </div>
                    <div className="h-px bg-primary/30 flex-1" />
                  </div>
                  
                  <RequestManagement vaultAddress={selectedVault.address}/>
                </div>
              )}
              
              {/* Placeholder when no vault selected */}
              {!selectedVault && (
                <div className="text-center py-16">
                  <div className="p-4 rounded-full bg-primary/20 w-fit mx-auto mb-4">
                    <div className="h-12 w-12 bg-primary/20 rounded-full" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Select a Vault</h3>
                  <p className="text-muted-foreground">
                    Choose a vault from above to start managing requests
                  </p>
                </div>
              )}
            </>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default Index;
