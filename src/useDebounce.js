import { useState, useEffect } from 'react';

// 'value'가 바뀌는 것을 'delay' 시간만큼 지연시켜주는 훅
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 'delay' 시간 후에 debouncedValue를 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 'value'가 바뀌면(사용자가 타이핑을 계속하면) 이전 타이머 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}