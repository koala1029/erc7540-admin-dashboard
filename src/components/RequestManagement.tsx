import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowDownCircle, ArrowUpCircle, Calendar, DollarSign, Filter, Search, CheckCheck, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { eRC7540Vault_abi } from '@/abis/eRC7540Vault_abi';
import { INVESTMENT_MANAGER, RPC_PROVIDER } from '@/config/config';
import { investmentManager_abi } from '@/abis/investmentManager_abi';
import { token_abi } from '@/abis/token_abi';
import { formatDate, shortenAddress } from '@/utils/utils';
import { useWallet } from '@/contexts/WalletContext';

interface Request {
  id: string;
  type: 'deposit' | 'redeem';
  amount: string;
  status: 'pending' | 'claimable' | 'completed' | 'rejected';
  date: string;
  expiryDate: string;
  userAddress: string;
  hash?: string;
}

interface RequestManagementProps {
  vaultAddress: string;
}

interface RequestAction {
  requestId: string;
  type: "deposit" | "redeem";
}

export default function RequestManagement({ vaultAddress }: RequestManagementProps) {
  const {account, signer, chainId, provider} = useWallet();
  const [requests, setRequests] = useState<Request[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<Set<RequestAction>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const getRequests = async (vaultAddress: string) => {
    setLoading(true);
    console.log("GET requests for vault:", vaultAddress);
    const rpc_provider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER);
    const VaultContract = new ethers.Contract(vaultAddress, eRC7540Vault_abi, rpc_provider);
    const TokenContract = new ethers.Contract(await VaultContract.asset(), token_abi, rpc_provider);
    const decimals = await TokenContract.decimals();
    const symbol = await TokenContract.symbol();   
    const depositRequestCount = await VaultContract.nextDepositRequestId();
    const redeemRequestCount = await VaultContract.nextRedeemRequestId();
    const InvestmentMangerContract = new ethers.Contract(INVESTMENT_MANAGER, investmentManager_abi, rpc_provider);
    const depositReqs = depositRequestCount == 0 ? [] : await InvestmentMangerContract.getDepositRequests(vaultAddress, depositRequestCount - 1);
    const redeemReqs = redeemRequestCount == 0 ? [] : await InvestmentMangerContract.getRedeemRequests(vaultAddress, redeemRequestCount - 1);


    console.log({depositReqs}, {redeemReqs});
    let tempList: Request[] = [];
    for(let i = 0; i < depositReqs.length; i++) {
      const status: Request['status'] = depositReqs[i].claimable
        ? (depositReqs[i].processed ? 'completed' : 'claimable')
        : 'pending';
      const temp: Request = {
        id: depositReqs[i].requestId.toString(),
        type: 'deposit',
        amount: (Number(depositReqs[i].assets) / (10 **decimals)).toLocaleString() + " " + symbol,
        status,
        date: 
        formatDate(Number(depositReqs[i].requestedAt)),
        expiryDate: 
        formatDate(Number(depositReqs[i].requestedAt)+ Number(depositReqs[i].duration)),
        userAddress: depositReqs[i].controller,
        hash: ""
      };
      tempList.push(temp);
    }

     for(let i = 0; i < redeemReqs.length; i++) {
      const status: Request['status'] = redeemReqs[i].claimable
        ? (redeemReqs[i].processed ? 'completed' : 'claimable')
        : 'pending';
      const temp: Request = {
        id: redeemReqs[i].requestId.toString(),
        type: 'redeem',
        amount: (Number(redeemReqs[i].assets) / (10 **decimals)).toLocaleString() + " " + symbol,
        status,
        date: 
        formatDate(Number(redeemReqs[i].requestedAt)),
        expiryDate: 
        formatDate(Number(redeemReqs[i].requestedAt)+ Number(redeemReqs[i].duration)),
        userAddress: redeemReqs[i].controller,
        hash: ""
      };
      tempList.push(temp);
    }
    setRequests(tempList);
    setLoading(false);
  }

  useEffect(() => {
    setRequests([]);
    getRequests(vaultAddress);
  }, [vaultAddress])


  const isRequestExpired = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return today >= expiry;
  };

  const canSelectRequest = (request: Request) => {
    // Can only select requests that have expired and are not completed/rejected
    return isRequestExpired(request.expiryDate) && !['completed', 'claimable'].includes(request.status);
  };

  const getExpiredRequests = () => {
    return filteredRequests.filter(req => canSelectRequest(req));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning/20 text-warning-foreground border-warning/30">Pending</Badge>;
      case 'claimable':
        return <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Claimable</Badge>;
      case 'completed':
        return <Badge className="bg-success/20 text-success-foreground border-success/30">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getExpiryBadge = (expiryDate: string, status: string) => {
    if (['completed', 'rejected'].includes(status)) return null;
    
    const expired = isRequestExpired(expiryDate);
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (expired) {
      return <Badge className="bg-destructive/20 text-destructive-foreground border-destructive/30">Expired</Badge>;
    } else {
      return <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
        {daysUntilExpiry} days left
      </Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'deposit' ? 
      <ArrowDownCircle className="h-4 w-4 text-success" /> : 
      <ArrowUpCircle className="h-4 w-4 text-warning" />;
  };

  const handleStatusUpdate = async (requestId: string, type: 'deposit' | 'redeem') => {
    const InvestmentMangerContract = new ethers.Contract(INVESTMENT_MANAGER, investmentManager_abi, signer);
    try {
      if(type == 'deposit') {
        await InvestmentMangerContract.fulfillDepositRequest(vaultAddress, requestId);
      } else {
        await InvestmentMangerContract.fulfillRedeemRequest(vaultAddress, requestId);
      }
  
      // Update request status in local state
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId && req.type == type ? { ...req, status: 'claimable' } : req
        )
      );
      
      toast({
        title: 'Status Updated',
        description: `${type} Request ${requestId} status updated to claimable`,
      });

    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleBulkStatusUpdate = async (requestsActions: RequestAction[], newStatus: string) => {
    const depositRequestIds = requestsActions
      .filter(action => action.type === "deposit")
      .map(action => action.requestId);
    const redeemRequestIds = requestsActions
      .filter(action => action.type === "redeem")
      .map(action => action.requestId);
    console.log("Deposit Request IDs:", depositRequestIds);
    console.log("Redeem Request IDs:", redeemRequestIds);
    const InvestmentMangerContract = new ethers.Contract(INVESTMENT_MANAGER, investmentManager_abi, signer);
    try {
      const tx = await InvestmentMangerContract.fulfillRequests(
        vaultAddress, depositRequestIds, redeemRequestIds
      );
      await tx.wait();
      requestsActions.forEach(action => {
        setRequests(prev =>
          prev.map(req =>
            req.id === action.requestId && req.type == action.type ? { ...req, status: 'claimable' } : req
          )
        );
      })

      console.log("Bulk request status updated:", tx);
       toast({
        title: 'Bulk Status Updated',
        description: `${requestsActions.length} requests updated. tx: ${tx.hash}`,
      });
    } catch (error) {
      console.error("Error updating bulk request status:", error);
    }
    
    setSelectedRequests(new Set());
    
   
  };

  const isRequestSelected = (requestId: string, type: "deposit" | "redeem") => {
    return Array.from(selectedRequests).some(
      (req) => req.requestId === requestId && req.type === type
    );
  };
 
  const handleSelectRequest = (requestId: string, type: "deposit" | "redeem", checked: boolean) => {
    const request = requests.find(req => req.id === requestId && req.type === type);
    if (!request || !canSelectRequest(request)) {
      toast({
        title: 'Cannot Select Request',
        description: 'Request has not reached expiry date or is already completed/rejected',
        variant: 'destructive'
      });
      return;
    }

    const newSelected = new Set(selectedRequests);
    const reqObj = { requestId, type };
    if (checked) {
      newSelected.add(reqObj);
    } else {
      // Remove by value
      Array.from(newSelected).forEach(sel => {
        if (sel.requestId === requestId && sel.type === type) {
          newSelected.delete(sel);
        }
      });
    }
    setSelectedRequests(newSelected);
  };

  // 4. Update handleSelectAll
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableRequests = getExpiredRequests().map(req => ({ requestId: req.id, type: req.type }));
      setSelectedRequests(new Set(selectableRequests));
    } else {
      setSelectedRequests(new Set());
    }
  };

  // 5. Update getSelectedPendingRequests and getSelectedClaimableRequests
  const getSelectedPendingRequests = () => {
    return Array.from(selectedRequests).filter(sel => {
      const request = requests.find(req => req.id === sel.requestId && req.type === sel.type);
      return request?.status === 'pending';
    });
  };

  const getSelectedClaimableRequests = () => {
    return Array.from(selectedRequests).filter(sel => {
      const request = requests.find(req => req.id === sel.requestId && req.type === sel.type);
      return request?.status === 'claimable';
    });
  };


  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesType = typeFilter === 'all' || req.type === typeFilter;
    const matchesSearch = req.userAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.amount.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <Card className="bg-gradient-card border-primary/20">
      <div className="p-6 border-b border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Request Management</h2>
            <p className="text-sm text-muted-foreground">Manage deposit and redeem requests</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-vault-bg border-primary/30"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-vault-bg border-primary/30">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-primary/30">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="claimable">Claimable</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-vault-bg border-primary/30">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-primary/30">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="redeem">Redeem</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedRequests.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-vault-bg rounded-lg border border-primary/30">
            <div className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-primary" />
              <span className="font-medium">{selectedRequests.size} selected</span>
            </div>
            
            <div className="flex gap-2">
              {getSelectedPendingRequests().length > 0 && (
                <>
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary hover:shadow-hover"
                    onClick={() => handleBulkStatusUpdate(getSelectedPendingRequests(), 'claimable')}
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Approve Selected ({getSelectedPendingRequests().length})
                  </Button>
                </>
              )}
              
              {getSelectedClaimableRequests().length > 0 && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-success text-success hover:bg-success/10"
                  onClick={() => handleBulkStatusUpdate(getSelectedClaimableRequests(), 'completed')}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Complete Selected ({getSelectedClaimableRequests().length})
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedRequests(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="rounded-lg border border-primary/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20 hover:bg-request-hover">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedRequests.size === getExpiredRequests().length && getExpiredRequests().length > 0}
                    onCheckedChange={handleSelectAll}
                    disabled={getExpiredRequests().length === 0}
                  />
                </TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Expiry</TableHead>
                <TableHead className="font-semibold">User Address</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request, index) => {
                const isSelectable = canSelectRequest(request);
                return (
                  <TableRow 
                    key={index} 
                    className={`border-primary/20 hover:bg-request-hover ${!isSelectable ? 'opacity-60' : ''}`}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={isRequestSelected(request.id, request.type)}
                        onCheckedChange={(checked) => handleSelectRequest(request.id, request.type, checked as boolean)}
                        disabled={!isSelectable}
                      />
                    </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(request.type)}
                      <span className="capitalize font-medium">{request.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{request.amount}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{getExpiryBadge(request.expiryDate, request.status)}</TableCell>
                  <TableCell className="font-mono">{shortenAddress(request.userAddress)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {request.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {request.status === 'pending' && isSelectable && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-gradient-primary hover:shadow-hover"
                            onClick={() => handleStatusUpdate(request.id, request.type)}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                      {!isSelectable && !['completed', 'rejected'].includes(request.status) && (
                        <span className="text-sm text-muted-foreground">
                          Expires {request.expiryDate}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {
          loading ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 mx-auto mb-4 animate-spin border-4 border-muted-foreground border-t-transparent rounded-full" />
              <h3 className="text-lg font-semibold mb-2">Loading requests...</h3>
              <p className="text-muted-foreground">Please wait while we fetch your data</p>
            </div>
          ) : (
            filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
            )
          )
        }
      </div>
    </Card>
  );
}