import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Mock wallet connection - replace with actual Web3 implementation
  const connectWallet = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = '0x1234...abcd';
      setAddress(mockAddress);
      setIsConnected(true);
      setIsConnecting(false);
      onConnect?.(mockAddress);
      
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to your wallet',
      });
    }, 1500);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress('');
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard',
    });
  };

  if (isConnected) {
    return (
      <Card className="p-4 bg-gradient-card border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-success/20 text-success-foreground border-success/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyAddress}
              className="border-primary/30 hover:bg-primary/10"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/30 hover:bg-primary/10"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-primary/20 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 rounded-full bg-primary/20">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Connect Wallet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your wallet to access the admin dashboard
          </p>
        </div>
        
        <Button 
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-b-transparent mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}