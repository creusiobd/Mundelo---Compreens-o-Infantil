/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BenchmarkScenarioId,
  ScenarioBenchmarkReport,
  FullBenchmarkExportReport,
  TechnicalEnvironmentMetadata,
  runScenarioBenchmark,
} from '../crypto/benchmark';
import { VAULT_DEFAULT_PBKDF2_ITERATIONS } from '../crypto/types';
import {
  ShieldCheck,
  Activity,
  Cpu,
  Download,
  Play,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HardDrive,
  Lock,
  ArrowLeft,
} from 'lucide-react';

interface SecurityLabScreenProps {
  onBackToApp?: () => void;
}

export const SecurityLabScreen: React.FC<SecurityLabScreenProps> = ({
  onBackToApp,
}) => {
  const [testerDevice, setTesterDevice] = useState<string>('Não informado (preencher em campo)');
  const [testerOs, setTesterOs] = useState<string>('Android / Desktop');
  const [testerBrowser, setTesterBrowser] = useState<string>(
    typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : 'Node / Headless'
  );
  const [sampleCount, setSampleCount] = useState<number>(10);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [currentSampleInfo, setCurrentSampleInfo] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const [reports, setReports] = useState<ScenarioBenchmarkReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getEnvironmentMetadata = (): TechnicalEnvironmentMetadata => {
    const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { deviceMemory?: number }) : undefined;
    return {
      timestampIso: new Date().toISOString(),
      userAgent: nav ? nav.userAgent : 'Node Test Environment',
      testerProvidedDevice: testerDevice.trim() || 'Não informado',
      testerProvidedOs: testerOs.trim() || 'Não informado',
      testerProvidedBrowser: testerBrowser.trim() || 'Não informado',
      hardwareConcurrency: nav?.hardwareConcurrency ?? 'unavailable',
      deviceMemoryGb: nav?.deviceMemory ?? 'unavailable',
      isSecureContext: typeof window !== 'undefined' ? Boolean(window.isSecureContext) : true,
      webCryptoAvailable: Boolean(globalThis.crypto?.subtle),
    };
  };

  const envMeta = getEnvironmentMetadata();

  const handleRunScenarios = async (scenariosToRun: BenchmarkScenarioId[]) => {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);

    try {
      const validSampleCount = Math.max(10, Math.min(30, sampleCount));
      const newReports: ScenarioBenchmarkReport[] = [...reports];

      for (const scenarioId of scenariosToRun) {
        const result = await runScenarioBenchmark(
          scenarioId,
          validSampleCount,
          VAULT_DEFAULT_PBKDF2_ITERATIONS,
          (msg, current, total) => {
            setStatusMessage(msg);
            setCurrentSampleInfo({ current, total });
          }
        );

        const existingIdx = newReports.findIndex((r) => r.scenarioId === scenarioId);
        if (existingIdx >= 0) {
          newReports[existingIdx] = result;
        } else {
          newReports.push(result);
        }
        setReports([...newReports]);
      }

      setStatusMessage('Bateria de ensaios concluída com sucesso.');
      setCurrentSampleInfo(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na execução do benchmark.';
      setError(msg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportJsonReport = () => {
    if (reports.length === 0) return;

    const fullReport: FullBenchmarkExportReport = {
      reportFormat: 'MUNDELO_SEC23_BENCHMARK_V1',
      containsSecretsOrPlaintext: false,
      environment: getEnvironmentMetadata(),
      scenarios: reports,
    };

    const jsonString = JSON.stringify(fullReport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const filename = `mundelo-sec23-benchmark-${dateStr}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#133E43] text-white p-6 rounded-3xl shadow-md">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#80C5B5] text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Ambiente Exclusivo de Desenvolvimento & Auditoria (/security-lab)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Laboratório de Benchmark Criptográfico (SEC-23)
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
            Instrumentação empírica de desempenho da Web Crypto API (PBKDF2 600.000 iterações + AES-GCM-256) e validação Zod para homologação em dispositivos Desktop e Android.
          </p>
        </div>

        {onBackToApp && (
          <button
            onClick={onBackToApp}
            disabled={isRunning}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 min-h-[44px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao App</span>
          </button>
        )}
      </div>

      {/* Environment & Hardware Metadata Panel */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#133E43]/10 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#133E43]" />
            <h2 className="text-base sm:text-lg font-bold text-[#133E43] font-display">
              1. Metadados do Dispositivo e Ambiente de Ensaio
            </h2>
          </div>
          <span className="text-[11px] font-mono bg-[#F8F5EF] px-2.5 py-1 rounded-lg border border-[#133E43]/10 text-[#133E43]">
            Zero Dados Pessoais ou Segredos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="lab-device" className="block text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1">
              Dispositivo Informado pelo Testador
            </label>
            <input
              id="lab-device"
              type="text"
              value={testerDevice}
              onChange={(e) => setTesterDevice(e.target.value)}
              disabled={isRunning}
              placeholder="Ex: Moto G54 5G / Galaxy A15 / Desktop"
              className="w-full bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[42px]"
            />
          </div>

          <div>
            <label htmlFor="lab-os" className="block text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1">
              Sistema Operacional Informado
            </label>
            <input
              id="lab-os"
              type="text"
              value={testerOs}
              onChange={(e) => setTesterOs(e.target.value)}
              disabled={isRunning}
              placeholder="Ex: Android 14 / iOS 18 / Linux"
              className="w-full bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[42px]"
            />
          </div>

          <div>
            <label htmlFor="lab-samples" className="block text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1">
              Amostras Medidas por Cenário (Mín: 10)
            </label>
            <input
              id="lab-samples"
              type="number"
              min={10}
              max={30}
              value={sampleCount}
              onChange={(e) => setSampleCount(Math.max(10, Number(e.target.value) || 10))}
              disabled={isRunning}
              className="w-full bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[42px]"
            />
          </div>
        </div>

        {/* Auto-detected Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-[#F8F5EF] p-3 rounded-2xl border border-[#133E43]/10">
            <span className="text-[#133E43]/60 block">Núcleos Lógicos (CPU):</span>
            <strong className="text-sm font-mono text-[#133E43]">{String(envMeta.hardwareConcurrency)}</strong>
          </div>
          <div className="bg-[#F8F5EF] p-3 rounded-2xl border border-[#133E43]/10">
            <span className="text-[#133E43]/60 block">Memória Estimada (RAM):</span>
            <strong className="text-sm font-mono text-[#133E43]">
              {envMeta.deviceMemoryGb === 'unavailable' ? 'Não exposto pelo navegador' : `${envMeta.deviceMemoryGb} GB`}
            </strong>
          </div>
          <div className="bg-[#F8F5EF] p-3 rounded-2xl border border-[#133E43]/10">
            <span className="text-[#133E43]/60 block">Contexto Seguro (HTTPS):</span>
            <strong className="text-sm font-mono text-emerald-700">
              {envMeta.isSecureContext ? 'Sim (Seguro)' : 'Não'}
            </strong>
          </div>
          <div className="bg-[#F8F5EF] p-3 rounded-2xl border border-[#133E43]/10">
            <span className="text-[#133E43]/60 block">Web Crypto API:</span>
            <strong className="text-sm font-mono text-emerald-700">
              {envMeta.webCryptoAvailable ? 'Ativa (crypto.subtle)' : 'Indisponível'}
            </strong>
          </div>
        </div>

        <div className="text-[11px] text-[#133E43]/70 font-mono bg-[#F8F5EF] p-2.5 rounded-xl border border-[#133E43]/10 break-all">
          <strong>User-Agent Detectado:</strong> {envMeta.userAgent}
        </div>
      </section>

      {/* Execution Controls */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#133E43] font-display">
              2. Execução dos Cenários Canônicos (1 Warm-up + {Math.max(10, sampleCount)} Amostras)
            </h2>
            <p className="text-xs text-[#133E43]/75">
              Cada amostra executa derivação PBKDF2 (600.000 iterações), cifra AES-GCM-256, parsing JSON, validação Zod e decifragem AES-GCM-256.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRunScenarios(['SMALL'])}
              disabled={isRunning}
              className="px-4 py-2.5 rounded-xl border border-[#133E43]/20 bg-[#F8F5EF] hover:bg-white text-[#133E43] text-xs font-semibold min-h-[44px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-[#133E43]" />
              <span>Cenário Pequeno (10 obs)</span>
            </button>

            <button
              onClick={() => handleRunScenarios(['MEDIUM'])}
              disabled={isRunning}
              className="px-4 py-2.5 rounded-xl border border-[#133E43]/20 bg-[#F8F5EF] hover:bg-white text-[#133E43] text-xs font-semibold min-h-[44px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-[#133E43]" />
              <span>Cenário Médio (250 obs)</span>
            </button>

            <button
              onClick={() => handleRunScenarios(['NEAR_5MB_LIMIT'])}
              disabled={isRunning}
              className="px-4 py-2.5 rounded-xl border border-[#133E43]/20 bg-[#F8F5EF] hover:bg-white text-[#133E43] text-xs font-semibold min-h-[44px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#133E43]" />
              <span>Limite ~5 MB (1.500 obs)</span>
            </button>

            <button
              onClick={() => handleRunScenarios(['SMALL', 'MEDIUM', 'NEAR_5MB_LIMIT'])}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl bg-[#133E43] hover:bg-[#133E43]/90 text-white text-xs font-semibold min-h-[44px] flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 text-[#80C5B5]" />
              <span>Executar Bateria Completa</span>
            </button>
          </div>
        </div>

        {/* Indeterminate Progress Banner (Honest Web Crypto Feedback) */}
        {isRunning && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 bg-[#F8F5EF] border border-[#80C5B5] rounded-2xl space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-[#133E43]">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-4 h-4 border-2 border-[#133E43]/30 border-t-[#133E43] rounded-full animate-spin" />
                <span>{statusMessage}</span>
              </div>
              {currentSampleInfo && (
                <span className="font-mono font-bold">
                  {currentSampleInfo.current === 0
                    ? 'Warm-up Inicial'
                    : `Amostra ${currentSampleInfo.current} / ${currentSampleInfo.total}`}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#133E43]/70">
              Nota técnica: A Web Crypto API executa primitivas PBKDF2 e AES-GCM de forma atômica em código nativo, sem emitir percentual parcial por chamada. O indicador acima reflete a atividade real por amostra concluída.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Results Display */}
      {reports.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#133E43] font-display flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>3. Resultados Empíricos Coletados</span>
            </h2>

            <button
              onClick={handleExportJsonReport}
              className="px-4 py-2.5 rounded-xl bg-[#133E43] text-white hover:bg-[#133E43]/90 text-xs font-semibold flex items-center gap-2 min-h-[42px] self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-[#80C5B5]" />
              <span>Exportar Relatório Técnico JSON (Sem Dados Pessoais)</span>
            </button>
          </div>

          {reports.map((rep) => (
            <div
              key={rep.scenarioId}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#133E43]/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#80C5B5]/20 text-[#133E43] font-bold">
                    {rep.scenarioId}
                  </span>
                  <h3 className="text-base font-bold text-[#133E43] font-display mt-1">
                    {rep.scenarioLabel}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#133E43]/80 font-mono">
                  <span>Plaintext JSON: <strong>{formatBytes(rep.plaintextSizeBytes)}</strong></span>
                  <span>·</span>
                  <span>Arquivo .mundelo-vault: <strong>{formatBytes(rep.envelopeSizeBytes)}</strong></span>
                  <span>·</span>
                  <span>Falhas: <strong>{rep.failuresCount}</strong></span>
                </div>
              </div>

              <div className="text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  {rep.stats.totalRoundtrip.smallSampleNotice} Maior intervalo de frame/bloqueio na UI: <strong>{rep.stats.uiResponsivenessMaxGapMs} ms</strong>.
                </span>
              </div>

              {/* Statistical Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#133E43]/15 text-[#133E43]/70 font-bold uppercase text-[11px]">
                      <th className="py-2 pr-3">Etapa Medida</th>
                      <th className="py-2 px-3 font-mono">Warm-up (#0)</th>
                      <th className="py-2 px-3 font-mono">Mínimo</th>
                      <th className="py-2 px-3 font-mono text-[#133E43]">Mediana (P50)</th>
                      <th className="py-2 px-3 font-mono">Média</th>
                      <th className="py-2 px-3 font-mono">P90</th>
                      <th className="py-2 px-3 font-mono">P95</th>
                      <th className="py-2 pl-3 font-mono">Máximo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133E43]/10 font-mono">
                    {[
                      { label: '1. PBKDF2-HMAC-SHA256 (600k)', stat: rep.stats.pbkdf2Derive },
                      { label: '2. AES-GCM-256 Encrypt (Export)', stat: rep.stats.aesGcmEncrypt },
                      { label: '3. AES-GCM-256 Decrypt (Import)', stat: rep.stats.aesGcmDecrypt },
                      { label: '4. JSON Parse + Zod Validation', stat: rep.stats.zodParseValidate },
                      { label: '5. Fluxo Completo (Round-trip)', stat: rep.stats.totalRoundtrip, bold: true },
                    ].map((row) => (
                      <tr key={row.label} className={row.bold ? 'bg-[#F8F5EF] font-bold text-[#133E43]' : 'text-[#133E43]/85'}>
                        <td className="py-2.5 pr-3 font-sans">{row.label}</td>
                        <td className="py-2.5 px-3">{row.stat.warmupMs} ms</td>
                        <td className="py-2.5 px-3">{row.stat.minMs} ms</td>
                        <td className="py-2.5 px-3 font-bold text-[#133E43]">{row.stat.medianMs} ms</td>
                        <td className="py-2.5 px-3">{row.stat.meanMs} ms</td>
                        <td className="py-2.5 px-3">{row.stat.p90Ms} ms</td>
                        <td className="py-2.5 px-3">{row.stat.p95Ms} ms</td>
                        <td className="py-2.5 pl-3">{row.stat.maxMs} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
