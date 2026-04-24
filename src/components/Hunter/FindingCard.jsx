import { Eye, ExternalLink, Shield } from "lucide-react";

function getScoreStyle(score) {
  if (score >= 85) {
    return {
      badge: "bg-red-500/20 text-red-300 border-red-500/40",
      label: "CRITICAL",
      dot: "bg-red-500 animate-pulse"
    };
  }
  if (score >= 70) {
    return {
      badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      label: "HIGH",
      dot: "bg-orange-500"
    };
  }
  if (score >= 50) {
    return {
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      label: "MEDIUM",
      dot: "bg-amber-500"
    };
  }
  return {
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    label: "LOW",
    dot: "bg-slate-500"
  };
}

function getCategoryLabel(cat) {
  const labels = {
    NARCOCULTURA_ROMANTIZADA: "Narcocultura",
    RECLUTAMIENTO_CRIMINAL: "Reclutamiento",
    GROOMING: "Grooming",
    CONTACTO_MENORES: "Contacto Menores",
    VIOLENCIA_EXTREMA: "Violencia",
    PII_PUBLICA: "Datos Personales",
    CONTENIDO_EXTREMO_AZURE_FILTRADO: "Azure Bloqueo",
    SEGURO: "Seguro",
    UNKNOWN: "Desconocido"
  };
  return labels[cat] || cat;
}

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function FindingCard(props) {
  const finding = props.finding;
  const onOpenDossier = props.onOpenDossier;
  const style = getScoreStyle(finding.score);
  const categoryLabel = getCategoryLabel(finding.category);
  const hasThumbnail = finding.video_thumbnail && !finding.azure_filter_triggered;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 hover:border-fuchsia-500/40 transition-all duration-200 shadow-lg">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 bg-slate-950">
          {hasThumbnail ? (
            <img
              src={finding.video_thumbnail}
              alt="TikTok thumbnail"
              className="w-full h-full object-cover"
              onError={function(e) { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/40 to-slate-950">
              <div className="text-center">
                <Shield className="mx-auto mb-2 text-red-400" size={32} />
                <div className="text-xs text-red-300 font-semibold">CONTENIDO</div>
                <div className="text-xs text-red-400 font-bold">BLOQUEADO</div>
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <div className={"px-2 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 " + style.badge}>
              <div className={"w-1.5 h-1.5 rounded-full " + style.dot}></div>
              {finding.score}
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={"px-2 py-0.5 rounded text-xs font-bold border " + style.badge}>
                  {style.label}
                </span>
                <span className="text-xs text-slate-400">{categoryLabel}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">
                {"@" + finding.author_name}
              </h3>
              {finding.author_verified ? (
                <span className="text-xs text-cyan-400">Verificado</span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
            <span>{formatNumber(finding.author_followers)} followers</span>
            <span>{formatNumber(finding.engagement_plays)} vistas</span>
            <span>{formatNumber(finding.engagement_likes)} likes</span>
            <span>{formatNumber(finding.engagement_comments)} coments</span>
          </div>

          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
            {finding.reason || "Analisis en proceso..."}
          </p>

          {finding.indicators && finding.indicators.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {finding.indicators.slice(0, 3).map(function(ind, i) {
                return (
                  <span key={i} className="px-2 py-0.5 bg-fuchsia-500/10 text-fuchsia-300 text-xs rounded border border-fuchsia-500/20">
                    {ind}
                  </span>
                );
              })}
              {finding.indicators.length > 3 ? (
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">
                  {"+" + (finding.indicators.length - 3)}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={function() { onOpenDossier(finding); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 text-sm rounded-lg border border-fuchsia-500/30 transition"
            >
              <Eye size={14} />
              Ver Dossier
            </button>
            {finding.video_url ? (
              <a
                href={finding.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg border border-slate-700 transition"
              >
                <ExternalLink size={14} />
                Ver en TikTok
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
