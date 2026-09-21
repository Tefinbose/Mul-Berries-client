const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mull-berries-server.onrender.com/api";

type ApiOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const baseUrl = API_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.replace(/^\/+/, "");

  const url = `${baseUrl}/${cleanEndpoint}`;

  console.log("API BASE URL:", API_URL);
  console.log("API REQUEST:", url);

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(headers || {}),
    },
  });

  const responseText = await response.text();
  let data: unknown = null;

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        "The server returned an invalid JSON response."
      );
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Something went wrong";

    throw new Error(
      message
    );
  }

  return data as T;
}

export { API_URL };