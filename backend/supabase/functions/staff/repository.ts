import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import type { CapabilityDescription, StaffRepository } from "./types.ts";

export function createStaffRepository(client: SupabaseClient): StaffRepository {
  return {
    async describeCapabilities(names: string[]): Promise<CapabilityDescription[]> {
      if (names.length === 0) return [];
      const { data, error } = await client
        .from("staff_capabilities")
        .select("name, description")
        .in("name", names)
        .order("name");
      if (error) throw error;
      return (data ?? []) as CapabilityDescription[];
    },
  };
}
