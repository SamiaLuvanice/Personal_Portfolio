export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const submitContactForm = async (payload: ContactPayload) => {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit contact form");
  }

  return response.json();
};
