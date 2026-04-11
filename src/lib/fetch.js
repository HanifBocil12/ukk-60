export const fetchData = async (url, setter) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    setter(data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};