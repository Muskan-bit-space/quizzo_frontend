import { useEffect, useState } from "react";
export function useResource(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setState({ data: null, loading: true, error: null });
      return loader();
    }).then(data => {
      if (active) setState({ data, loading: false, error: null });
    }).catch(error => {
      if (active) setState({ data: null, loading: false, error });
    });
    return () => { active = false; };
  }, [loader, version]);
  return { ...state, reload: () => setVersion(value => value + 1) };
}
