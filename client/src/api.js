const api = async (path, method, body) => {
  const res = await fetch("/api" + path, {
    headers: {
      "Content-Type": "application/json",
    },
    method,
    body: method === "GET" ? null : JSON.stringify(body),
  });
  if (res.status === 401) window.location.reload();
  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export default api;
