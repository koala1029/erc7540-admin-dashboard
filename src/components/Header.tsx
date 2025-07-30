
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Moon, Sun, Wallet, LogOut, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Logo from '@/assets/Logo.png';

const Header: React.FC = () => {
  const { account, isConnected, isConnecting, connect, disconnect, chainId } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 1:
        return 'Ethereum';
      case 5:
        return 'Goerli';
      case 137:
        return 'Polygon';
      case 80001:
        return 'Mumbai';
      default:
        return `Chain ${chainId}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          {/* <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70"> */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/12">
            {/* <Shield className="h-4 w-4 text-primary-foreground" /> */}
            <img src={Logo} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Vault Admin
            </h1>
            <p className="text-xs text-muted-foreground">Decentralized Vault Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full hover:bg-muted/80 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button> */}

          {/* Wallet Connection */}
          {!isConnected ? (
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-muted/50 to-muted/30 rounded-full border border-border/50">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">{formatAddress(account!)}</span>
                {chainId && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {getNetworkName(chainId)}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={disconnect}
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
