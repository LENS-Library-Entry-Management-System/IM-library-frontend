export const LABELS = {
  date_desc: "Date — latest first",
  date_asc: "Date — earliest first",
  name_az: "Name — A → Z",
  name_za: "Name — Z → A",
  time_desc: "Time — latest first",
  time_asc: "Time — earliest first",
} as const

export type SortOption = keyof typeof LABELS
