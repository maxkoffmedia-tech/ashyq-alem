"use client";

import { useEffect, useMemo, useState } from "react";
// ИСПРАВЛЕНО: Правильные пути относительно папки components
import Shell from "./Shell"; 
import { Card } from "./Card";
import PrimaryButton from "./PrimaryButton";
// ИСПРАВЛЕНО: Используем алиас @ для обращения к корню или корректный относительный путь
import { db, ensureAnonAuth, waitForAuth } from "@/lib/firebase"; 
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

type UserDoc = {
  days?: number;
  points?: number;
  lastUpdated?: any; // Timestamp
  treeLevel?: number;
  name?: string;
};

const FIRST_YURT = 7;
const FIRST_AUL = 30;
const BIG_TOI = 90;

export default function HomePage() {
  const [uid, setUid] = useState<string>("");
  const [data, setData] = useState<UserDoc>({ days: 0, points: 0, treeLevel: 0 });
  const [message, setMessage] = useState<string>("");
  const days = data.days || 0;
  const points = data.points || 0;

  // ширина прогресс-бара
  const barWidth = useMemo(() => {
    const p = Math.min(100, Math.round((days / FIRST_AUL) * 100));
    return `${p}%`;
  }, [days]);

  useEffect(() => {
    (async () => {
      const id = await ensureAnonAuth();
      setUid(id);
      await loadUser(id);
    })();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function loadUser(userId: string) {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);
    if (snap.exists()) setData(snap.data() as UserDoc);
    else {
      const init: UserDoc = { days: 0, points: 0, treeLevel: 0, lastUpdated: null, name: "Қонақ" };
      await setDoc(ref, init);
      setData(init);
    }
  }

  async function plusDay() {
    const id = uid || (await waitForAuth());
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);
    const prev = (snap.exists() ? (snap.data() as UserDoc) : { days: 0, points: 0 }) as UserDoc;
    const nextDays = (prev.days || 0) + 1;
    const nextPoints = (prev.points || 0) + 10;

    await setDoc(ref, {
      days: nextDays,
      points: nextPoints,
      lastUpdated: serverTimestamp(),
      treeLevel: prev.treeLevel || 0,
      name: prev.name || "Қонақ"
    }, { merge: true });

    setData({ ...prev, days: nextDays, points: nextPoints });
  }

  async function undoDay() {
    const id = uid || (await waitForAuth());
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const prev = snap.data() as UserDoc;
    const last = prev.lastUpdated?.toMillis?.() ? prev.lastUpdated.toMillis() : 0;
    if (!last) {
      setMessage("Нет последнего отмеченного дня.");
      return;
    }
    const within24h = Date.now() - last <= 24 * 60 * 60 * 1000;
    if (!within24h) {
      setMessage("Более 24ч — отмена недоступна.");
      return;
    }
    const nextDays = Math.max(0, (prev.days || 0) - 1);
    const nextPoints = Math.max(0, (prev.points || 0) - 10);

    await updateDoc(ref, { days: nextDays, points: nextPoints, lastUpdated: null });
    setData({ ...prev, days: nextDays, points: nextPoints, lastUpdated: null });
  }

  const badge = days >= BIG_TOI
    ? "Батыр"
    : days >= FIRST_AUL
      ? "Ауыл иесі"
      : days >= FIRST_YURT
        ? "Киіз үй"
        : "Жас қыран";

  return (
    <Shell>
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-50">
          {message}
        </div>
      )}
      <div className="bg-steppe rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold">Ashyq Alem <span className="opacity-80">— Ұлы Дала жолы</span></h1>
            <p className="text-gray-600">Анонимно. Жақсы жол. Поддержка рядом.</p>
          </div>
          <div className="flex gap-2">
            <PrimaryButton onClick={plusDay}>+1 день здоровья</PrimaryButton>
            <button onClick={undoDay} className="px-4 py-2 rounded-full border font-semibold hover:bg-gray-50">
              –1 (24ч)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Дни</div>
                <div className="text-3xl font-bold">{days}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Баллы</div>
                <div className="text-3xl font-bold">{points}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Жетон</div>
                <div className="text-xl font-bold">{badge}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-kazBlue transition-all" style={{ width: barWidth }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">7 күн — Киіз үй, 30 күн — Ауыл, 90 күн — Той</p>
            </div>
          </Card>

          <Card>
            <div className="bg-white/60 rounded-xl p-3">
              <div className="h-40 rounded-xl bg-[url('https://i.imgur.com/e7Q4F6n.png')] bg-cover bg-center relative overflow-hidden">
                <div
                  className="absolute bottom-[18%] w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(255,71,87,.8)] transition-all"
                  style={{ left: `${6 + Math.min(1, days / 30) * 72}%` }}
                />
                {days >= 7 && (
                  <img
                    src="https://i.imgur.com/1G6f2S9.png"
                    alt="Юрта"
                    className="absolute bottom-[24%] left-[22%] w-[120px] drop-shadow"
                  />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Карта пути. Продолжай, бауыр, біз біргеміз.</p>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card>
          <h3 className="text-lg font-bold">Для зависимых</h3>
          <p className="text-sm text-gray-600">Материалы, трекеры, тактики отказа, “12 шагов”.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-bold">Для близких</h3>
          <p className="text-sm text-gray-600">Понимание, поддержка, SOS-кнопка, чат сообщества.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-bold">Для молодежи</h3>
          <p className="text-sm text-gray-600">Мифы и реальность, “+1 к здоровью”, клубы, события.</p>
        </Card>
      </div>
    </Shell>
  );
}