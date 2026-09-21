import { useState, useMemo, useEffect } from "react";


const img = (seed) => `https://picsum.photos/seed/${seed}/240/240`;

const FLIGHTS = [
  {
    id: 1,
    air: "Emirates",
    code: "EK 621",
    dep: "06:20",
    arr: "08:48",
    min: 148,
    stops: 0,
    price: 104,
    rate: 4.2,
    rev: 54,
    trip: "round",
    plane: "Airbus A380",
    poster: img("emirates-a380"),
  },
  {
    id: 2,
    air: "Fly Dubai",
    code: "FZ 332",
    dep: "09:10",
    arr: "12:05",
    min: 175,
    stops: 1,
    price: 128,
    rate: 4.0,
    rev: 41,
    trip: "round",
    plane: "Boeing 737",
    poster: img("flydubai-737"),
  },
  {
    id: 3,
    air: "Qatar Airways",
    code: "QR 604",
    dep: "14:00",
    arr: "16:35",
    min: 155,
    stops: 0,
    price: 156,
    rate: 4.6,
    rev: 112,
    trip: "round",
    plane: "Airbus A350",
    poster: img("qatar-a350"),
  },
  {
    id: 4,
    air: "Etihad",
    code: "EY 233",
    dep: "18:45",
    arr: "21:50",
    min: 185,
    stops: 1,
    price: 142,
    rate: 4.4,
    rev: 76,
    trip: "one",
    plane: "Boeing 787",
    poster: img("etihad-787"),
  },
  {
    id: 5,
    air: "Turkish Airlines",
    code: "TK 710",
    dep: "05:15",
    arr: "07:40",
    min: 145,
    stops: 0,
    price: 189,
    rate: 4.7,
    rev: 203,
    trip: "round",
    plane: "Airbus A321",
    poster: img("turkish-a321"),
  },
  {
    id: 6,
    air: "PIA",
    code: "PK 303",
    dep: "11:30",
    arr: "14:20",
    min: 170,
    stops: 0,
    price: 92,
    rate: 3.6,
    rev: 38,
    trip: "one",
    plane: "Airbus A320",
    poster: img("pia-a320"),
  },
  {
    id: 7,
    air: "AirBlue",
    code: "PA 200",
    dep: "16:05",
    arr: "18:30",
    min: 145,
    stops: 0,
    price: 98,
    rate: 3.9,
    rev: 29,
    trip: "one",
    plane: "Airbus A320",
    poster: img("airblue-a320"),
  },
  {
    id: 8,
    air: "SereneAir",
    code: "ER 502",
    dep: "20:10",
    arr: "22:55",
    min: 165,
    stops: 0,
    price: 115,
    rate: 4.1,
    rev: 47,
    trip: "round",
    plane: "Boeing 737",
    poster: img("serene-737"),
  },
  {
    id: 9,
    air: "Emirates",
    code: "EK 607",
    dep: "22:40",
    arr: "01:20",
    min: 160,
    stops: 0,
    price: 167,
    rate: 4.5,
    rev: 88,
    trip: "multi",
    plane: "Boeing 777",
    poster: img("emirates-777"),
  },
  {
    id: 10,
    air: "Qatar Airways",
    code: "QR 632",
    dep: "07:50",
    arr: "11:40",
    min: 230,
    stops: 1,
    price: 134,
    rate: 4.3,
    rev: 65,
    trip: "multi",
    plane: "Airbus A330",
    poster: img("qatar-a330"),
  },
  {
    id: 11,
    air: "Fly Dubai",
    code: "FZ 338",
    dep: "13:20",
    arr: "16:50",
    min: 210,
    stops: 2,
    price: 119,
    rate: 3.8,
    rev: 33,
    trip: "round",
    plane: "Boeing 737",
    poster: img("flydubai-737b"),
  },
  {
    id: 12,
    air: "Etihad",
    code: "EY 241",
    dep: "10:05",
    arr: "12:35",
    min: 150,
    stops: 0,
    price: 178,
    rate: 4.8,
    rev: 151,
    trip: "round",
    plane: "Boeing 787",
    poster: img("etihad-787b"),
  },
];

const BRAND = {
  Emirates: "#D71921",
  "Fly Dubai": "#F58220",
  "Qatar Airways": "#8E0F4E",
  Etihad: "#BD8B13",
  "Turkish Airlines": "#C8102E",
  PIA: "#0E9E63",
  AirBlue: "#3D9BE9",
  SereneAir: "#39A3B6",
};
const TRIP_LABEL = {
  round: "Туда-обратно",
  one: "В одну сторону",
  multi: "Мульти-город",
};
const STOP_LABEL = (n) =>
  n === 0 ? "без пересадок" : n === 1 ? "1 пересадка" : n + " пересадки";

const money = (n) => "$" + Math.round(n).toLocaleString("ru-RU");
const dur = (m) => `${Math.floor(m / 60)}ч ${String(m % 60).padStart(2, "0")}м`;
const hourOf = (t) =>
  parseInt(t.slice(0, 2), 10) + parseInt(t.slice(3), 10) / 60;
const plural = (n, a, b, c) =>
  n % 10 === 1 && n % 100 !== 11
    ? a
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? b
      : c;

const PANEL =
  "bg-paper dark:bg-paper-dark border border-line dark:border-line-dark rounded-2xl";

/* ---------------- dual range ---------------- */
function DualRange({ min, max, step, value, onChange, format }) {
  const [lo, hi] = value;
  const pct = (v) => ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div className="relative h-6 mx-1">
        <div className="absolute inset-x-0 top-[10px] h-1 rounded bg-line dark:bg-line-dark" />
        <div
          className="absolute top-[10px] h-1 rounded bg-mint"
          style={{ left: pct(lo) + "%", width: pct(hi) - pct(lo) + "%" }}
        />
        <input
          type="range"
          className="thumb absolute inset-x-0 top-0 h-6 w-full m-0"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label="Минимум"
          onChange={(e) => onChange([Math.min(+e.target.value, hi - step), hi])}
        />
        <input
          type="range"
          className="thumb absolute inset-x-0 top-0 h-6 w-full m-0"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label="Максимум"
          onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + step)])}
        />
      </div>
      <div className="flex justify-between text-[11.5px] font-semibold text-muted dark:text-muted-dark mt-1">
        <span>{format(lo)}</span>
        <span>{format(hi)}</span>
      </div>
    </div>
  );
}

/* ---------------- filter group ---------------- */
function Group({ title, children, first }) {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={
        first ? "py-3" : "border-t border-line dark:border-line-dark py-3"
      }
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-[13px] font-semibold"
      >
        {title}
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          className={"transition-transform " + (open ? "rotate-180" : "")}
        >
          <path d="M1 1l4.5 5L10 1" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      {open && <div className="pt-3.5">{children}</div>}
    </div>
  );
}

function Check({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 py-1 text-[12.5px] cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-[15px] h-[15px] accent-mint"
      />
      <span>{label}</span>
      <span className="ml-auto text-[11.5px] text-muted dark:text-muted-dark">
        {count}
      </span>
    </label>
  );
}

/* ---------------- filters ---------------- */
function Filters({ f, set, reset }) {
  const airlines = useMemo(
    () => [...new Set(FLIGHTS.map((x) => x.air))].sort(),
    [],
  );
  const toggle = (key, v) => {
    const next = new Set(f[key]);
    next.has(v) ? next.delete(v) : next.add(v);
    set({ ...f, [key]: next });
  };
  return (
    <aside className={PANEL + " p-4 lg:sticky lg:top-[92px]"}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold">Фильтры</h2>
        <button
          onClick={reset}
          className="text-[12px] font-semibold text-muted dark:text-muted-dark underline"
        >
          Сбросить
        </button>
      </div>

      <Group title="Цена" first>
        <DualRange
          min={50}
          max={400}
          step={5}
          value={f.price}
          onChange={(v) => set({ ...f, price: v })}
          format={(v) => money(v) + (v >= 400 ? "+" : "")}
        />
      </Group>

      <Group title="Время вылета">
        <DualRange
          min={0}
          max={24}
          step={1}
          value={f.time}
          onChange={(v) => set({ ...f, time: v })}
          format={(v) => String(v).padStart(2, "0") + ":00"}
        />
      </Group>

      <Group title="Рейтинг">
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => set({ ...f, rate: r })}
              aria-pressed={f.rate === r}
              className={
                "rounded-lg px-2.5 py-1.5 text-[12px] font-semibold border " +
                (f.rate === r
                  ? "bg-mint border-mint text-ink"
                  : "border-line dark:border-line-dark")
              }
            >
              {r === 0 ? "Любой" : r + "+"}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Пересадки">
        {[0, 1, 2].map((s) => (
          <Check
            key={s}
            label={STOP_LABEL(s)}
            checked={f.stops.has(s)}
            count={FLIGHTS.filter((x) => x.stops === s).length}
            onChange={() => toggle("stops", s)}
          />
        ))}
      </Group>

      <Group title="Авиакомпании">
        {airlines.map((a) => (
          <Check
            key={a}
            label={a}
            checked={f.airlines.has(a)}
            count={FLIGHTS.filter((x) => x.air === a).length}
            onChange={() => toggle("airlines", a)}
          />
        ))}
      </Group>
    </aside>
  );
}

/* ---------------- flight card ---------------- */
function FlightCard({ f, inCart, liked, onAdd, onLike }) {
  return (
    <article
      className={
        PANEL +
        " grid sm:grid-cols-[118px_minmax(0,1fr)] overflow-hidden mb-3.5 transition-shadow hover:shadow-lg hover:shadow-mint/10"
      }
    >
      <div
        className="relative flex sm:flex-col items-center justify-center gap-1.5 p-3 sm:p-4
                    border-b sm:border-b-0 sm:border-r border-line dark:border-line-dark text-center overflow-hidden"
      >
        <img
          src={f.poster}
          alt={`${f.air} · ${f.plane}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.14] dark:opacity-[0.22]"
        />
        <div
          className="relative font-bold text-[13px] leading-tight"
          style={{ color: BRAND[f.air] }}
        >
          {f.air}
        </div>
        <div className="relative text-[11px] font-semibold text-muted dark:text-muted-dark">
          {f.code}
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] font-semibold">
            <span className="bg-mint text-ink rounded-md px-1.5 py-0.5 text-[11.5px] font-bold">
              {f.rate.toFixed(1)}
            </span>
            <span>
              {f.rate >= 4.5
                ? "Отлично"
                : f.rate >= 4
                  ? "Очень хорошо"
                  : "Хорошо"}{" "}
              · {f.rev} отзывов
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10.5px] text-muted dark:text-muted-dark">
              от
            </span>
            <b className="text-[19px] text-price">{money(f.price)}</b>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 text-[12.5px]">
          <span className="font-semibold whitespace-nowrap">
            {f.dep}{" "}
            <span className="font-normal text-muted dark:text-muted-dark">
              Лахор (LHE)
            </span>
          </span>
          <span className="relative h-px bg-line dark:bg-line-dark">
            <span className="absolute left-1/2 -ml-[3.5px] -top-[3px] w-[7px] h-[7px] rounded-full bg-mint" />
          </span>
          <span className="text-muted dark:text-muted-dark whitespace-nowrap hidden sm:inline">
            {STOP_LABEL(f.stops)}
          </span>
          <span className="font-semibold whitespace-nowrap">
            {f.arr}{" "}
            <span className="font-normal text-muted dark:text-muted-dark">
              Карачи (KHI)
            </span>
          </span>
        </div>

        <div className="mt-3.5 pt-3 border-t border-line dark:border-line-dark flex flex-wrap items-center gap-2">
          {[dur(f.min), f.plane, TRIP_LABEL[f.trip]].map((t) => (
            <span
              key={t}
              className="text-[11px] font-semibold text-muted dark:text-muted-dark
                        border border-line dark:border-line-dark rounded-md px-2 py-0.5"
            >
              {t}
            </span>
          ))}
          <button
            onClick={onLike}
            aria-pressed={liked}
            aria-label="В избранное"
            className="border border-line dark:border-line-dark rounded-lg p-2 leading-none"
          >
            <svg
              width="15"
              height="14"
              viewBox="0 0 24 22"
              fill={liked ? "#FF8682" : "none"}
              stroke={liked ? "#FF8682" : "currentColor"}
              strokeWidth="2"
            >
              <path d="M12 20.5 3.6 12A5.2 5.2 0 0 1 12 6a5.2 5.2 0 0 1 8.4 6L12 20.5Z" />
            </svg>
          </button>
          <button
            onClick={onAdd}
            className={
              "ml-auto w-full sm:w-auto rounded-lg px-6 py-2.5 text-[13px] font-bold transition " +
              (inCart
                ? "bg-ink text-white dark:bg-mint dark:text-ink"
                : "bg-mint text-ink hover:brightness-95")
            }
          >
            {inCart ? "В корзине ✓" : "Добавить"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- cart ---------------- */
function Cart({ cart, setCart, className = "" }) {
  const entries = [...cart.entries()];
  const seats = entries.reduce((s, [, q]) => s + q, 0);
  const sub = entries.reduce(
    (s, [id, q]) => s + FLIGHTS.find((x) => x.id === id).price * q,
    0,
  );
  const fees = Math.round(sub * 0.08);
  const svc = seats * 6;
  const grand = sub + fees + svc;
  const [done, setDone] = useState(false);

  const qty = (id, d) => {
    const next = new Map(cart);
    const q = (next.get(id) || 0) + d;
    q <= 0 ? next.delete(id) : next.set(id, Math.min(q, 9));
    setCart(next);
  };

  return (
    <aside className={PANEL + " p-4 " + className}>
      <h2 className="text-[15px] font-semibold">Ваш заказ</h2>
      <p className="text-[11.5px] text-muted dark:text-muted-dark mb-3">
        Цены за одного пассажира, эконом
      </p>

      <div className="flex flex-col gap-2.5 max-h-[46vh] overflow-auto">
        {!entries.length && (
          <div
            className="border border-dashed border-line dark:border-line-dark rounded-xl
                        p-6 text-center text-[12.5px] text-muted dark:text-muted-dark"
          >
            Выберите рейс, чтобы собрать бронь
          </div>
        )}
        {entries.map(([id, q]) => {
          const f = FLIGHTS.find((x) => x.id === id);
          return (
            <div
              key={id}
              className="border border-line dark:border-line-dark rounded-xl p-2.5"
            >
              <div className="flex justify-between gap-2 text-[12.5px] font-semibold">
                <span>
                  {f.air} {f.code}
                </span>
                <span>{money(f.price * q)}</span>
              </div>
              <div className="text-[11px] text-muted dark:text-muted-dark mt-0.5">
                {f.dep}–{f.arr} · {dur(f.min)} · LHE→KHI
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => qty(id, -1)}
                  aria-label="Меньше"
                  className="w-6 h-6 rounded-md border border-line dark:border-line-dark font-bold grid place-items-center"
                >
                  −
                </button>
                <span className="text-[12.5px] font-semibold w-4 text-center">
                  {q}
                </span>
                <button
                  onClick={() => qty(id, 1)}
                  aria-label="Больше"
                  className="w-6 h-6 rounded-md border border-line dark:border-line-dark font-bold grid place-items-center"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    const n = new Map(cart);
                    n.delete(id);
                    setCart(n);
                  }}
                  className="ml-auto text-[11.5px] text-muted dark:text-muted-dark underline"
                >
                  Убрать
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-line dark:border-line-dark mt-3.5 pt-3 flex flex-col gap-1.5 text-[12.5px]">
        <div className="flex justify-between">
          <span>Билеты{seats ? ` · ${seats}` : ""}</span>
          <span>{money(sub)}</span>
        </div>
        <div className="flex justify-between">
          <span>Сборы и налоги (8%)</span>
          <span>{money(fees)}</span>
        </div>
        <div className="flex justify-between">
          <span>Сервисный сбор</span>
          <span>{money(svc)}</span>
        </div>
        <div className="flex justify-between border-t border-line dark:border-line-dark pt-2.5 mt-1 text-[16px] font-bold">
          <span>Итого</span>
          <span>{money(grand)}</span>
        </div>
      </div>

      <button
        disabled={!entries.length}
        onClick={() => {
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        }}
        className={
          "w-full mt-3.5 rounded-xl py-3 text-[13.5px] font-bold " +
          (entries.length
            ? "bg-mint text-ink hover:brightness-95"
            : "bg-line dark:bg-line-dark text-muted dark:text-muted-dark cursor-not-allowed")
        }
      >
        {done
          ? "Бронь оформлена ✓"
          : entries.length
            ? `Оформить бронь · ${money(grand)}`
            : "Оформить бронь"}
      </button>
    </aside>
  );
}

/* ---------------- root component ---------------- */
const BLANK = {
  price: [50, 400],
  time: [0, 24],
  rate: 0,
  airlines: new Set(),
  stops: new Set(),
  trip: "any",
};

const HERO_IMG = "https://picsum.photos/seed/golobe-hero-runway/1600/500";

export default function Flights() {
  const [f, setF] = useState(BLANK);
  const [sort, setSort] = useState("cheap");
  const [cart, setCart] = useState(new Map());
  const [liked, setLiked] = useState(new Set());
  const [dark, setDark] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const rows = useMemo(
    () =>
      FLIGHTS.filter((x) => {
        const h = hourOf(x.dep);
        if (x.price < f.price[0] || x.price > f.price[1]) return false;
        if (h < f.time[0] || h > f.time[1]) return false;
        if (x.rate < f.rate) return false;
        if (f.airlines.size && !f.airlines.has(x.air)) return false;
        if (f.stops.size && !f.stops.has(Math.min(x.stops, 2))) return false;
        if (f.trip !== "any" && x.trip !== f.trip) return false;
        return true;
      }).sort((a, b) => {
        if (sort === "cheap") return a.price - b.price;
        if (sort === "fast") return a.min - b.min;
        const score = (x) => x.rate * 22 - x.price / 6 - x.min / 12;
        return score(b) - score(a);
      }),
    [f, sort],
  );

  const cheapest = rows.length ? Math.min(...rows.map((x) => x.price)) : null;
  const fastest = rows.length ? Math.min(...rows.map((x) => x.min)) : null;
  const avg = rows.length
    ? Math.round(rows.reduce((s, x) => s + x.price, 0) / rows.length)
    : null;
  const seats = [...cart.values()].reduce((s, q) => s + q, 0);
  const grandBar = (() => {
    const sub = [...cart.entries()].reduce(
      (s, [id, q]) => s + FLIGHTS.find((x) => x.id === id).price * q,
      0,
    );
    return sub + Math.round(sub * 0.08) + seats * 6;
  })();

  const toggleCart = (id) => {
    const n = new Map(cart);
    n.has(id) ? n.delete(id) : n.set(id, 1);
    setCart(n);
  };

  const resetFilters = () =>
    setF({ ...BLANK, airlines: new Set(), stops: new Set() });

  const SORTS = [
    {
      key: "cheap",
      label: "Дешевле",
      note: cheapest !== null ? money(cheapest) : "—",
    },
    {
      key: "best",
      label: "Лучшее",
      note: rows.length ? "цена + рейтинг" : "—",
    },
    {
      key: "fast",
      label: "Быстрее",
      note: fastest !== null ? dur(fastest) : "—",
    },
  ];

  const field =
    "border border-line dark:border-line-dark rounded-xl px-3 py-1.5 min-w-0";
  const fieldLabel =
    "block text-[10.5px] font-semibold text-muted dark:text-muted-dark";
  const fieldInput =
    "w-full bg-transparent border-0 p-0 text-[13px] font-semibold focus:outline-none";

  return (
    <div className="min-h-screen bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-light font-sans">
      <div className="max-w-[1240px] mx-auto px-5 pt-5">
        <div className="relative overflow-hidden rounded-2xl mb-5">
          <img
            src={HERO_IMG}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent dark:from-black/85 dark:via-black/55" />
          <div className="relative px-6 py-9 sm:px-10 sm:py-12 max-w-md">
            <h1 className="text-white text-[26px] sm:text-[32px] font-bold leading-tight">
              Составьте вишлист поездок — остальное сделаем мы
            </h1>
            <p className="text-white/80 text-[13px] mt-2.5">
              Специальные предложения под ваш маршрут: Лахор → Карачи и обратно.
            </p>
          </div>
        </div>

        <div
          className={
            PANEL +
            " p-3 grid gap-2.5 md:grid-cols-[1.5fr_.8fr_1.2fr_1.2fr_auto]"
          }
        >
          <label className={field}>
            <span className={fieldLabel}>Откуда — Куда</span>
            <input defaultValue="Лахор — Карачи" className={fieldInput} />
          </label>
          <label className={field}>
            <span className={fieldLabel}>Тип</span>
            <select
              value={f.trip}
              onChange={(e) => setF({ ...f, trip: e.target.value })}
              className={fieldInput}
            >
              <option value="any">Все</option>
              <option value="round">Туда-обратно</option>
              <option value="one">В одну сторону</option>
              <option value="multi">Мульти-город</option>
            </select>
          </label>
          <label className={field}>
            <span className={fieldLabel}>Вылет — Возврат</span>
            <input defaultValue="07 ноя — 13 ноя" className={fieldInput} />
          </label>
          <label className={field}>
            <span className={fieldLabel}>Пассажиры и класс</span>
            <input defaultValue="1 пассажир, эконом" className={fieldInput} />
          </label>
          <button className="rounded-xl bg-mint text-ink font-bold px-7 py-3 shadow-md shadow-mint/30 hover:brightness-95 transition">
            Искать
          </button>
        </div>
      </div>

      <main
        className="max-w-[1240px] mx-auto px-5 py-5 pb-24 lg:pb-16 grid gap-6 items-start
                   lg:grid-cols-[238px_minmax(0,1fr)] xl:grid-cols-[238px_minmax(0,1fr)_288px]"
      >
        <Filters f={f} set={setF} reset={resetFilters} />

        <section>
          <div className={PANEL + " grid grid-cols-3 overflow-hidden mb-3.5"}>
            {SORTS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                aria-pressed={sort === s.key}
                className={
                  "text-left px-3.5 py-3 border-b-[3px] " +
                  (i < 2
                    ? "border-r border-r-line dark:border-r-line-dark "
                    : "") +
                  (sort === s.key
                    ? "border-b-mint bg-mint-tint dark:bg-mint-night"
                    : "border-b-transparent")
                }
              >
                <b className="block text-[13px]">{s.label}</b>
                <small className="text-[11.5px] text-muted dark:text-muted-dark">
                  {s.note}
                </small>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-3 text-[12.5px] text-muted dark:text-muted-dark">
            <span>
              Показано{" "}
              <b className="text-ink dark:text-ink-light">{rows.length}</b> из{" "}
              <b className="text-ink dark:text-ink-light">{FLIGHTS.length}</b>{" "}
              рейсов
            </span>
            {avg !== null && <span>средняя цена {money(avg)}</span>}
          </div>

          {rows.length === 0 ? (
            <div className={PANEL + " py-12 px-6 text-center"}>
              <h3 className="text-[16px] font-semibold mb-1.5">
                Под эти фильтры рейсов нет
              </h3>
              <p className="text-[13px] text-muted dark:text-muted-dark mb-4">
                Расширьте диапазон цены или времени вылета.
              </p>
              <button
                onClick={resetFilters}
                className="rounded-lg bg-mint text-ink font-bold px-5 py-2.5"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            rows.map((x) => (
              <FlightCard
                key={x.id}
                f={x}
                inCart={cart.has(x.id)}
                liked={liked.has(x.id)}
                onAdd={() => toggleCart(x.id)}
                onLike={() => {
                  const n = new Set(liked);
                  n.has(x.id) ? n.delete(x.id) : n.add(x.id);
                  setLiked(n);
                }}
              />
            ))
          )}
        </section>

        <Cart
          cart={cart}
          setCart={setCart}
          className="hidden xl:block sticky top-[92px]"
        />
      </main>

      {/* мобильная корзина */}
      <div className="xl:hidden">
        {openCart && (
          <div className="fixed left-3 right-3 bottom-3 z-50 max-h-[74vh] overflow-auto shadow-2xl">
            <Cart cart={cart} setCart={setCart} />
          </div>
        )}
        {!openCart && (
          <button
            onClick={() => setOpenCart(true)}
            className="fixed left-3 right-3 bottom-3 z-40 flex items-center justify-between
                       bg-ink text-white dark:bg-mint dark:text-ink rounded-xl px-5 py-3.5 text-[13.5px] font-bold"
          >
            <span>
              {seats
                ? `${seats} ${plural(seats, "билет", "билета", "билетов")} в корзине`
                : "Корзина пуста"}
            </span>
            <span>{money(grandBar)}</span>
          </button>
        )}
        {openCart && (
          <button
            onClick={() => setOpenCart(false)}
            className="fixed inset-0 z-40 bg-black/30"
            aria-label="Закрыть корзину"
          />
        )}
      </div>
    </div>
  );
}
