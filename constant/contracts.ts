/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/contracts.json`.
 */
export type Contracts = {
  "address": "3oqHGMC4cKpkMUXbpRUUjAG9RSTSRohpUco3zPBkCEvg",
  "metadata": {
    "name": "contracts",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "approveBid",
      "discriminator": [
        94,
        46,
        152,
        157,
        112,
        110,
        150,
        236
      ],
      "accounts": [
        {
          "name": "productOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "product",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  100,
                  117,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "product.maker",
                "account": "product"
              }
            ]
          }
        },
        {
          "name": "userBid",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "product"
              },
              {
                "kind": "account",
                "path": "user_bid.user",
                "account": "userBid"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "initProtocol",
      "discriminator": [
        3,
        188,
        141,
        237,
        225,
        226,
        232,
        210
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "launchProduct",
      "discriminator": [
        65,
        107,
        122,
        208,
        50,
        27,
        142,
        186
      ],
      "accounts": [
        {
          "name": "maker",
          "writable": true,
          "signer": true
        },
        {
          "name": "product",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  100,
                  117,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "maker"
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "product"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "poolAuthority"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "product"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "launchProductArgs"
            }
          }
        }
      ]
    },
    {
      "name": "rejectBid",
      "discriminator": [
        16,
        180,
        239,
        231,
        62,
        80,
        45,
        40
      ],
      "accounts": [
        {
          "name": "productOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "product",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  100,
                  117,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "productOwner"
              }
            ]
          }
        },
        {
          "name": "userBid",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "product"
              },
              {
                "kind": "account",
                "path": "user_bid.user",
                "account": "userBid"
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "product"
              }
            ]
          }
        },
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "userBidProduct",
      "discriminator": [
        86,
        179,
        82,
        153,
        4,
        85,
        114,
        191
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "product",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  100,
                  117,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "product.maker",
                "account": "product"
              }
            ]
          }
        },
        {
          "name": "userBid",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "product"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "product"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "slotsRequested",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalConfig",
      "discriminator": [
        149,
        8,
        156,
        202,
        160,
        252,
        176,
        217
      ]
    },
    {
      "name": "product",
      "discriminator": [
        102,
        76,
        55,
        251,
        38,
        73,
        224,
        229
      ]
    },
    {
      "name": "userBid",
      "discriminator": [
        13,
        209,
        228,
        159,
        155,
        166,
        149,
        53
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "zeroBidAmount",
      "msg": "Bid amount must be greater than zero"
    },
    {
      "code": 6001,
      "name": "notInBiddingPhase",
      "msg": "Product is not in bidding phase"
    },
    {
      "code": 6002,
      "name": "biddingPeriodEnded",
      "msg": "Bidding period has ended"
    },
    {
      "code": 6003,
      "name": "launchDateNotReached",
      "msg": "Launch date has not arrived yet"
    },
    {
      "code": 6004,
      "name": "bidAlreadyProcessed",
      "msg": "Bid has already been processed"
    },
    {
      "code": 6005,
      "name": "bidNotApproved",
      "msg": "Bid is not approved"
    },
    {
      "code": 6006,
      "name": "bidNotRejected",
      "msg": "Bid is not rejected"
    },
    {
      "code": 6007,
      "name": "unauthorizedAccess",
      "msg": "Only product owner can perform this action"
    },
    {
      "code": 6008,
      "name": "allSlotsFilled",
      "msg": "All IPO slots are filled"
    },
    {
      "code": 6009,
      "name": "invalidLaunchDate",
      "msg": "Invalid launch date"
    },
    {
      "code": 6010,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6011,
      "name": "tokensAlreadyClaimed",
      "msg": "Tokens already claimed"
    },
    {
      "code": 6012,
      "name": "fundsAlreadyClaimed",
      "msg": "Funds already claimed"
    },
    {
      "code": 6013,
      "name": "insufficientTokens",
      "msg": "Insufficient tokens in pool"
    },
    {
      "code": 6014,
      "name": "bidClosed",
      "msg": "Bid closed, cannot accept new bids"
    },
    {
      "code": 6015,
      "name": "invalidSlotCount",
      "msg": "Invalid number of slots requested, must be between 1 and 5"
    },
    {
      "code": 6016,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in treasury for refund"
    }
  ],
  "types": [
    {
      "name": "bidStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "approved"
          },
          {
            "name": "rejected"
          }
        ]
      }
    },
    {
      "name": "globalConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "protocolAdmin",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "launchProductArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "name": "initialDeposit",
            "type": "u64"
          },
          {
            "name": "ipoSlots",
            "type": "u32"
          },
          {
            "name": "initialTokenSupply",
            "type": "u64"
          },
          {
            "name": "launchDate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "product",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maker",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "name": "initialDeposit",
            "type": "u64"
          },
          {
            "name": "ipoSlots",
            "type": "u32"
          },
          {
            "name": "approvedBids",
            "type": "u32"
          },
          {
            "name": "totalTokenSupply",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "tokenPool",
            "type": "pubkey"
          },
          {
            "name": "launchDate",
            "type": "i64"
          },
          {
            "name": "bidCloseDate",
            "type": "i64"
          },
          {
            "name": "phase",
            "type": {
              "defined": {
                "name": "productPhase"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "fundsClaimed",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "productPhase",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "bidding"
          },
          {
            "name": "launched"
          },
          {
            "name": "completed"
          }
        ]
      }
    },
    {
      "name": "userBid",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "product",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "slotsRequested",
            "type": "u32"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "bidStatus"
              }
            }
          },
          {
            "name": "tokensClaimed",
            "type": "bool"
          },
          {
            "name": "fundsClaimed",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
