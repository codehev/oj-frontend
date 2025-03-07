export interface QueryParams {
  [key: string]: string | number | boolean;
}

export interface BreadcrumbItem {
  path: string;
  name: string;
  disabled?: boolean;
  query?: QueryParams;
} 