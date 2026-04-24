import { X, Shield, AlertOctagon, FileText, Send, CheckCircle2, ExternalLink, Eye } from "lucide-react";

function getScoreColor(score) {
  if (score >= 85) return "text-red-400";
  if (score >= 70) return "text-orange-400";
  if (score >= 50) return "text-amber-400";
  return "text-slate-400";
}

function getScoreBarColor(score) {
  if (score >= 85) return "bg-red-500";
  if (score >= 70) return "bg-orange-500";
  return "bg-amber-500";
}

function getSeverityBadge(severity) {
  const map = {
    CRITICAL: "bg-red-500/20 text-red-300 border-red-500/40",
    HIGH: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    MEDIUM: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    LOW: "bg-slate-500/20 text-slate-300 border-slate-500/40"
  };
  return map[severity] || map.LOW;
}

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return iso;
  }
}

export default function FindingDossier(props) {
  const finding = props.finding;
  const onClose = props.onClose;

  if (!finding) return null;

  const scoreColor = getScoreColor(finding.score);
  const scoreBarColor = getScoreBarColor(finding.score);
  const severityBadge = getSeverityBadge(finding.severity);
  const hasThumbnail = finding.video_thumbnail && !finding.azure_filter_triggered;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl"
        onClick={function(e) { e.stopPropagation(); }}
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-fuchsia-900/40 via-slate-950 to-cyan-900/30 backdrop-blur-md border-b border-slate-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-fuchsia-400" size={18} />
                <span className="text-xs text-fuchsia-300 font-bold tracking-widest">
                  DOSSIER DE EVIDENCIA - 707 INTELLIGENCE
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-100">
                {"@" + finding.author_name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={"px-2 py-0.5 rounded text-xs font-bold border " + severityBadge}>
                  {finding.severity || "-"}
                </span>
                <span className="text-xs text-slate-400">
                  Detectado: {formatDate(finding.detected_at)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs text-slate-400 font-semibold tracking-wider mb-2">
                SCORE DE RIESGO
              </div>
              <div className={"text-6xl font-bold mb-2 " + scoreColor}>
                {finding.score}
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className={"h-full " + scoreBarColor}
                  style={{ width: finding.score + "%" }}
                ></div>
              </div>
              <div className="text-xs text-slate-500">{finding.category}</div>
            </div>

            <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              {hasThumbnail ? (
                <img
                  src={finding.video_thumbnail}
                  alt="Thumbnail"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-red-900/40 to-slate-950">
                  <div className="text-center">
                    <Shield className="mx-auto mb-3 text-red-400" size={48} />
                    <div className="text-sm text-red-300 font-bold">CONTENIDO EXTREMO</div>
                    <div className="text-xs text-red-400 mt-1">Azure Content Filter lo bloqueo</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {finding.azure_filter_triggered ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertOctagon className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <div className="text-sm font-bold text-red-300 mb-1">
                    AZURE CONTENT FILTER DETECTADO
                  </div>
                  <div className="text-xs text-red-400">
                    Este contenido fue clasificado como de severidad ALTA por el sistema de moderacion de Microsoft Azure.
                    Indica presencia de violencia, contenido sexual o material danino que requiere intervencion inmediata.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-900/10 to-slate-900/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="text-fuchsia-400" size={18} />
              <h3 className="text-sm font-bold text-fuchsia-300 tracking-wider">
                ANALISIS 707 AI
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {finding.reason || "Sin analisis disponible"}
            </p>

            {finding.indicators && finding.indicators.length > 0 ? (
              <div className="mt-4">
                <div className="text-xs text-slate-400 mb-2 font-semibold">
                  INDICADORES DETECTADOS:
                </div>
                <div className="flex flex-wrap gap-2">
                  {finding.indicators.map(function(ind, i) {
                    return (
                      <span key={i} className="px-2.5 py-1 bg-fuchsia-500/20 text-fuchsia-200 text-xs rounded-lg border border-fuchsia-500/30">
                        {ind}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {finding.mexican_context_markers && finding.mexican_context_markers.length > 0 ? (
              <div className="mt-4">
                <div className="text-xs text-slate-400 mb-2 font-semibold">
                  MARKERS CONTEXTO MEXICANO:
                </div>
                <div className="flex flex-wrap gap-2">
                  {finding.mexican_context_markers.map(function(m, i) {
                    return (
                      <span key={i} className="px-2.5 py-1 bg-amber-500/20 text-amber-200 text-xs rounded-lg border border-amber-500/30">
                        {m}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-500 mb-1">Followers</div>
              <div className="text-lg font-bold text-slate-100">
                {formatNumber(finding.author_followers)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-500 mb-1">Views</div>
              <div className="text-lg font-bold text-slate-100">
                {formatNumber(finding.engagement_plays)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-500 mb-1">Likes</div>
              <div className="text-lg font-bold text-slate-100">
                {formatNumber(finding.engagement_likes)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-500 mb-1">Comentarios</div>
              <div className="text-lg font-bold text-slate-100">
                {formatNumber(finding.engagement_comments)}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3">
              DETALLES DEL POST
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-slate-500 mb-1">Descripcion:</div>
                <div className="text-slate-300">
                  {finding.video_description || "-"}
                </div>
              </div>
              {finding.hashtags_detected && finding.hashtags_detected.length > 0 ? (
                <div>
                  <div className="text-xs text-slate-500 mb-1">Hashtags detectados:</div>
                  <div className="flex flex-wrap gap-1">
                    {finding.hashtags_detected.map(function(h, i) {
                      return (
                        <span key={i} className="text-xs text-cyan-400">{"#" + h}</span>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {finding.music_detected ? (
                <div>
                  <div className="text-xs text-slate-500 mb-1">Musica:</div>
                  <div className="text-slate-300">{finding.music_detected}</div>
                </div>
              ) : null}
              {finding.video_url ? (
                <div>
                  <a
                    href={finding.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    <ExternalLink size={14} />
                    Ver video original en TikTok
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          {finding.recommended_action ? (
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
              <div className="text-xs font-bold text-orange-300 tracking-wider mb-1">
                ACCION RECOMENDADA
              </div>
              <div className="text-sm text-orange-200 font-semibold">
                {finding.recommended_action}
              </div>
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 bg-slate-950 border-t border-slate-800 p-4 flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-semibold rounded-lg transition">
            <FileText size={16} />
            Generar Reporte PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition">
            <Send size={16} />
            Reportar a TikTok
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition">
            <AlertOctagon size={16} />
            Escalar a Autoridades
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition">
            <CheckCircle2 size={16} />
            Falso Positivo
          </button>
        </div>
      </div>
    </div>
  );
}
