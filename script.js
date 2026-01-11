/* ----------------- VARIABLES DOM ----------------- */
const logBox = document.getElementById("log");
const resBody = document.getElementById("results-body");
const signalCount = document.getElementById("signal-count");
const apikey = document.getElementById("apikey");
const pairsSelect = document.getElementById("pairs");
const daysInput = document.getElementById("days");
const hoursInput = document.getElementById("hours");
const minConfInput = document.getElementById("minConf");
const offsetInput = document.getElementById("offset");
const modeSelect = document.getElementById("mode");

/* ----------------- LISTAS DE PARES POR MERCADO ----------------- */
const paresReales = [
    "AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/USD",
    "CAD/JPY", "CHF/JPY",
    "EUR/AUD", "EUR/CAD", "EUR/CHF", "EUR/GBP", "EUR/JPY", "EUR/USD",
    "GBP/AUD", "GBP/CAD", "GBP/CHF", "GBP/JPY", "GBP/USD",
    "USD/CAD", "USD/CHF", "USD/JPY"
];

const paresOTC = [
    "AUDCAD-OTC", "AUDCHF-OTC", "AUDJPY-OTC", "AUDNZD-OTC", "AUDUSD-OTC",
    "CADCHF-OTC", "CADJPY-OTC", "CHFJPY-OTC",
    "EURAUD-OTC", "EURCAD-OTC", "EURCHF-OTC", "EURGBP-OTC", "EURJPY-OTC",
    "EURNZD-OTC", "EURUSD-OTC",
    "GBPAUD-OTC", "GBPCAD-OTC", "GBPNZD-OTC", "GBPUSD-OTC",
    "NZDCAD-OTC", "NZDCHF-OTC", "NZDJPY-OTC", "NZDUSD-OTC",
    "USDARS-OTC", "USDBDT-OTC", "USDBRL-OTC", "USDCAD-OTC",
    "USDDZD-OTC", "USDEGP-OTC", "USDCOP-OTC", "USDIDR-OTC",
    "USDINR-OTC", "USDMXN-OTC", "USDPHP-OTC", "USDPKR-OTC",
    "USDTRY-OTC", "USDZAR-OTC"
];

/* ----------------- CONVERSIÓN PARA API ----------------- */
function convertirParAPI(pair) {
    if (pair.endsWith("-OTC")) {
        let base = pair.replace("-OTC", ""); // quitar sufijo
        return base.slice(0, 3) + "/" + base.slice(3); // EURUSD → EUR/USD
    }
    return pair;
}

/* ----------------- CONFIGURACIONES POR MERCADO ----------------- */
// OTC: Más volátil, movimientos rápidos, requiere parámetros más permisivos
// Real: Más estable, tendencias claras, parámetros más estrictos
const CONFIG_OTC = {
    rsi: {
        buy: 45,      // Más permisivo (antes 50)
        sell: 55      // Más permisivo (antes 50)
    },
    adx: {
        min: 15       // Tendencia más débil es aceptable (antes 20)
    },
    stoch: {
        buy: 40,      // Más permisivo (antes 50)
        sell: 60      // Más permisivo (antes 50)
    },
    bollinger: {
        minWidth: 0.00005  // Acepta menor volatilidad (antes 0.0001)
    },
    winrate: {
        lookback: 2160,    // 36 horas (antes 48h = 2880)
        minMatches: 1      // Solo 1 match histórico necesario (antes 2)
    }
};

const CONFIG_REAL = {
    rsi: {
        buy: 50,
        sell: 50
    },
    adx: {
        min: 20
    },
    stoch: {
        buy: 50,
        sell: 50
    },
    bollinger: {
        minWidth: 0.0001
    },
    winrate: {
        lookback: 2880,    // 48 horas
        minMatches: 2
    }
};

// Función helper para obtener configuración según par
function getConfig(pair) {
    return pair.endsWith('-OTC') ? CONFIG_OTC : CONFIG_REAL;
}

/* ----------------- LOG ----------------- */
function log(msg) {
    const t = new Date().toLocaleTimeString("es-ES", { hour12: false });
    // Keep only last 5 messages to avoid overflow looking bad
    let currentLogs = logBox.innerHTML.split("<br>").filter(x => x).slice(-4);
    currentLogs.push(`<span style="color:#aaa">[${t}]</span> ${msg}`);
    logBox.innerHTML = currentLogs.join("<br>");
    logBox.scrollTop = logBox.scrollHeight;
}

/* ----------------- UTILIDADES ----------------- */
function time24(date) {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function sma(arr, p) {
    return arr.map((_, i) => i < p ? null : arr.slice(i - p, i).reduce((a, b) => a + b) / p);
}

function rsi(arr, p = 14) {
    let res = [], g = 0, l = 0;
    for (let i = 1; i < arr.length; i++) {
        let d = arr[i] - arr[i - 1];
        if (i <= p) {
            d > 0 ? g += d : l -= d;
            res.push(null);
        } else {
            let rs = (g / p) / (l / p || 1);
            res.push(100 - (100 / (1 + rs)));
            d > 0 ? g += d : l -= d;
        }
    }
    return res;
}

// NUEVO: Bandas de Bollinger para detector volatilidad
function bollinger(arr, p = 20, mult = 2) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        if (i < p) {
            res.push({ width: 0 });
            continue;
        }
        let slice = arr.slice(i - p, i);
        let mean = slice.reduce((a, b) => a + b) / p;
        let variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / p;
        let dev = Math.sqrt(variance);
        res.push({
            upper: mean + (mult * dev),
            lower: mean - (mult * dev),
            width: (mean + (mult * dev)) - (mean - (mult * dev))
        });
    }
    return res;
}

// NUEVO: ADX (Trend Strength)
function calculateADX(candles, period = 14) {
    let res = [];
    let tr = [], dmPlus = [], dmMinus = [];

    // 1. Calculate TR, +DM, -DM
    for (let i = 0; i < candles.length; i++) {
        if (i === 0) {
            tr.push(0); dmPlus.push(0); dmMinus.push(0);
            res.push({ adx: 0, pdi: 0, mdi: 0 });
            continue;
        }

        let c = candles[i];
        let p = candles[i - 1];

        let hl = c.high - c.low;
        let hcp = Math.abs(c.high - p.close);
        let lcp = Math.abs(c.low - p.close);
        let _tr = Math.max(hl, hcp, lcp);

        let dp = (c.high - p.high) > (p.low - c.low) ? Math.max(c.high - p.high, 0) : 0;
        let dm = (p.low - c.low) > (c.high - p.high) ? Math.max(p.low - c.low, 0) : 0;

        tr.push(_tr);
        dmPlus.push(dp);
        dmMinus.push(dm);
    }

    // 2. Smoothed averages
    let smTr = [], smDp = [], smDm = [];
    let initialTr = 0, initialDp = 0, initialDm = 0;

    // Initial accumulation
    for (let i = 0; i < candles.length; i++) {
        if (i < period) {
            initialTr += tr[i]; initialDp += dmPlus[i]; initialDm += dmMinus[i];
            res.push({ adx: 0 }); // Filler
            if (i === period - 1) {
                smTr.push(initialTr); smDp.push(initialDp); smDm.push(initialDm);
            } else {
                smTr.push(0); smDp.push(0); smDm.push(0);
            }
            continue;
        }

        // Smooth function: prev - (prev/n) + current
        let nextTr = smTr[i - 1] - (smTr[i - 1] / period) + tr[i];
        let nextDp = smDp[i - 1] - (smDp[i - 1] / period) + dmPlus[i];
        let nextDm = smDm[i - 1] - (smDm[i - 1] / period) + dmMinus[i];

        smTr.push(nextTr); smDp.push(nextDp); smDm.push(nextDm);

        let pdi = (nextDp / nextTr) * 100;
        let mdi = (nextDm / nextTr) * 100;
        let dx = Math.abs(pdi - mdi) / (pdi + mdi) * 100;

        // ADX is smoothed DX
        // Simple simplification: Start ADX calc after period*2 roughly
        res.push({ adx: dx, pdi, mdi }); // Storing DX raw as ADX proxy for simplicity (works for short term binary)
        // Note: True ADX needs another smoothing layer on DX, but for binary signals DX is often more responsive.
        // We will output DX here as "ADX" for responsiveness.
    }

    // Re-fill beginning to match length
    while (res.length < candles.length) res.unshift({ adx: 0, pdi: 0, mdi: 0 });

    // Apply smoothing to DX to get real ADX (Wilder's Smoothing)
    let finalAdx = [];
    let prevAdx = 0;
    for (let i = 0; i < res.length; i++) {
        if (i < period * 2) {
            finalAdx.push(0);
            if (i >= period) prevAdx += res[i].adx;
            if (i === period * 2 - 1) prevAdx /= period;
            continue;
        }
        let currentAdx = (prevAdx * (period - 1) + res[i].adx) / period;
        finalAdx.push(currentAdx);
        prevAdx = currentAdx;
    }

    return finalAdx;
}

// NUEVO: OSCILADOR ESTOCÁSTICO
function calculateStoch(candles, period = 14, smoothK = 3, smoothD = 3) {
    let res = [];
    // 1. Raw K
    let rawK = [];
    for (let i = 0; i < candles.length; i++) {
        if (i < period) { rawK.push(50); continue; }
        let subset = candles.slice(i - period + 1, i + 1);
        let lowest = Math.min(...subset.map(c => c.low));
        let highest = Math.max(...subset.map(c => c.high));

        let k = 50;
        if (highest !== lowest) {
            k = ((candles[i].close - lowest) / (highest - lowest)) * 100;
        }
        rawK.push(k);
    }

    // 2. Smooth K -> %K
    let kLine = sma(rawK, smoothK);
    // 3. Smooth D -> %D
    let dLine = sma(kLine, smoothD);

    for (let i = 0; i < candles.length; i++) {
        res.push({ k: kLine[i] || 50, d: dLine[i] || 50 });
    }
    return res;
}

// NUEVO: DETECTOR DE DIVERGENCIAS RSI/PRECIO
function detectDivergence(candles, index, rsiArr, lookback = 5) {
    // Necesitamos al menos 'lookback' velas antes
    if (index < lookback * 2) return { type: null, strength: 0 };

    // Buscar pivotes (mínimos y máximos locales)
    function findPivots(arr, start, end) {
        let pivots = [];
        for (let i = start + 1; i < end - 1; i++) {
            // Máximo local
            if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) {
                pivots.push({ index: i, value: arr[i], type: 'high' });
            }
            // Mínimo local
            if (arr[i] < arr[i - 1] && arr[i] < arr[i + 1]) {
                pivots.push({ index: i, value: arr[i], type: 'low' });
            }
        }
        return pivots;
    }

    let searchStart = index - (lookback * 2);
    let searchEnd = index;

    // Pivotes en Precio (usando close)
    let priceData = candles.slice(searchStart, searchEnd + 1).map(c => c.close);
    let pricePivots = findPivots(priceData, 0, priceData.length);

    // Pivotes en RSI
    let rsiData = rsiArr.slice(searchStart, searchEnd + 1);
    let rsiPivots = findPivots(rsiData, 0, rsiData.length);

    // DIVERGENCIA ALCISTA (Bullish)
    // Precio: Lower Low, RSI: Higher Low
    let priceLows = pricePivots.filter(p => p.type === 'low');
    let rsiLows = rsiPivots.filter(p => p.type === 'low');

    if (priceLows.length >= 2 && rsiLows.length >= 2) {
        let lastPriceLow = priceLows[priceLows.length - 1];
        let prevPriceLow = priceLows[priceLows.length - 2];
        let lastRsiLow = rsiLows[rsiLows.length - 1];
        let prevRsiLow = rsiLows[rsiLows.length - 2];

        // Precio bajó, RSI subió
        if (lastPriceLow.value < prevPriceLow.value && lastRsiLow.value > prevRsiLow.value) {
            let strength = Math.min(((lastRsiLow.value - prevRsiLow.value) / prevRsiLow.value) * 100, 100);
            return { type: 'bullish', strength: Math.floor(strength) };
        }
    }

    // DIVERGENCIA BAJISTA (Bearish)
    // Precio: Higher High, RSI: Lower High
    let priceHighs = pricePivots.filter(p => p.type === 'high');
    let rsiHighs = rsiPivots.filter(p => p.type === 'high');

    if (priceHighs.length >= 2 && rsiHighs.length >= 2) {
        let lastPriceHigh = priceHighs[priceHighs.length - 1];
        let prevPriceHigh = priceHighs[priceHighs.length - 2];
        let lastRsiHigh = rsiHighs[rsiHighs.length - 1];
        let prevRsiHigh = rsiHighs[rsiHighs.length - 2];

        // Precio subió, RSI bajó
        if (lastPriceHigh.value > prevPriceHigh.value && lastRsiHigh.value < prevRsiHigh.value) {
            let strength = Math.min(((prevRsiHigh.value - lastRsiHigh.value) / prevRsiHigh.value) * 100, 100);
            return { type: 'bearish', strength: Math.floor(strength) };
        }
    }

    return { type: null, strength: 0 };
}

// NUEVO: MATRIZ DE CORRELACIÓN DE PARES
const PAIR_CORRELATIONS = {
    'EUR/USD': { 'GBP/USD': 0.75, 'EUR/JPY': 0.65, 'EUR/GBP': 0.50 },
    'GBP/USD': { 'EUR/USD': 0.75, 'GBP/JPY': 0.55, 'EUR/GBP': 0.60 },
    'USD/JPY': { 'GBP/JPY': 0.50, 'EUR/JPY': 0.55 },
    'AUD/USD': { 'NZD/USD': 0.80, 'AUD/NZD': 0.45 },
    'USD/CAD': { 'AUD/USD': 0.40 },
    'EUR/JPY': { 'EUR/USD': 0.65, 'USD/JPY': 0.55, 'GBP/JPY': 0.70 },
    'GBP/JPY': { 'GBP/USD': 0.55, 'EUR/JPY': 0.70, 'USD/JPY': 0.50 },
    'NZD/USD': { 'AUD/USD': 0.80, 'AUD/NZD': 0.50 },
    'USD/CHF': { 'EUR/USD': -0.70, 'GBP/USD': -0.50 },
    'AUD/NZD': { 'AUD/USD': 0.45, 'NZD/USD': 0.50 },
    'EUR/GBP': { 'EUR/USD': 0.50, 'GBP/USD': 0.60 }
};

// NUEVO: FILTRO DE CORRELACIÓN
function filterCorrelatedSignals(signals) {
    if (signals.length === 0) return signals;

    // Agrupar señales por ventana de tiempo (±5 minutos)
    let timeGroups = {};

    signals.forEach(sig => {
        let [h, m] = sig.time.split(':').map(Number);
        let totalMins = h * 60 + m;

        // Redondear a ventana de 5 minutos
        let windowKey = Math.floor(totalMins / 5) * 5;

        if (!timeGroups[windowKey]) timeGroups[windowKey] = [];
        timeGroups[windowKey].push(sig);
    });

    let filtered = [];

    // Para cada grupo de tiempo
    Object.values(timeGroups).forEach(group => {
        if (group.length === 1) {
            filtered.push(group[0]);
            return;
        }

        // Hay múltiples señales en la misma ventana
        let toKeep = [...group];
        let removed = new Set();

        for (let i = 0; i < group.length; i++) {
            if (removed.has(i)) continue;

            let sig1 = group[i];
            let pair1 = sig1.pair.replace('-OTC', '');

            for (let j = i + 1; j < group.length; j++) {
                if (removed.has(j)) continue;

                let sig2 = group[j];
                let pair2 = sig2.pair.replace('-OTC', '');

                // Verificar si están correlacionados
                let corr = 0;
                if (PAIR_CORRELATIONS[pair1] && PAIR_CORRELATIONS[pair1][pair2]) {
                    corr = Math.abs(PAIR_CORRELATIONS[pair1][pair2]);
                }

                // Si correlación > 0.7 y misma dirección, eliminar el de menor winrate
                if (corr > 0.7 && sig1.dir === sig2.dir) {
                    if (sig1.conf >= sig2.conf) {
                        removed.add(j);
                    } else {
                        removed.add(i);
                        break; // Esta señal fue eliminada, pasar a la siguiente
                    }
                }
            }
        }

        // Añadir solo las no removidas
        group.forEach((sig, idx) => {
            if (!removed.has(idx)) filtered.push(sig);
        });
    });

    return filtered;
}

/* ----------------- GALE 1 EXACTO ----------------- */
function validateGale(candles, i, dir) {
    if (i + 1 >= candles.length) return false;

    let entry = candles[i].close;
    let next = candles[i + 1].close;

    // Directa
    if (dir === "BUY" && next > entry) return true;
    if (dir === "SELL" && next < entry) return true;

    // Gale 1
    // Simplificación: Asumimos entrada inmediata al cierre de la vela perdedora
    let entryGale = next;
    let nextGale = (i + 2 < candles.length) ? candles[i + 2].close : entry; // Si no hay vela gale, no valida

    if (i + 2 >= candles.length) return false; // No hay datos para validar gale

    if (dir === "BUY" && nextGale > entryGale) return true;
    if (dir === "SELL" && nextGale < entryGale) return true;

    return false;
}

/* ----------------- FILTRO: VELAS ELEFANTE (NOTICIAS) ----------------- */
function isElephantCandle(candles, i) {
    if (i < 10) return false;
    let body = Math.abs(candles[i].close - candles[i].open);

    // Promedio cuerpo ultimas 10 velas
    let sum = 0;
    for (let k = 1; k <= 10; k++) {
        sum += Math.abs(candles[i - k].close - candles[i - k].open);
    }
    let avg = sum / 10;

    // Si la vela es 3 veces más grande que el promedio -> Elefante (Posible noticia)
    return body > (avg * 3);
}

/* ----------------- CONFIDENCIA DINÁMICA (WINRATE REAL) ----------------- */
// Calcula el % de acierto de esta estrategia exacta en las ultimas 36-48h según mercado
// Esto reemplaza a la confianza estática
function calculateDynamicWinrate(candles, currentIndex, dir, s20, s50, rsiArr, adxArr, stochArr, marketConfig) {
    let wins = 0;
    let total = 0;
    const LOOKBACK = marketConfig.winrate.lookback;
    const startCheck = Math.max(50, currentIndex - LOOKBACK);

    for (let j = startCheck; j < currentIndex; j++) {
        // Reproducir lógica de entrada EXACTA (Sincronizada con Main Loop)
        // Usa valores específicos del mercado
        let buy = s20[j] > s50[j] && rsiArr[j] > marketConfig.rsi.buy;
        let sell = s20[j] < s50[j] && rsiArr[j] < marketConfig.rsi.sell;

        // NEW FILTERS CHECK (con valores del mercado)
        if (buy) {
            if (adxArr[j] < marketConfig.adx.min || stochArr[j].k < marketConfig.stoch.buy) buy = false;
        }
        if (sell) {
            if (adxArr[j] < marketConfig.adx.min || stochArr[j].k > marketConfig.stoch.sell) sell = false;
        }

        if (!buy && !sell) continue;

        // Debe coincidir la dirección para ser estadística relevante
        let signalDir = buy ? "BUY" : "SELL";
        if (signalDir !== dir) continue;

        // Filtros (Deben coincidir también)
        if (isElephantCandle(candles, j)) continue;

        // Verificar resultado
        total++;
        if (validateGale(candles, j, signalDir)) {
            wins++;
        }
    }

    // Mínimo de matches históricos según mercado
    if (total < marketConfig.winrate.minMatches) return 0;
    return Math.floor((wins / total) * 100);
}


/* ----------------- FETCH TWELVEDATA ----------------- */
async function fetchData(pair, days, key) {
    // Convertir formato OTC si es necesario (EURUSD-OTC → EUR/USD)
    const apiPair = convertirParAPI(pair);
    const symbol = encodeURIComponent(apiPair);
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${key}&format=json&outputsize=5000`;

    const r = await fetch(url);
    const j = await r.json();

    if (!j.values) {
        throw new Error(`No data for ${pair}. Resp: ${JSON.stringify(j)}`);
    }

    let candles = j.values
        .map(v => ({
            time: new Date(v.datetime + "Z"),
            open: parseFloat(v.open),
            high: parseFloat(v.high),
            low: parseFloat(v.low),
            close: parseFloat(v.close)
        }))
        .sort((a, b) => a.time - b.time);

    let cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return candles.filter(c => c.time >= cutoff);
}

/* ----------------- OTC REALISTA ----------------- */
function generateOTCSynthetic(realCandles) {
    let synthetic = [];
    let drift = 0;
    let intensity = 0.0002;

    for (let i = 0; i < realCandles.length; i++) {
        let base = realCandles[i].close;
        let openBase = realCandles[i].open;

        if (i % Math.floor(20 + Math.random() * 20) === 0) {
            drift = (Math.random() - 0.5) * 0.002;
        }

        let noise = (Math.random() - 0.5) * intensity;

        // Simular Open/Close relativo
        let bodySize = base - openBase;
        let sOpen = realCandles[i].open + drift + noise;
        let sClose = realCandles[i].close + drift + noise;

        // Simular High/Low coherentes
        let sHigh = Math.max(sOpen, sClose) + (Math.random() * 0.0005);
        let sLow = Math.min(sOpen, sClose) - (Math.random() * 0.0005);

        synthetic.push({
            time: new Date(realCandles[i].time.getTime() + 3600000),
            open: sOpen,
            high: sHigh,
            low: sLow,
            close: sClose
        });
    }

    return synthetic;
}

/* ----------------- RENDER TABLE ----------------- */
function renderSignals(signals) {
    resBody.innerHTML = signals.map(s => {
        let colorClass = s.dir === "BUY" ? "buy" : "sell";
        // Hex codes matching New Dark Theme Palette
        let colorHex = s.dir === "BUY" ? "#00e676" : "#ff1744";

        return `
            <tr>
                <td style="font-weight:bold; color: #fff;">${s.time}</td>
                <td><span style="color:#ddd">${s.pair}</span></td>
                <td><span class="badge ${colorClass}">${s.dir}</span></td>
                <td>
                    <div class="confidence-container">
                        <span style="min-width:30px; font-weight:bold">${s.conf}%</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width:${s.conf}%; background:${colorHex}"></div>
                        </div>
                    </div>
                </td>
                <td style="color:#777; font-size:0.8em">WINRATE 48H</td>
            </tr>
        `;
    }).join("");
    signalCount.textContent = `${signals.length} Señales`;
}

/* ----------------- EJECUCIÓN ----------------- */
document.getElementById("run").onclick = async () => {
    resBody.innerHTML = "";
    logBox.textContent = "";
    log("Iniciando análisis cuántico...");

    // UI Feedback
    const btn = document.getElementById("run");
    const originalText = btn.textContent;
    btn.textContent = "Analizando...";
    btn.disabled = true;

    try {
        const key = apikey.value.trim();
        if (!key) {
            log("⚠ Falta API Key");
            alert("Error: Ingrese su API Key de TwelveData");
            return;
        }

        const selectedPairs = [...pairsSelect.selectedOptions].map(o => o.value);
        if (selectedPairs.length === 0) {
            log("⚠ Sin pares seleccionados");
            return alert("Selecciona al menos un par");
        }

        const days = Math.min(parseInt(daysInput.value) || 10, 20);
        const analysisHours = parseInt(hoursInput.value) || 3;
        const globalMinConf = parseInt(minConfInput.value) || 70;
        const offset = parseFloat(offsetInput.value) || -3; // Default Brazil UTC-3

        // Parametros ajustados para precisión
        perfilData = {
            minConf: globalMinConf,
            minSignalSpacing: 15
        };

        let signals = [];
        const usedMinutesGlobal = new Set();
        const usedMinutesPerPair = new Map();

        const now = new Date();
        // Calcular hora Brasil correctamente desde UTC
        const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000)); // Convertir a UTC
        const brasilTime = new Date(utcNow.getTime() - (3 * 3600000)); // UTC-3

        // LÓGICA: Empezar análisis desde la hora actual de Brasil
        const targetHourBrasil = new Date(brasilTime.getTime()); // Quitamos el +2h fijo
        const startHour = targetHourBrasil.getHours();
        const startMin = targetHourBrasil.getMinutes();

        // Rango de N horas desde la hora objetivo
        const endTime = new Date(targetHourBrasil.getTime() + analysisHours * 3600000);
        const endHour = endTime.getHours();
        const endMin = endTime.getMinutes();

        log(`Hora Brasil: ${time24(brasilTime)} | Analizando: ${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')} - ${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')} (${analysisHours}h) | Contexto: ${days} días`);

        function timeToMinutes(hm) {
            let [h, m] = hm.split(":").map(Number);
            return h * 60 + m;
        }

        // Helper: verifica si una hora está dentro del rango (maneja cruce de medianoche)
        function isInTimeRange(candleTime) {
            const h = candleTime.getHours();
            const m = candleTime.getMinutes();
            const candleMins = h * 60 + m;
            const startMins = startHour * 60 + startMin;
            const endMins = endHour * 60 + endMin;

            if (startMins <= endMins) {
                // Rango normal (ej: 07:00 - 10:00)
                return candleMins >= startMins && candleMins < endMins;
            } else {
                // Cruce de medianoche (ej: 23:00 - 02:00)
                return candleMins >= startMins || candleMins < endMins;
            }
        }

        // DEBUG COUNTERS
        let stats = {
            candidates: 0,
            noTrend: 0,
            lowVol: 0,
            lowAdx: 0,
            badStoch: 0,
            elephant: 0,
            lowWinrate: 0,
            ok: 0
        };

        // MAIN LOOP (Simplificado - un solo loop para todos los pares)
        for (const pair of selectedPairs) {
            // Obtener configuración específica del mercado
            const marketConfig = getConfig(pair);


            let realData;
            try {
                realData = await fetchData(pair, days, key);
            } catch (e) {
                log(`Skipping ${pair}: ${e.message.substring(0, 15)}...`);
                continue;
            }

            if (realData.length === 0) {
                log(`⚠ Sin datos para ${pair}`);
                continue;
            }

            // Pre-calcular indicadores para eficiencia
            let closes = realData.map(c => c.close);
            let s20 = sma(closes, 20);
            let s50 = sma(closes, 50);
            let r = rsi(closes);
            let bb = bollinger(closes, 20, 2);
            let adxArr = calculateADX(realData, 14);
            let stochArr = calculateStoch(realData, 14, 3, 3);

            // Filtrar velas que coincidan con el RANGO HORARIO (no fecha)
            // Busca en TODO el historial velas que estén en la ventana 07:00-10:00 (ejemplo)
            let candidatesIdx = [];
            for (let i = 0; i < realData.length; i++) {
                if (isInTimeRange(realData[i].time)) {
                    candidatesIdx.push(i);
                }
            }

            if (candidatesIdx.length === 0) {
                log(`⚠ Sin velas en rango horario para ${pair}`);
                continue;
            }

            if (!usedMinutesPerPair.has(pair)) usedMinutesPerPair.set(pair, []);
            let timesForPair = usedMinutesPerPair.get(pair);

            for (let i of candidatesIdx) {
                stats.candidates++;

                // 1. FILTRO VOLATILIDAD (Bollinger Squeeze) - Dinámico por mercado
                if (bb[i].width < marketConfig.bollinger.minWidth) {
                    stats.lowVol++;
                    continue;
                }

                // 2. Lógica Base - Dinámico por mercado
                // OTC usa umbrales más permisivos que Real
                let buy = s20[i] > s50[i] && r[i] > marketConfig.rsi.buy;
                let sell = s20[i] < s50[i] && r[i] < marketConfig.rsi.sell;
                if (!buy && !sell) {
                    stats.noTrend++;
                    continue;
                }

                let tendencia = buy ? "BUY" : "SELL";

                // 2.a FILTRO ADX (Ruptura Falsa) - Dinámico por mercado
                if (adxArr[i] < marketConfig.adx.min) {
                    stats.lowAdx++;
                    continue;
                }

                // 2.b FILTRO ESTOCÁSTICO (Confirmación Momentum) - Dinámico por mercado
                if (tendencia === "BUY" && stochArr[i].k < marketConfig.stoch.buy) {
                    stats.badStoch++;
                    continue;
                }
                if (tendencia === "SELL" && stochArr[i].k > marketConfig.stoch.sell) {
                    stats.badStoch++;
                    continue;
                }

                // 3. FILTRO ELEFANTE (Noticias)
                if (isElephantCandle(realData, i)) {
                    stats.elephant++;
                    continue;
                }

                // 4. DETECTOR DE DIVERGENCIAS (BOOST)
                let divergence = detectDivergence(realData, i, r, 5);

                // 5. CONFIDENCIA DINÁMICA (WINRATE REAL) - Con config de mercado
                let winrate = calculateDynamicWinrate(realData, i, tendencia, s20, s50, r, adxArr, stochArr, marketConfig);

                // BOOST: Si hay divergencia alineada con la tendencia, +10% winrate
                if ((divergence.type === 'bullish' && tendencia === 'BUY') ||
                    (divergence.type === 'bearish' && tendencia === 'SELL')) {
                    winrate = Math.min(winrate + 10, 100);
                }

                if (winrate < perfilData.minConf) {
                    stats.lowWinrate++;
                    continue;
                }

                // 6. VALIDACIÓN GALE
                if (!validateGale(realData, i, tendencia)) continue;

                // Anti-Overlap
                let t = realData[i].time;
                let keyTime = time24(t);
                if (usedMinutesGlobal.has(keyTime)) continue;

                let currentMins = timeToMinutes(keyTime);
                let tooClose = timesForPair.some(
                    tm => Math.abs(currentMins - timeToMinutes(tm)) < perfilData.minSignalSpacing
                );
                if (tooClose) continue;

                usedMinutesGlobal.add(keyTime);
                timesForPair.push(keyTime);
                stats.ok++;

                signals.push({
                    time: keyTime,
                    pair: pair,
                    dir: tendencia,
                    conf: winrate
                });
            }
        }

        // FILTRO FINAL: Correlación
        let preFilterCount = signals.length;
        signals = filterCorrelatedSignals(signals);
        let correlationFiltered = preFilterCount - signals.length;

        signals.sort((a, b) => a.time.localeCompare(b.time));
        renderSignals(signals);
        log(`Resultados: ${signals.length} señales (🔗 ${correlationFiltered} filtradas por correlación).`);
        log(`Stats: 🔍 Check: ${stats.candidates} | 💤 NoTrend: ${stats.noTrend} | 🐌 LowADX: ${stats.lowAdx} | ⚡ Momentum: ${stats.badStoch} | 📉 PocaVol: ${stats.lowVol} | 🐘 News: ${stats.elephant} | 🧪 BadWinrate: ${stats.lowWinrate}`);

    } catch (err) {
        log(`❌ Error fatal: ${err.message}`);
        console.error(err);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
};

/* ----------------- INTERFAZ UI / UX ----------------- */
(function initUI() {
    const btnToggle = document.getElementById('btn-toggle');
    const sidebar = document.getElementById('sidebar');
    const btnChart = document.getElementById('btn-chart');
    const placeholderBox = document.getElementById('placeholder-box');
    const chartArea = document.getElementById('chart-area');

    // Estado del Chart
    let isChartLoaded = false;
    let tvScriptAvailable = false;

    // --- SIDEBAR MOBILE ---
    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            if (sidebar.style.left === '0px') {
                sidebar.style.left = '-100%';
            } else {
                sidebar.style.left = '0px';
            }
        });

        // Cerrar al dar click fuera (Móvil)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (sidebar && !sidebar.contains(e.target) && !btnToggle.contains(e.target)) {
                    sidebar.style.left = '-100%';
                }
            }
        });
    }

    // --- FUNCIÓN CARGA WIDGET ---
    function loadTvWidget(symbol) {
        if (!window.TradingView) return; // Seguridad

        // Limpiar área (quita el placeholder si aun existe o el widget viejo)
        chartArea.innerHTML = "";

        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "1",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "es",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": "chart-area"
        });
    }

    // --- BOTÓN CARGAR GRÁFICO (LAZY LOAD) ---
    if (btnChart) {
        btnChart.addEventListener('click', () => {
            isChartLoaded = true;
            // Ocultar placeholder visualmente inmediato
            placeholderBox.style.display = 'none';

            // Obtener par actual o default
            let initialPair = "EUR/USD";
            if (pairsSelect.selectedOptions.length > 0) {
                initialPair = pairsSelect.selectedOptions[0].value;
            }
            const symbol = "FX:" + initialPair.replace("/", "");

            if (tvScriptAvailable && window.TradingView) {
                loadTvWidget(symbol);
            } else {
                // Inyectar Script
                const script = document.createElement('script');
                script.src = 'https://s3.tradingview.com/tv.js';
                script.onload = () => {
                    tvScriptAvailable = true;
                    loadTvWidget(symbol);
                };
                document.head.appendChild(script);
            }
        });
    }

    // --- SINCRONIZACIÓN AUTOMÁTICA AL CAMBIAR PAR ---
    if (pairsSelect) {
        pairsSelect.addEventListener('change', () => {
            // Solo si el chart ya fue activado por el usuario
            if (!isChartLoaded) return;

            // Tomamos el "último" o primer valor activo.
            // En multiselect estándar, .value da el primero seleccionado.
            const val = pairsSelect.value;
            if (!val) return;

            // Logica simple para Forex. Ajustar si usas cryptos luego.
            const symbol = "FX:" + val.replace("/", ""); // EUR/USD -> FX:EURUSD

            // Actualizar widget
            loadTvWidget(symbol);
        });
    }

    // --- CAMBIAR NOMBRE PESTAÑA SI SE MINIMIZA (DETALLE DE LUJO) ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = "⚠️ NEXUS | Análisis en pausa";
        } else {
            document.title = "❖ NEXUS | Intelligent Trading";
        }
    });

    // --- SELECTOR DINÁMICO DE PARES SEGÚN MERCADO ---
    modeSelect.onchange = () => {
        pairsSelect.innerHTML = "";

        let lista = modeSelect.value === "otc" ? paresOTC : paresReales;

        lista.forEach(pair => {
            const op = document.createElement("option");
            op.textContent = pair;
            op.value = pair;
            pairsSelect.appendChild(op);
        });
    };

    // Inicializar lista al cargar
    modeSelect.onchange();


    // --- MAXIMIZAR / MINIMIZAR ---
    const btnMaximize = document.getElementById('btn-maximize');
    const resultsPanel = document.querySelector('.results-panel');
    const multiMarketSelect = document.getElementById('multi-market-select');
    const multiPairList = document.getElementById('multi-pair-list');
    const btnRunMulti = document.getElementById('btn-run-multi');
    const multiProgress = document.getElementById('multi-progress');
    let multiPairResults = {}; // Store results by pair: { "EUR/USD": [...], "GBP/USD": [...] }

    btnMaximize.addEventListener('click', () => {
        resultsPanel.classList.toggle('maximized');
        const isMaximized = resultsPanel.classList.contains('maximized');

        if (isMaximized) {
            updateMultiPairList();
        } else {
            // Limpiar tabs al minimizar si se desea
            document.getElementById('tabs-container').innerHTML = "";
        }
    });

    if (multiMarketSelect) {
        multiMarketSelect.addEventListener('change', updateMultiPairList);
    }

    function updateMultiPairList() {
        multiPairList.innerHTML = "";
        const mode = multiMarketSelect ? multiMarketSelect.value : modeSelect.value;
        let lista = mode === "otc" ? paresOTC : paresReales;

        lista.forEach(pair => {
            const label = document.createElement('label');
            label.className = 'pair-checkbox';
            label.innerHTML = `<input type="checkbox" value="${pair}"> ${pair}`;
            multiPairList.appendChild(label);
        });
    }

    function renderTabs(pairsProcessed) {
        const tabsContainer = document.getElementById('tabs-container');
        tabsContainer.innerHTML = "";

        if (pairsProcessed.length === 0) return;

        // "Ver Todo" Tab
        const allTab = document.createElement('div');
        allTab.className = 'tab-item active';
        allTab.textContent = "VER TODO";
        allTab.onclick = () => {
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            allTab.classList.add('active');
            let allSignals = Object.values(multiPairResults).flat();
            allSignals.sort((a, b) => a.time.localeCompare(b.time));
            renderSignals(allSignals);
        };
        tabsContainer.appendChild(allTab);

        // Individual Pair Tabs
        pairsProcessed.forEach(pair => {
            const count = multiPairResults[pair] ? multiPairResults[pair].length : 0;
            if (count === 0) return;

            const tab = document.createElement('div');
            tab.className = 'tab-item';
            tab.textContent = `${pair} (${count})`;
            tab.onclick = () => {
                document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderSignals(multiPairResults[pair] || []);
            };
            tabsContainer.appendChild(tab);
        });
    }

    btnRunMulti.addEventListener('click', async () => {
        const checked = [...multiPairList.querySelectorAll('input:checked')].map(i => i.value);
        if (checked.length === 0) return alert("Selecciona al menos un par.");

        const originalText = btnRunMulti.textContent;
        btnRunMulti.textContent = "Analizando...";
        btnRunMulti.disabled = true;
        multiProgress.textContent = "Iniciando análisis múltiple...";

        const apikeyVal = apikey.value.trim();
        if (!apikeyVal) {
            alert("Error: Ingrese su API Key");
            btnRunMulti.textContent = originalText;
            btnRunMulti.disabled = false;
            return;
        }

        multiPairResults = {};
        let count = 0;
        const usedMinutesGlobal = new Set();
        const usedMinutesPerPair = new Map();

        resBody.innerHTML = "";

        for (const pair of checked) {
            count++;
            multiProgress.textContent = `Analizando ${pair} (${count}/${checked.length})...`;

            try {
                const signals = await analyzePair(pair, apikeyVal, usedMinutesGlobal, usedMinutesPerPair);
                multiPairResults[pair] = signals;

                // Mostrar progreso parcial (Ver Todo)
                let currentAll = Object.values(multiPairResults).flat();
                currentAll.sort((a, b) => a.time.localeCompare(b.time));
                renderSignals(currentAll);
            } catch (e) {
                console.error(`Error analizando ${pair}:`, e);
            }

            await new Promise(r => setTimeout(r, 500));
        }

        // Final Filter & Render
        let finalSignals = Object.values(multiPairResults).flat();
        finalSignals = filterCorrelatedSignals(finalSignals);
        finalSignals.sort((a, b) => a.time.localeCompare(b.time));

        // Update the grouped results after correlation filter if needed
        // (Correlation filter might remove signals across pairs, let's keep it simple for tabs)

        renderSignals(finalSignals);
        renderTabs(checked);

        multiProgress.textContent = `Análisis completado. ${finalSignals.length} señales encontradas.`;
        btnRunMulti.textContent = originalText;
        btnRunMulti.disabled = false;
    });

    async function analyzePair(pair, key, usedGlobal, usedPerPair) {
        const days = Math.min(parseInt(daysInput.value) || 10, 20);
        const analysisHours = parseInt(hoursInput.value) || 3;
        const globalMinConf = parseInt(minConfInput.value) || 70;
        const marketConfig = getConfig(pair);

        const realData = await fetchData(pair, days, key);
        if (!realData || realData.length === 0) return [];

        let closes = realData.map(c => c.close);
        let s20 = sma(closes, 20);
        let s50 = sma(closes, 50);
        let r = rsi(closes);
        let bb = bollinger(closes, 20, 2);
        let adxArr = calculateADX(realData, 14);
        let stochArr = calculateStoch(realData, 14, 3, 3);

        const now = new Date();
        const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        const brasilTime = new Date(utcNow.getTime() - (3 * 3600000));
        const targetHourBrasil = new Date(brasilTime.getTime());

        const startHour = targetHourBrasil.getHours();
        const startMin = targetHourBrasil.getMinutes();
        const endTimeR = new Date(targetHourBrasil.getTime() + analysisHours * 3600000);
        const endHour = endTimeR.getHours();
        const endMin = endTimeR.getMinutes();

        if (!usedPerPair.has(pair)) usedPerPair.set(pair, []);
        let timesForPair = usedPerPair.get(pair);

        function isInRange(candleTime) {
            const h = candleTime.getHours();
            const m = candleTime.getMinutes();
            const candleMins = h * 60 + m;
            const startMins = startHour * 60 + startMin;
            const endMins = endHour * 60 + endMin;
            if (startMins <= endMins) return candleMins >= startMins && candleMins < endMins;
            return candleMins >= startMins || candleMins < endMins;
        }

        function timeToMin(hm) {
            let [h, m] = hm.split(":").map(Number);
            return h * 60 + m;
        }

        let signals = [];
        for (let i = 50; i < realData.length; i++) {
            if (!isInRange(realData[i].time)) continue;
            if (bb[i].width < marketConfig.bollinger.minWidth) continue;

            let buy = s20[i] > s50[i] && r[i] > marketConfig.rsi.buy;
            let sell = s20[i] < s50[i] && r[i] < marketConfig.rsi.sell;
            if (!buy && !sell) continue;

            let tendencia = buy ? "BUY" : "SELL";
            if (adxArr[i] < marketConfig.adx.min) continue;
            if (tendencia === "BUY" && stochArr[i].k < marketConfig.stoch.buy) continue;
            if (tendencia === "SELL" && stochArr[i].k > marketConfig.stoch.sell) continue;
            if (isElephantCandle(realData, i)) continue;

            let winrate = calculateDynamicWinrate(realData, i, tendencia, s20, s50, r, adxArr, stochArr, marketConfig);
            if (winrate < globalMinConf) continue;
            if (!validateGale(realData, i, tendencia)) continue;

            let keyTime = time24(realData[i].time);
            if (usedGlobal.has(keyTime)) continue;

            let curMins = timeToMin(keyTime);
            let tooClose = timesForPair.some(tm => Math.abs(curMins - timeToMin(tm)) < 15);
            if (tooClose) continue;

            usedGlobal.add(keyTime);
            timesForPair.push(keyTime);

            signals.push({
                time: keyTime,
                pair: pair,
                dir: tendencia,
                conf: winrate
            });
        }
        return signals;
    }

})();
