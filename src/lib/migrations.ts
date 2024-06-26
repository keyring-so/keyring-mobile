export const DB_MIGRATIONS = [
  {
    version: 1,
    up: tx => {
      tx.execute(
        `create table if not exists cards (
              card_id integer primary key,
              name text not null unique,
              selected boolean not null,
              puk text not null,
              pairing_code text not null,
              pairing_key text not null,
              pairing_index text not null
          );`,
      );
    },
  },
  {
    version: 2,
    up: tx => {
      tx.execute(
        `create table if not exists accounts (
              account_id integer primary key,
              card_id integer not null,
              chain_name text not null,
              address text not null,
              selected_account boolean
          );`,
      );
    },
  },
  {
    version: 3,
    up: tx => {
      tx.execute(
        `create table if not exists assets (
              asset_id integer primary key,
              account_id integer not null,
              token_symbol text not null,
              contract_address text not null default "",
              balance text not null default "",
              price real not null default 0.0
          );`,
      );
    },
  },
  {
    version: 4,
    up: tx => {
      tx.execute(
        `create table if not exists token_config (
              config_id integer primary key,
              chain_name text not null,
              symbol text not null,
              price_id text not null,
              decimals integer not null,
              contract text not null
          );`,
      );
    },
  },
  {
    version: 5,
    up: tx => {
      tx.execute(
        `create table if not exists transaction_history (
              chain_name text not null,
              address text not null,
              hash text not null,
              timestamp integer not null,
              status text not null,
              from_addr text not null,
              to_addr text not null,
              value text not null,
              fee text not null,
              UNIQUE(hash, address) ON CONFLICT REPLACE
          );`,
      );
    },
  },
  {
    version: 6,
    up: tx => {
      tx.execute(
        `create table if not exists token_transfer_history (
              chain_name text not null,
              address text not null,
              hash text not null,
              timestamp integer not null,
              from_addr text not null,
              to_addr text not null,
              value text not null,
              contract text not null default "",
              symbol text not null default "",
              type text not null default "",
              UNIQUE(hash, contract) ON CONFLICT REPLACE
          );`,
      );
    },
  },
  {
    version: 7,
    up: tx => {
      tx.execute(
        `CREATE UNIQUE INDEX ux_assets_token_symbol ON assets(account_id, token_symbol, contract_address);`,
      );
    },
  },
];
