export const formatCurrency = (amount: number) => `₹${new Intl.NumberFormat("en-IN").format(amount)}`;

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", options ?? { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));

export const getAvailability = (total: number, booked: number) => Math.max(total - booked, 0);
