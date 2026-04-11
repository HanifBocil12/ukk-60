import { useEffect } from "react";
import { fetchData } from "./fetch";

export function useEffectCustom(url, setter) {
  useEffect(() => {
    fetchData(url,setter)
  }, [url, setter]);
}