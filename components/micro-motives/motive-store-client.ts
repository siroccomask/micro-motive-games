import type { MicroMotive } from "@/libs/motives/types";

const FILE_STORE_HEADERS = {
  "Content-Type": "application/json",
  "X-Motive-Local": "file-store",
};

type MotiveStoreResponse = {
  motive?: MicroMotive;
  motives?: MicroMotive[];
  migratedCount?: number;
  error?: string;
};

async function readResponse(response: Response): Promise<MotiveStoreResponse> {
  const data = (await response.json()) as MotiveStoreResponse;
  if (!response.ok || !data.motives) {
    throw new Error(data.error || "The motive file store did not respond.");
  }
  return data;
}

export const motiveStoreClient = {
  async migrate(motives: MicroMotive[]) {
    const response = await fetch("/api/motives", {
      method: "POST",
      headers: FILE_STORE_HEADERS,
      body: JSON.stringify({ action: "migrate", motives }),
    });
    return readResponse(response);
  },

  async save(motive: MicroMotive) {
    const response = await fetch("/api/motives", {
      method: "POST",
      headers: FILE_STORE_HEADERS,
      body: JSON.stringify({ action: "save", motive }),
    });
    return readResponse(response);
  },

  async setStatus(id: string, status: MicroMotive["status"]) {
    const response = await fetch("/api/motives", {
      method: "PATCH",
      headers: FILE_STORE_HEADERS,
      body: JSON.stringify({ id, status }),
    });
    return readResponse(response);
  },
};
