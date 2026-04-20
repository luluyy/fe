import {useMemo, useState} from 'react';

export default function StoragePlayground() {
  const [key, setKey] = useState('demo-key');
  const [value, setValue] = useState('hello');
  const [readValue, setReadValue] = useState<string | null>(null);

  const safe = useMemo(
    () =>
      typeof window !== 'undefined'
        ? {
            local: window.localStorage,
            session: window.sessionStorage,
          }
        : null,
    [],
  );

  return (
    <div className="rounded-lg border border-solid border-gray-200 p-4 dark:border-gray-700">
      <div className="grid gap-2 md:grid-cols-2">
        <input
          className="rounded border border-solid border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="key"
        />
        <input
          className="rounded border border-solid border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="value"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="rounded bg-emerald-600 px-3 py-1 text-white"
          onClick={() => safe?.local.setItem(key, value)}>
          写入 localStorage
        </button>
        <button
          className="rounded bg-sky-600 px-3 py-1 text-white"
          onClick={() => safe?.session.setItem(key, value)}>
          写入 sessionStorage
        </button>
        <button
          className="rounded bg-gray-700 px-3 py-1 text-white"
          onClick={() => setReadValue(safe?.local.getItem(key) ?? null)}>
          读取 localStorage
        </button>
      </div>
      <p className="mt-3 text-sm">读取结果: {readValue ?? '(null)'}</p>
    </div>
  );
}
