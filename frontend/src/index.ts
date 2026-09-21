export type Props = {
  children: React.ReactNode;
}

export interface LoginType {
  username: string;
  password: string;
}

export interface AdminType {
  public_id: string;
  name: string;
  username: string;
  role: string;
  company_site?: string;
}

export type NewInternFormType = {
  firstName: string | null;
  lastName: string | null;
  schoolName: string | null;
  requiredHours: number | null;
  companySite: string | null;
}

export interface InternType {
  intern_id: string;
  first_name: string;
  last_name: string;
  school_name: string;
  required_hours: number;
  completed_hours: number;
  company_site: string;
  started_at: string;
}

export interface InternStatsType {
  intern_id: string;
  first_name: string;
  last_name: string;
  required_hours: number;
  completed_hours: number;
}

export interface PaginationType {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface InternWithPagination {
  interns: InternType[];
  pagination: PaginationType;
}

export type SiteListType = 'exxa' | 'terra' | 'gbf' | 'giga';


export type DropdownListType = {
  id: string;
  name: string;
}

export type PhotoDataType = {
  url?: string;
  data?: File;
}

export type AttendanceStatusType = {
  status: "time_in" | "time_out";
}