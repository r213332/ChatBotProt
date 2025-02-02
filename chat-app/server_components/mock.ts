export function fetchMockData() {
  return new Promise<{ id: number; name: string; email: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.org",
      });
    }, 1000);
  });
}
