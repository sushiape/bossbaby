export interface CapabilityDescription {
  name: string;
  description: string;
}

export interface StaffAccess {
  userId: string;
  email: string | null;
  capabilities: CapabilityDescription[];
}

export interface StaffRepository {
  describeCapabilities(names: string[]): Promise<CapabilityDescription[]>;
}
