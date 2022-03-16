export const userSchema = {
  name: "users",
  title: "Users",
  type: "document",
  fields: [
    {
      name: "wallet_address",
      title: "Wallet Address",
      type: "string",
    },
    {
      name: "username",
      title: "User Name",
      type: "string",
    },
    {
      name: "transactions",
      title: "Transactions",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "transactions" }],
        },
      ],
    },
  ],
};
