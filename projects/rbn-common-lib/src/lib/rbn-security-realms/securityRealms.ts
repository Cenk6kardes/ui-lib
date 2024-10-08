export interface SecurityRealms {
  name: string;
  type: string;
  sequence: number;
  properties?: [
    {
      keypair_attribute: string;
      keypair_value: string;
    }
  ];
  enabled: boolean | string;
}
