export const poolManager_abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "escrow_",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "vaultFactory_",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "trancheFactory_",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "investmentManager_",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint128",
          "name": "assetId",
          "type": "uint128"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        }
      ],
      "name": "AddAsset",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        }
      ],
      "name": "AddPool",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "bytes16",
          "name": "trancheId",
          "type": "bytes16"
        }
      ],
      "name": "AddTranche",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        }
      ],
      "name": "AllowAsset",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "Deny",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "bytes16",
          "name": "trancheId",
          "type": "bytes16"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "tranche",
          "type": "address"
        }
      ],
      "name": "DeployTranche",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "bytes16",
          "name": "trancheId",
          "type": "bytes16"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "vault",
          "type": "address"
        }
      ],
      "name": "DeployVault",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        }
      ],
      "name": "DisallowAsset",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "what",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "data",
          "type": "address"
        }
      ],
      "name": "File",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "bytes16",
          "name": "trancheId",
          "type": "bytes16"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "computedAt",
          "type": "uint64"
        }
      ],
      "name": "PriceUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "Rely",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "bytes16",
          "name": "trancheId",
          "type": "bytes16"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "vault",
          "type": "address"
        }
      ],
      "name": "RemoveVault",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "recipient",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "amount",
          "type": "uint128"
        }
      ],
      "name": "TransferAssets",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "poolId",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "bytes16",
          "name": "trancheId",
          "type": "bytes16"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum Domain",
          "name": "destinationDomain",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "destinationId",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "destinationAddress",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "amount",
          "type": "uint128"
        }
      ],
      "name": "TransferTrancheTokens",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "allowed",
          "type": "bool"
        }
      ],
      "name": "addAsset",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "assetToVaults",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "vaultId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "vaultAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "share",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "deny",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "decimals",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "timeLockPeriod",
          "type": "uint256"
        }
      ],
      "name": "deployVault",
      "outputs": [
        {
          "internalType": "address",
          "name": "vault",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "escrow",
      "outputs": [
        {
          "internalType": "contract IEscrow",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "what",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "data",
          "type": "address"
        }
      ],
      "name": "file",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVaults",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "vaultId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "vaultAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "asset",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "share",
              "type": "address"
            }
          ],
          "internalType": "struct VaultInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        }
      ],
      "name": "getVaultsByAsset",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "vaultId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "vaultAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "asset",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "share",
              "type": "address"
            }
          ],
          "internalType": "struct VaultInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "investmentManager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        }
      ],
      "name": "isAllowedAsset",
      "outputs": [
        {
          "internalType": "bool",
          "name": "allowed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextVaultId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "rely",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "trancheFactory",
      "outputs": [
        {
          "internalType": "contract ITrancheFactory",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaultId",
          "type": "uint256"
        }
      ],
      "name": "vaultAddressById",
      "outputs": [
        {
          "internalType": "address",
          "name": "vaultAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vaultFactory",
      "outputs": [
        {
          "internalType": "contract ERC7540VaultFactory",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vaults",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "vaultId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "vaultAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "share",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "wards",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]