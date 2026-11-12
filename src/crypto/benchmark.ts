/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  getCryptoSubtle,
  buildCanonicalAAD,
  uint8ArrayToBase64,
  base64ToUint8Array,
  parseVaultFileString,
} from './vault';
import {
  VaultPayload,
  MundeloVaultEnvelopeV1,
  VAULT_FORMAT_IDENTIFIER,
  VAULT_CURRENT_VERSION,
  VAULT_DEFAULT_PBKDF2_ITERATIONS,
  VAULT_MAX_FILE_BYTES,
} from './types';
import { VaultEnvelopeSchema, VaultPayloadSchema } from './schemas';
import { MOCK_PROFILE_TOMAS, MOCK_CAREGIVERS } from '../data/mockData';
import { Observation } from '../types';

export type BenchmarkScenarioId = 'SMALL' | 'MEDIUM' | 'NEAR_5MB_LIMIT';

export interface BenchmarkSampleMetrics {
  sampleIndex: number; // 0 = warm-up (cold start), 1..N = measured samples
  isWarmup: boolean;
  pbkdf2DeriveMs: number;
  aesGcmEncryptMs: number;
  aesGcmDecryptMs: number;
  zodParseValidateMs: number;
  totalRoundtripMs: number;
  maxFrameGapMs: number; // Maior intervalo entre frames ou bloqueio de event loop observado
  envelopeBytes: number;
  plaintextBytes: number;
  observationCount: number;
  success: boolean;
  errorMessage?: string;
}

export interface StatisticalSummary {
  sampleCount: number;
  smallSampleNotice: string;
  warmupMs: number;
  minMs: number;
  medianMs: number;
  meanMs: number;
  p90Ms: number;
  p95Ms: number;
  maxMs: number;
}

export interface ScenarioBenchmarkReport {
  scenarioId: BenchmarkScenarioId;
  scenarioLabel: string;
  observationCount: number;
  plaintextSizeBytes: number;
  envelopeSizeBytes: number;
  iterations: number;
  warmupSample: BenchmarkSampleMetrics;
  measuredSamples: BenchmarkSampleMetrics[];
  stats: {
    pbkdf2Derive: StatisticalSummary;
    aesGcmEncrypt: StatisticalSummary;
    aesGcmDecrypt: StatisticalSummary;
    zodParseValidate: StatisticalSummary;
    totalRoundtrip: StatisticalSummary;
    uiResponsivenessMaxGapMs: number;
  };
  failuresCount: number;
}

export interface TechnicalEnvironmentMetadata {
  timestampIso: string;
  userAgent: string;
  testerProvidedDevice: string;
  testerProvidedOs: string;
  testerProvidedBrowser: string;
  hardwareConcurrency: number | 'unavailable';
  deviceMemoryGb: number | 'unavailable';
  isSecureContext: boolean;
  webCryptoAvailable: boolean;
}

export interface FullBenchmarkExportReport {
  reportFormat: 'MUNDELO_SEC23_BENCHMARK_V1';
  containsSecretsOrPlaintext: false;
  environment: TechnicalEnvironmentMetadata;
  scenarios: ScenarioBenchmarkReport[];
}

/**
 * Calcula estatísticas descritivas (Mediana, P90, P95, Máximo) para N amostras
 */
export function computeStatistics(
  warmupValue: number,
  values: number[]
): StatisticalSummary {
  if (values.length === 0) {
    return {
      sampleCount: 0,
      smallSampleNotice: 'Sem amostras válidas coletadas.',
      warmupMs: Number(warmupValue.toFixed(2)),
      minMs: 0,
      medianMs: 0,
      meanMs: 0,
      p90Ms: 0,
      p95Ms: 0,
      maxMs: 0,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const min = sorted[0];
  const max = sorted[n - 1];
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  const mid = Math.floor(n / 2);
  const median =
    n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const p90Index = Math.min(n - 1, Math.ceil(0.9 * n) - 1);
  const p95Index = Math.min(n - 1, Math.ceil(0.95 * n) - 1);

  return {
    sampleCount: n,
    smallSampleNotice: `Amostra pequena (N=${n}); P90 e P95 representam estimativas empíricas discretas.`,
    warmupMs: Number(warmupValue.toFixed(2)),
    minMs: Number(min.toFixed(2)),
    medianMs: Number(median.toFixed(2)),
    meanMs: Number(mean.toFixed(2)),
    p90Ms: Number(sorted[p90Index].toFixed(2)),
    p95Ms: Number(sorted[p95Index].toFixed(2)),
    maxMs: Number(max.toFixed(2)),
  };
}

/**
 * Gera payload sintético determinístico para cada cenário respeitando o limite canônico de 2000 observações
 * e o limite físico de 5 MB do arquivo .mundelo-vault final.
 */
export function generateSyntheticScenarioPayload(
  scenarioId: BenchmarkScenarioId
): VaultPayload {
  let obsCount = 10;
  let paddingRepeat = 1;

  if (scenarioId === 'SMALL') {
    obsCount = 10;
    paddingRepeat = 1;
  } else if (scenarioId === 'MEDIUM') {
    obsCount = 250;
    paddingRepeat = 2;
  } else if (scenarioId === 'NEAR_5MB_LIMIT') {
    // 1.500 observações (< limite de 2.000 do schema) com texto rico ~2.1 KB por observação
    // Produz ~3.3 MB de JSON plano -> ~4.5 MB de envelope Base64 (< 5 MB limite)
    obsCount = 1500;
    paddingRepeat = 12;
  }

  const baseText =
    'Observação sintética de benchmark para validação de desempenho criptográfico na Web Crypto API. ';
  const paddedBlock = baseText.repeat(paddingRepeat);

  const observations: Observation[] = Array.from({ length: obsCount }, (_, idx) => ({
    id: `obs-bench-${scenarioId.toLowerCase()}-${idx + 1}`,
    childId: 'tomas',
    recordedByCaregiverId: 'cg-helena',
    observedByCaregiverId: 'cg-helena',
    provenance: 'DIRECT',
    occurredAt: '2026-11-12T10:00:00',
    recordedAt: '2026-11-12T10:05:00.000Z',
    revision: 1,
    environment: 'casa',
    observerRole: 'mae',
    eventType: 'descoberta',
    description: `[Amostra #${idx + 1}] ${paddedBlock}`,
    antecedents: `Contexto calmo e controlado. ${paddedBlock.slice(0, 240)}`,
    communicationSignals: 'Olhar atento, gestos tranquilos e exploração táctil.',
    supportOffered: 'Mediação silenciosa e presença disponível.',
    observedOutcome: 'Interação concluída com serenidade.',
    positiveAspects: 'Curiosidade ativa e autorregulação preservada.',
    notes: 'Dado 100% sintético gerado em memória para ensaio SEC-23.',
  }));

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    childProfile: { ...MOCK_PROFILE_TOMAS },
    observations,
    linkedCaregivers: MOCK_CAREGIVERS.filter((c) => c.linkedChildIds.includes('tomas')),
    metadata: {
      origin: 'Mundelo SEC-23 Benchmark Suite',
      description: `Cenário sintético ${scenarioId} (${obsCount} observações)`,
      isSyntheticData: true,
    },
  };
}

/**
 * Executa uma única amostra instrumentada medindo separadamente cada etapa criptográfica e de validação
 */
export async function runSingleBenchmarkSample(
  payload: VaultPayload,
  sampleIndex: number,
  isWarmup: boolean,
  iterations: number = VAULT_DEFAULT_PBKDF2_ITERATIONS
): Promise<BenchmarkSampleMetrics> {
  const ephemeralSecret = `Bench-Synthetic-Key-${sampleIndex}-${Date.now()}`;
  const subtle = getCryptoSubtle();
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const tTotalStart = performance.now();
  let frameTimerActive = true;
  let lastTick = performance.now();
  let maxFrameGapMs = 0;

  // Monitor de responsividade da thread principal
  const checkResponsiveness = () => {
    if (!frameTimerActive) return;
    const now = performance.now();
    const gap = now - lastTick;
    if (gap > maxFrameGapMs) {
      maxFrameGapMs = gap;
    }
    lastTick = now;
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(checkResponsiveness);
    }
  };

  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(checkResponsiveness);
  }

  try {
    // 1. Validação Zod de saída + Serialização
    const tZod1 = performance.now();
    const validatedOut = VaultPayloadSchema.parse(payload);
    const plaintextStr = JSON.stringify(validatedOut);
    const plaintextBytes = enc.encode(plaintextStr);
    let zodTimeMs = performance.now() - tZod1;

    // 2. Derivação de Chave PBKDF2-HMAC-SHA256
    const salt = new Uint8Array(16);
    const iv = new Uint8Array(12);
    globalThis.crypto.getRandomValues(salt);
    globalThis.crypto.getRandomValues(iv);

    const tKdfStart = performance.now();
    const baseKey = await subtle.importKey(
      'raw',
      enc.encode(ephemeralSecret),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const derivedKey = await subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations,
        hash: 'SHA-256',
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    const pbkdf2DeriveMs = performance.now() - tKdfStart;

    // 3. Cifra AES-GCM-256 (Exportação)
    const canonicalAAD = buildCanonicalAAD(
      VAULT_CURRENT_VERSION,
      validatedOut.childProfile.id
    );
    const aadBytes = enc.encode(canonicalAAD);

    const tEncStart = performance.now();
    const cipherBuffer = await subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
        additionalData: aadBytes as BufferSource,
      },
      derivedKey,
      plaintextBytes as BufferSource
    );
    const aesGcmEncryptMs = performance.now() - tEncStart;

    const cipherBytes = new Uint8Array(cipherBuffer);
    const envelope: MundeloVaultEnvelopeV1 = {
      format: VAULT_FORMAT_IDENTIFIER,
      formatVersion: 1,
      appVersion: 'v0.4A.1-bench',
      exportedAt: new Date().toISOString(),
      childId: validatedOut.childProfile.id,
      childName: validatedOut.childProfile.name,
      recordCount: validatedOut.observations.length,
      crypto: {
        algorithm: 'AES-GCM',
        keyLength: 256,
        iv: uint8ArrayToBase64(iv),
        kdf: 'PBKDF2',
        kdfHash: 'SHA-256',
        kdfIterations: iterations,
        kdfSalt: uint8ArrayToBase64(salt),
        aad: uint8ArrayToBase64(aadBytes),
      },
      ciphertext: uint8ArrayToBase64(cipherBytes),
    };

    const envelopeStr = JSON.stringify(envelope);
    const envelopeSizeBytes = enc.encode(envelopeStr).byteLength;

    // 4. Parsing de arquivo + Validação Zod de Envelope
    const tZod2 = performance.now();
    const parsedRaw = parseVaultFileString(envelopeStr, VAULT_MAX_FILE_BYTES);
    const parsedEnvelope = VaultEnvelopeSchema.parse(parsedRaw);
    zodTimeMs += performance.now() - tZod2;

    // 5. Decifragem AES-GCM-256 (Importação)
    const tDecStart = performance.now();
    const cipherToDecrypt = base64ToUint8Array(parsedEnvelope.ciphertext);
    const decryptedBuffer = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: base64ToUint8Array(parsedEnvelope.crypto.iv) as BufferSource,
        additionalData: aadBytes as BufferSource,
      },
      derivedKey,
      cipherToDecrypt as BufferSource
    );
    const aesGcmDecryptMs = performance.now() - tDecStart;

    // 6. Validação Zod do Payload Decifrado
    const tZod3 = performance.now();
    const decodedJson = JSON.parse(dec.decode(decryptedBuffer));
    VaultPayloadSchema.parse(decodedJson);
    zodTimeMs += performance.now() - tZod3;

    const totalRoundtripMs = performance.now() - tTotalStart;
    frameTimerActive = false;

    // Caso estejamos em ambiente sem rAF (Node.js) ou operação síncrona, registra ao menos o bloqueio estimado
    if (maxFrameGapMs === 0) {
      maxFrameGapMs = Number(Math.max(zodTimeMs, aesGcmEncryptMs).toFixed(2));
    }

    return {
      sampleIndex,
      isWarmup,
      pbkdf2DeriveMs: Number(pbkdf2DeriveMs.toFixed(2)),
      aesGcmEncryptMs: Number(aesGcmEncryptMs.toFixed(2)),
      aesGcmDecryptMs: Number(aesGcmDecryptMs.toFixed(2)),
      zodParseValidateMs: Number(zodTimeMs.toFixed(2)),
      totalRoundtripMs: Number(totalRoundtripMs.toFixed(2)),
      maxFrameGapMs: Number(maxFrameGapMs.toFixed(2)),
      envelopeBytes: envelopeSizeBytes,
      plaintextBytes: plaintextBytes.byteLength,
      observationCount: validatedOut.observations.length,
      success: true,
    };
  } catch (err: unknown) {
    frameTimerActive = false;
    const msg = err instanceof Error ? err.message : 'Erro desconhecido no benchmark';
    return {
      sampleIndex,
      isWarmup,
      pbkdf2DeriveMs: 0,
      aesGcmEncryptMs: 0,
      aesGcmDecryptMs: 0,
      zodParseValidateMs: 0,
      totalRoundtripMs: Number((performance.now() - tTotalStart).toFixed(2)),
      maxFrameGapMs: Number(maxFrameGapMs.toFixed(2)),
      envelopeBytes: 0,
      plaintextBytes: 0,
      observationCount: payload.observations.length,
      success: false,
      errorMessage: msg,
    };
  }
}

/**
 * Executa a bateria completa de um cenário (1 Warmup + N Amostras Medidas)
 */
export async function runScenarioBenchmark(
  scenarioId: BenchmarkScenarioId,
  sampleCount: number = 10,
  iterations: number = VAULT_DEFAULT_PBKDF2_ITERATIONS,
  onProgress?: (stepDescription: string, currentSample: number, totalSamples: number) => void
): Promise<ScenarioBenchmarkReport> {
  const labels: Record<BenchmarkScenarioId, string> = {
    SMALL: 'Payload Pequeno (10 observações)',
    MEDIUM: 'Payload Médio (250 observações)',
    NEAR_5MB_LIMIT: 'Payload Próximo ao Limite de 5 MB (1.500 observações)',
  };

  const payload = generateSyntheticScenarioPayload(scenarioId);

  if (onProgress) {
    onProgress(`Executando amostra inicial de aquecimento (Warm-up)...`, 0, sampleCount);
  }
  await new Promise((r) => setTimeout(r, 20));
  const warmupSample = await runSingleBenchmarkSample(payload, 0, true, iterations);

  const measuredSamples: BenchmarkSampleMetrics[] = [];
  for (let i = 1; i <= sampleCount; i++) {
    if (onProgress) {
      onProgress(
        `Executando amostra medida ${i} de ${sampleCount} (${labels[scenarioId]})...`,
        i,
        sampleCount
      );
    }
    await new Promise((r) => setTimeout(r, 20));
    const sample = await runSingleBenchmarkSample(payload, i, false, iterations);
    measuredSamples.push(sample);
  }

  const validSamples = measuredSamples.filter((s) => s.success);
  const failuresCount = measuredSamples.length - validSamples.length;

  const pbkdf2Stats = computeStatistics(
    warmupSample.pbkdf2DeriveMs,
    validSamples.map((s) => s.pbkdf2DeriveMs)
  );
  const encryptStats = computeStatistics(
    warmupSample.aesGcmEncryptMs,
    validSamples.map((s) => s.aesGcmEncryptMs)
  );
  const decryptStats = computeStatistics(
    warmupSample.aesGcmDecryptMs,
    validSamples.map((s) => s.aesGcmDecryptMs)
  );
  const zodStats = computeStatistics(
    warmupSample.zodParseValidateMs,
    validSamples.map((s) => s.zodParseValidateMs)
  );
  const totalStats = computeStatistics(
    warmupSample.totalRoundtripMs,
    validSamples.map((s) => s.totalRoundtripMs)
  );

  const maxGap = validSamples.reduce(
    (max, s) => (s.maxFrameGapMs > max ? s.maxFrameGapMs : max),
    warmupSample.maxFrameGapMs
  );

  return {
    scenarioId,
    scenarioLabel: labels[scenarioId],
    observationCount: payload.observations.length,
    plaintextSizeBytes: warmupSample.plaintextBytes,
    envelopeSizeBytes: warmupSample.envelopeBytes,
    iterations,
    warmupSample,
    measuredSamples,
    stats: {
      pbkdf2Derive: pbkdf2Stats,
      aesGcmEncrypt: encryptStats,
      aesGcmDecrypt: decryptStats,
      zodParseValidate: zodStats,
      totalRoundtrip: totalStats,
      uiResponsivenessMaxGapMs: maxGap,
    },
    failuresCount,
  };
}
