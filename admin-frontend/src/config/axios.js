import { BACKEND_URL } from "./api";

const buildUrl = (path) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${normalizedPath}`;
};

const request = async (method, path, data, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let body = options.body;

  if (data !== undefined) {
    if (data instanceof FormData) {
      body = data;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(data);
    }
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body,
  });

  const contentType = response.headers.get("content-type") || "";
  const responseData = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("adminToken");
    }

    const error = new Error(
      (responseData && responseData.message) ||
        (typeof responseData === "string" ? responseData : "") ||
        `Request failed with status ${response.status}`
    );

    error.response = {
      status: response.status,
      data: responseData,
    };
    throw error;
  }

  return {
    data: responseData,
    status: response.status,
    ok: response.ok,
  };
};

const adminApi = {
  get: (path, options) => request("GET", path, undefined, options),
  post: (path, data, options) => request("POST", path, data, options),
  put: (path, data, options) => request("PUT", path, data, options),
  delete: (path, options) => request("DELETE", path, undefined, options),
};

export default adminApi;
