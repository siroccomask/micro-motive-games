import { randomUUID } from "node:crypto";
import {
  copyFile,
  mkdir,
  readFile,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { z } from "zod";
import type { MicroMotive } from "./types";

const evidenceSchema = z
  .object({
    situation: z.string(),
    reaction: z.string(),
    feelings: z.array(z.string()),
  })
  .strict();

const microMotiveSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    statement: z.string().min(1),
    whyItMatters: z.string(),
    boundaryConditions: z.string().optional(),
    evidence: z.array(evidenceSchema),
    createdAt: z.string().min(1),
    status: z.enum(["confirmed", "archived"]),
    derivedFrom: z.string().optional(),
  })
  .strict();

const microMotiveArraySchema = z.array(microMotiveSchema);

let operationQueue: Promise<void> = Promise.resolve();

function dataPath() {
  const configuredPath = process.env.MOTIVE_DATA_PATH?.trim();
  if (!configuredPath) {
    return join(process.cwd(), "data", "micro-motives.json");
  }

  return isAbsolute(configuredPath)
    ? configuredPath
    : resolve(process.cwd(), configuredPath);
}

async function readExisting(): Promise<MicroMotive[] | null> {
  try {
    const raw = await readFile(dataPath(), "utf8");
    return microMotiveArraySchema.parse(JSON.parse(raw));
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }
    throw error;
  }
}

async function writeAtomically(motives: MicroMotive[]) {
  const target = dataPath();
  const targetDirectory = dirname(target);
  const temporary = join(
    targetDirectory,
    `.${basename(target)}.${randomUUID()}.tmp`,
  );

  await mkdir(targetDirectory, { recursive: true });

  try {
    await copyFile(target, `${target}.bak`).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
    await writeFile(temporary, `${JSON.stringify(motives, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
    await rename(temporary, target);
  } finally {
    await unlink(temporary).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
}

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const result = operationQueue.then(operation, operation);
  operationQueue = result.then(
    (): void => undefined,
    (): void => undefined,
  );
  return result;
}

export async function listMotives(): Promise<MicroMotive[]> {
  return serialize(async () => {
    const existing = await readExisting();
    if (existing) return existing;

    const emptyCollection: MicroMotive[] = [];
    await writeAtomically(emptyCollection);
    return emptyCollection;
  });
}

export async function migrateMotives(input: unknown): Promise<{
  motives: MicroMotive[];
  migratedCount: number;
}> {
  const incoming = microMotiveArraySchema.parse(input);

  return serialize(async () => {
    const existing = await readExisting();
    if (!existing) {
      const firstRecords = incoming;
      await writeAtomically(firstRecords);
      return {
        motives: firstRecords,
        migratedCount: incoming.length,
      };
    }

    const existingById = new Map(
      existing.map((motive) => [motive.id, motive] as const),
    );
    const incomingIds = new Set(incoming.map((motive) => motive.id));
    const retained = existing.filter((motive) => !incomingIds.has(motive.id));
    const migrated = [...incoming, ...retained];
    const migratedCount = incoming.filter((motive) => {
      const current = existingById.get(motive.id);
      return !current || JSON.stringify(current) !== JSON.stringify(motive);
    }).length;

    if (JSON.stringify(migrated) === JSON.stringify(existing)) {
      return { motives: existing, migratedCount: 0 };
    }

    await writeAtomically(migrated);
    return { motives: migrated, migratedCount };
  });
}

export async function saveMotive(input: unknown): Promise<{
  motive: MicroMotive;
  motives: MicroMotive[];
}> {
  const motive = microMotiveSchema.parse(input);

  return serialize(async () => {
    const existing = (await readExisting()) ?? [];
    if (existing.some((record) => record.id === motive.id)) {
      throw new Error(`A motive with id "${motive.id}" already exists.`);
    }

    const motives = [motive, ...existing];
    await writeAtomically(motives);
    return { motive, motives };
  });
}

export async function setMotiveStatus(
  id: string,
  status: MicroMotive["status"],
): Promise<{ motive: MicroMotive; motives: MicroMotive[] }> {
  return serialize(async () => {
    const existing = (await readExisting()) ?? [];
    const index = existing.findIndex((motive) => motive.id === id);
    if (index === -1) {
      throw new Error(`No motive with id "${id}" exists.`);
    }

    const motive = { ...existing[index], status };
    const motives = existing.map((record, recordIndex) =>
      recordIndex === index ? motive : record,
    );
    await writeAtomically(motives);
    return { motive, motives };
  });
}

export function getMotiveDataPath() {
  return dataPath();
}
