import { useState } from "react";
import { Target, Zap, Loader2, X } from "lucide-react";

const HASHTAG_CATEGORIES = {
  "🎵 Narcocultura / Música": [
    "pesopluma", "corridosbelicos", "corridostumbados", "plebes",
    "belicones", "purosplebes", "elcomandante"
  ],
  "💰 Reclutamiento Criminal": [
    "empleorapido", "trabajofacil", "dineroexpress", "chambafacil",
    "jaleseguro", "trabajoenlinea"
  ],
  "🎮 Contacto con Menores": [
    "robloxgirls", "freefireboys", "niñagamer", "chicaroblox", "gamergirl12"
  ],
  "🔫 Narco / Cárteles": [
    "sinaloense", "cdgl", "cartel", "lafamilia", "sicariato", "narcocorridos"
  ]
};

export default function HuntLauncher({ onLaunch, hunting, progress }) {
  const [selectedTags, setSelectedTags] = useState(new Set(["pesopluma", "plebes", "corridosbelicos"]));
  const [maxPerTag, setMaxPerTag] = useState(10);

  const toggleTag = (tag) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) newTags.delete(tag);
    else newTags.add(tag);
    setSelectedTags(newTags);
  };

  const handleLaunch = () => {
    if (selectedTags.size === 0) return;
    onLaunch(Array.from(selectedTags), maxPerTag);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
          <Target size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Nueva Cacería</h2>
          <p className="text-sm text-slate-400">Selecciona hashtags sospechosos a escanear en TikTok</p>
        </div>
      </div>

      {/* Hashtag categories */}
      <div className="space-y-4 mb-4">
        {Object.entries(HASHTAG_CATEGORIES).map(([category, tags]) => (
          <div key={category}>
            <div className="text-xs font-semibold text-slate-400 mb-2 tracking-wider">
              {category}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  disabled={hunting}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                    ${selectedTags.has(tag)
                      ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"}
                    ${hunting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Max per tag selector */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-slate-400">Videos por hashtag:</label>
        <select
          value={maxPerTag}
          onChange={(e) => setMaxPerTag(Number(e.target.value))}
          disabled={hunting}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
        >
          <option value={5}>5 (rápido)</option>
          <option value={10}>10 (recomendado)</option>
          <option value={15}>15</option>
          <option value={20}>20 (lento)</option>
        </select>
        <div className="text-xs text-slate-500">
          Seleccionados: <span className="text-fuchsia-400 font-bold">{selectedTags.size}</span> hashtags
        </div>
      </div>

      {/* Progress indicator */}
      {hunting && progress && (
        <div className="mb-4 p-4 rounded-lg bg-slate-900/60 border border-fuchsia-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="text-fuchsia-400 animate-spin" size={18} />
            <div className="text-sm font-semibold text-fuchsia-300">
              {progress.message}
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {/* Launch button */}
      <button
        onClick={handleLaunch}
        disabled={hunting || selectedTags.size === 0}
        className={`
          w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm tracking-wider transition-all
          ${hunting
            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
            : selectedTags.size === 0
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-lg shadow-fuchsia-500/30"}
        `}
      >
        {hunting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            CAZANDO EN TIKTOK...
          </>
        ) : (
          <>
            <Zap size={18} />
            INICIAR CACERÍA
          </>
        )}
      </button>

      {/* Last hunt summary */}
      {progress?.status === "complete" && !hunting && (
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-300">
          ✅ Cacería completa: <strong>{progress.videos_analyzed}</strong> videos analizados, <strong>{progress.findings_detected}</strong> amenazas detectadas
        </div>
      )}
    </div>
  );
}