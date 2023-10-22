import { useDispatch } from 'react-redux';

export function useApiDispatch() {
  const dispatch = useDispatch();
  return dispatch;
}
