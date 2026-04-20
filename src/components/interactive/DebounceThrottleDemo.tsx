import {useMemo, useRef, useState} from 'react';

function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function throttle<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

export default function DebounceThrottleDemo() {
  const [text, setText] = useState('');
  const [debounceCount, setDebounceCount] = useState(0);
  const [throttleCount, setThrottleCount] = useState(0);
  const inputEvents = useRef(0);

  const onDebounce = useMemo(
    () =>
      debounce(() => {
        setDebounceCount((c) => c + 1);
      }, 500),
    [],
  );

  const onThrottle = useMemo(
    () =>
      throttle(() => {
        setThrottleCount((c) => c + 1);
      }, 500),
    [],
  );

  return (
    <div className="rounded-lg border border-solid border-gray-200 p-4 dark:border-gray-700">
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
        连续输入并观察触发次数：防抖会等你停下来，节流会按固定间隔触发。
      </p>
      <input
        className="mb-3 w-full rounded border border-solid border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
        value={text}
        onChange={(e) => {
          inputEvents.current += 1;
          setText(e.target.value);
          onDebounce();
          onThrottle();
        }}
        placeholder="快速输入一些文字..."
      />
      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
        <div>输入事件次数: {inputEvents.current}</div>
        <div>防抖触发次数: {debounceCount}</div>
        <div>节流触发次数: {throttleCount}</div>
      </div>
    </div>
  );
}
