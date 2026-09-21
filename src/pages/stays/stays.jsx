import { useState, useMemo, useEffect } from "react";

/**
 * Stays
 * Требует Tailwind CSS (JIT / v3+) с теми же токенами темы, что и компонент Flights —
 * конфиг и стили ползунка см. в README-блоке внизу файла (идентичны Flights.jsx).
 * Зависимостей, кроме React, нет.
 */

// picsum.photos отдаёт стабильные фотографии по seed — удобно для демо-данных.
// В проде замените photos на реальные фото объекта из вашего бэкенда.
const img = (seed, n = 1) =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/600/420`);

const STAYS = [
  { id: 1, name: "CVK Park Bosphorus Hotel", city: "Стамбул, Турция", type: "hotel", price: 240, night: 240, rate: 4.6, rev: 318, amenities: ["wifi", "pool", "breakfast", "gym"], photos: img("cvk-bosphorus", 3) },
  { id: 2, name: "Taksim Garden Suites", city: "Стамбул, Турция", type: "apartment", price: 132, night: 132, rate: 4.2, rev: 96, amenities: ["wifi", "kitchen"], photos: img("taksim-suites", 3) },
  { id: 3, name: "Bosphorus Breeze Resort", city: "Стамбул, Турция", type: "resort", price: 310, night: 310, rate: 4.8, rev: 512, amenities: ["wifi", "pool", "spa", "breakfast"], photos: img("bosphorus-breeze", 3) },
  { id: 4, name: "Old Town Boutique Villa", city: "Стамбул, Турция", type: "villa", price: 265, night: 265, rate: 4.5, rev: 74, amenities: ["wifi", "pool", "parking"], photos: img("old-town-villa", 3) },
  { id: 5, name: "Galata Loft Apartments", city: "Стамбул, Турция", type: "apartment", price: 98, night: 98, rate: 3.9, rev: 61, amenities: ["wifi", "kitchen", "parking"], photos: img("galata-loft", 3) },
  { id: 6, name: "Sultanahmet Palace Inn", city: "Стамбул, Турция", type: "hotel", price: 178, night: 178, rate: 4.3, rev: 203, amenities: ["wifi", "breakfast", "gym"], photos: img("sultanahmet-inn", 3) },
  { id: 7, name: "Marmara Sea View Hotel", city: "Стамбул, Турция", type: "hotel", price: 152, night: 152, rate: 4.0, rev: 88, amenities: ["wifi", "pool", "parking"], photos: img("marmara-view", 3) },
  { id: 8, name: "Beyoglu Pet-Friendly Flat", city: "Стамбул, Турция", type: "apartment", price: 87, night: 87, rate: 3.7, rev: 35, amenities: ["wifi", "kitchen", "pets"], photos: img("beyoglu-flat", 3) },
  { id: 9, name: "Uskudar Riverside Villa", city: "Стамбул, Турция", type: "villa", price: 289, night: 289, rate: 4.7, rev: 143, amenities: ["wifi", "pool", "spa", "parking"], photos: img("uskudar-villa", 3) },
  { id: 10, name: "Karakoy Design Resort", city: "Стамбул, Турция", type: "resort", price: 224, night: 224, rate: 4.4, rev: 167, amenities: ["wifi", "pool", "gym", "breakfast"], photos: img("karakoy-resort", 3) },
  { id: 11, name: "Grand Pera Hotel", city: "Стамбул, Турция", type: "hotel", price: 199, night: 199, rate: 4.5, rev: 251, amenities: ["wifi", "breakfast", "spa"], photos: img("grand-pera", 3) },
  { id: 12, name: "Bebek Bay Apartments", city: "Стамбул, Турция", type: "apartment", price: 145, night: 145, rate: 4.1, rev: 58, amenities: ["wifi", "kitchen", "pool"], photos: img("bebek-bay", 3) },
];

const TYPE_LABEL = { hotel: "Отель", apartment: "Апартаменты", resort: "Резорт", villa: "Вилла" };
const AMENITY_LABEL = {
  wifi: "Wi‑Fi", pool: "Бассейн", breakfast: "Завтрак", gym: "Спортзал",
  kitchen: "Кухня", parking: "Парковка", spa: "Спа", pets: "Можно с питомцами",
};
const AMENITY_ICON = {
  wifi: "📶", pool: "🏊", breakfast: "🍳", gym: "🏋️",
  kitchen: "🍽️", parking: "🅿️", spa: "💆", pets: "🐾",
};

const money = (n) => "$" + Math.round(n).toLocaleString("ru-RU");
const plural = (n, a, b, c) =>
  n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c;

const PANEL = "bg-paper dark:bg-paper-dark border border-line dark:border-line-dark rounded-2xl";

/* ---------------- dual range (общий с Flights) ---------------- */
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
    <div className={first ? "py-3" : "border-t border-line dark:border-line-dark py-3"}>
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

function Check({ label, count, checked, onChange, icon }) {
  return (
    <label className="flex items-center gap-2.5 py-1 text-[12.5px] cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-[15px] h-[15px] accent-mint" />
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
      <span className="ml-auto text-[11.5px] text-muted dark:text-muted-dark">{count}</span>
    </label>
  );
}

/* ---------------- filters ---------------- */
function Filters({ f, set, reset }) {
  const amenities = useMemo(() => [...new Set(STAYS.flatMap((x) => x.amenities))], []);
  const toggle = (key, v) => {
    const next = new Set(f[key]);
    next.has(v) ? next.delete(v) : next.add(v);
    set({ ...f, [key]: next });
  };
  return (
    <aside className={PANEL + " p-4 lg:sticky lg:top-[92px]"}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold">Фильтры</h2>
        <button onClick={reset} className="text-[12px] font-semibold text-muted dark:text-muted-dark underline">
          Сбросить
        </button>
      </div>

      <Group title="Цена за ночь" first>
        <DualRange
          min={80}
          max={320}
          step={5}
          value={f.price}
          onChange={(v) => set({ ...f, price: v })}
          format={(v) => money(v) + (v >= 320 ? "+" : "")}
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
                (f.rate === r ? "bg-mint border-mint text-ink" : "border-line dark:border-line-dark")
              }
            >
              {r === 0 ? "Любой" : r + "+"}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Тип жилья">
        {Object.entries(TYPE_LABEL).map(([v, label]) => (
          <Check
            key={v}
            label={label}
            checked={f.types.has(v)}
            count={STAYS.filter((x) => x.type === v).length}
            onChange={() => toggle("types", v)}
          />
        ))}
      </Group>

      <Group title="Удобства">
        {amenities.map((a) => (
          <Check
            key={a}
            label={AMENITY_LABEL[a]}
            icon={AMENITY_ICON[a]}
            checked={f.amenities.has(a)}
            count={STAYS.filter((x) => x.amenities.includes(a)).length}
            onChange={() => toggle("amenities", a)}
          />
        ))}
      </Group>
    </aside>
  );
}

/* ---------------- stay card ---------------- */
function StayCard({ s, inCart, liked, onAdd, onLike }) {
  return (
    <article
      className={
        PANEL +
        " grid sm:grid-cols-[200px_minmax(0,1fr)] overflow-hidden mb-3.5 transition-shadow hover:shadow-lg hover:shadow-mint/10"
      }
    >
      <div className="relative h-44 sm:h-auto">
        <img
          src={s.photos[0]}
          alt={s.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute top-2.5 left-2.5 bg-paper/90 dark:bg-paper-dark/90 backdrop-blur text-[10.5px] font-semibold px-2 py-1 rounded-md">
          {TYPE_LABEL[s.type]}
        </span>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold leading-tight">{s.name}</h3>
            <p className="text-[12px] text-muted dark:text-muted-dark mt-0.5">📍 {s.city}</p>
          </div>
          <div className="text-right">
            <span className="block text-[10.5px] text-muted dark:text-muted-dark">за ночь</span>
            <b className="text-[19px] text-price">{money(s.night)}</b>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 text-[12px] font-semibold">
          <span className="bg-mint text-ink rounded-md px-1.5 py-0.5 text-[11.5px] font-bold">
            {s.rate.toFixed(1)}
          </span>
          <span>
            {s.rate >= 4.5 ? "Отлично" : s.rate >= 4 ? "Очень хорошо" : "Хорошо"} · {s.rev} отзывов
          </span>
        </div>

        <div className="mt-3.5 pt-3 border-t border-line dark:border-line-dark flex flex-wrap items-center gap-2">
          {s.amenities.map((a) => (
            <span
              key={a}
              className="text-[11px] font-semibold text-muted dark:text-muted-dark
                        border border-line dark:border-line-dark rounded-md px-2 py-0.5"
            >
              {AMENITY_ICON[a]} {AMENITY_LABEL[a]}
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
              (inCart ? "bg-ink text-white dark:bg-mint dark:text-ink" : "bg-mint text-ink hover:brightness-95")
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
  const roomNights = entries.reduce((s, [, q]) => s + q, 0);
  const sub = entries.reduce((s, [id, q]) => s + STAYS.find((x) => x.id === id).night * q, 0);
  const fees = Math.round(sub * 0.1);
  const svc = roomNights * 9;
  const grand = sub + fees + svc;
  const [done, setDone] = useState(false);

  const qty = (id, d) => {
    const next = new Map(cart);
    const q = (next.get(id) || 0) + d;
    q <= 0 ? next.delete(id) : next.set(id, Math.min(q, 14));
    setCart(next);
  };

  return (
    <aside className={PANEL + " p-4 " + className}>
      <h2 className="text-[15px] font-semibold">Ваше бронирование</h2>
      <p className="text-[11.5px] text-muted dark:text-muted-dark mb-3">Количество — число ночей</p>

      <div className="flex flex-col gap-2.5 max-h-[46vh] overflow-auto">
        {!entries.length && (
          <div
            className="border border-dashed border-line dark:border-line-dark rounded-xl
                        p-6 text-center text-[12.5px] text-muted dark:text-muted-dark"
          >
            Выберите жильё, чтобы собрать бронь
          </div>
        )}
        {entries.map(([id, q]) => {
          const s = STAYS.find((x) => x.id === id);
          return (
            <div key={id} className="border border-line dark:border-line-dark rounded-xl p-2.5">
              <div className="flex justify-between gap-2 text-[12.5px] font-semibold">
                <span>{s.name}</span>
                <span>{money(s.night * q)}</span>
              </div>
              <div className="text-[11px] text-muted dark:text-muted-dark mt-0.5">
                {s.city} · {money(s.night)} / ночь
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => qty(id, -1)}
                  aria-label="Меньше ночей"
                  className="w-6 h-6 rounded-md border border-line dark:border-line-dark font-bold grid place-items-center"
                >
                  −
                </button>
                <span className="text-[12.5px] font-semibold w-14 text-center">
                  {q} {plural(q, "ночь", "ночи", "ночей")}
                </span>
                <button
                  onClick={() => qty(id, 1)}
                  aria-label="Больше ночей"
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
          <span>Проживание{roomNights ? ` · ${roomNights} ${plural(roomNights, "ночь", "ночи", "ночей")}` : ""}</span>
          <span>{money(sub)}</span>
        </div>
        <div className="flex justify-between">
          <span>Налоги и сборы (10%)</span>
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
        {done ? "Бронь оформлена ✓" : entries.length ? `Забронировать · ${money(grand)}` : "Забронировать"}
      </button>
    </aside>
  );
}

/* ---------------- root component ---------------- */
const BLANK = { price: [80, 320], rate: 0, types: new Set(), amenities: new Set() };
const HERO_IMG = "https://picsum.photos/seed/golobe-hero-stays/1600/500";

export default function Stays() {
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
      STAYS.filter((x) => {
        if (x.price < f.price[0] || x.price > f.price[1]) return false;
        if (x.rate < f.rate) return false;
        if (f.types.size && !f.types.has(x.type)) return false;
        if (f.amenities.size && ![...f.amenities].every((a) => x.amenities.includes(a))) return false;
        return true;
      }).sort((a, b) => {
        if (sort === "cheap") return a.price - b.price;
        if (sort === "rating") return b.rate - a.rate;
        const score = (x) => x.rate * 30 - x.price / 4;
        return score(b) - score(a);
      }),
    [f, sort]
  );

  const cheapest = rows.length ? Math.min(...rows.map((x) => x.price)) : null;
  const topRated = rows.length ? Math.max(...rows.map((x) => x.rate)) : null;
  const avg = rows.length ? Math.round(rows.reduce((s, x) => s + x.price, 0) / rows.length) : null;
  const nights = [...cart.values()].reduce((s, q) => s + q, 0);
  const grandBar = (() => {
    const sub = [...cart.entries()].reduce((s, [id, q]) => s + STAYS.find((x) => x.id === id).night * q, 0);
    return sub + Math.round(sub * 0.1) + nights * 9;
  })();

  const toggleCart = (id) => {
    const n = new Map(cart);
    n.has(id) ? n.delete(id) : n.set(id, 1);
    setCart(n);
  };

  const resetFilters = () => setF({ ...BLANK, types: new Set(), amenities: new Set() });

  const SORTS = [
    { key: "cheap", label: "Дешевле", note: cheapest !== null ? money(cheapest) : "—" },
    { key: "best", label: "Лучшее", note: rows.length ? "цена + рейтинг" : "—" },
    { key: "rating", label: "Рейтинг", note: topRated !== null ? topRated.toFixed(1) : "—" },
  ];

  const field = "border border-line dark:border-line-dark rounded-xl px-3 py-1.5 min-w-0";
  const fieldLabel = "block text-[10.5px] font-semibold text-muted dark:text-muted-dark";
  const fieldInput = "w-full bg-transparent border-0 p-0 text-[13px] font-semibold focus:outline-none";

  return (
    <div className="min-h-screen bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-light font-sans">
      <div className="max-w-[1240px] mx-auto px-5 pt-5">
        <div className="relative overflow-hidden rounded-2xl mb-5">
          <img src={HERO_IMG} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent dark:from-black/85 dark:via-black/55" />
          <div className="relative px-6 py-9 sm:px-10 sm:py-12 max-w-md">
            <h1 className="text-white text-[26px] sm:text-[32px] font-bold leading-tight">
              Найдите жильё, в которое захочется вернуться
            </h1>
            <p className="text-white/80 text-[13px] mt-2.5">
              Отели, апартаменты и виллы в Стамбуле — на любые даты и бюджет.
            </p>
          </div>
        </div>

        <div className={PANEL + " p-3 grid gap-2.5 md:grid-cols-[1.5fr_1.2fr_1.2fr_.8fr_auto]"}>
          <label className={field}>
            <span className={fieldLabel}>Куда едем</span>
            <input defaultValue="Стамбул, Турция" className={fieldInput} />
          </label>
          <label className={field}>
            <span className={fieldLabel}>Заезд</span>
            <input defaultValue="07 ноя 2026" className={fieldInput} />
          </label>
          <label className={field}>
            <span className={fieldLabel}>Выезд</span>
            <input defaultValue="13 ноя 2026" className={fieldInput} />
          </label>
          <label className={field}>
            <span className={fieldLabel}>Гости</span>
            <input defaultValue="2 гостя, 1 номер" className={fieldInput} />
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
                  (i < 2 ? "border-r border-r-line dark:border-r-line-dark " : "") +
                  (sort === s.key ? "border-b-mint bg-mint-tint dark:bg-mint-night" : "border-b-transparent")
                }
              >
                <b className="block text-[13px]">{s.label}</b>
                <small className="text-[11.5px] text-muted dark:text-muted-dark">{s.note}</small>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-3 text-[12.5px] text-muted dark:text-muted-dark">
            <span>
              Показано <b className="text-ink dark:text-ink-light">{rows.length}</b> из{" "}
              <b className="text-ink dark:text-ink-light">{STAYS.length}</b> вариантов
            </span>
            {avg !== null && <span>средняя цена {money(avg)} / ночь</span>}
          </div>

          {rows.length === 0 ? (
            <div className={PANEL + " py-12 px-6 text-center"}>
              <h3 className="text-[16px] font-semibold mb-1.5">Под эти фильтры жилья нет</h3>
              <p className="text-[13px] text-muted dark:text-muted-dark mb-4">
                Расширьте диапазон цены или уберите часть удобств.
              </p>
              <button onClick={resetFilters} className="rounded-lg bg-mint text-ink font-bold px-5 py-2.5">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            rows.map((x) => (
              <StayCard
                key={x.id}
                s={x}
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

        <Cart cart={cart} setCart={setCart} className="hidden xl:block sticky top-[92px]" />
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
            <span>{nights ? `${nights} ${plural(nights, "ночь", "ночи", "ночей")} в брони` : "Бронь пуста"}</span>
            <span>{money(grandBar)}</span>
          </button>
        )}
        {openCart && (
          <button
            onClick={() => setOpenCart(false)}
            className="fixed inset-0 z-40 bg-black/30"
            aria-label="Закрыть бронь"
          />
        )}
      </div>
    </div>
  );
}

