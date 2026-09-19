import { apiRequest } from "./api";

/* ========================================================= */
/* STAFF USER */
/* ========================================================= */

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
}

export interface StaffProfileResponse {
  success: boolean;
  staff: StaffUser;
}

/* ========================================================= */
/* STAFF DASHBOARD */
/* ========================================================= */

export interface StaffOrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  outForDelivery: number;
  delivered: number;
  cancelled: number;
  returned: number;
}

export interface StaffDashboardResponse {
  success: boolean;

  dashboard: {
    orderStats: StaffOrderStats;

    today: {
      orders: number;
      completed: number;
    };

    recentOrders: any[];

    lowStockProducts: any[];

    permissions: string[];
  };
}

/* ========================================================= */
/* STAFF PROFILE API */
/* ========================================================= */

export const getStaffProfileApi = (token: string) => {
  return apiRequest<StaffProfileResponse>("/staff/profile", {
    method: "GET",
    token,
  });
};

/* ========================================================= */
/* STAFF DASHBOARD API */
/* ========================================================= */

export const getStaffDashboardApi = (token: string) => {
  return apiRequest<StaffDashboardResponse>("/staff/dashboard", {
    method: "GET",
    token,
  });
};

/* ========================================================= */
/* STAFF INVENTORY */
/* ========================================================= */

export interface StaffInventoryProduct {
  _id: string;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images?: string[];
  isActive: boolean;
  variants?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffInventorySummary {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface StaffInventoryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StaffInventoryResponse {
  success: boolean;
  inventory: StaffInventoryProduct[];
  summary: StaffInventorySummary;
  pagination: StaffInventoryPagination;
}

export interface StaffInventoryProductResponse {
  success: boolean;
  product: StaffInventoryProduct;
}

export interface UpdateStaffInventoryResponse {
  success: boolean;
  message: string;

  stock: {
    previous: number;
    current: number;
    difference: number;
  };

  product: StaffInventoryProduct;
}

/* ========================================================= */
/* GET STAFF INVENTORY */
/* ========================================================= */

export const getStaffInventoryApi = (
  token: string,
  params?: {
    search?: string;
    stockStatus?: "all" | "out" | "low" | "in";
    page?: number;
    limit?: number;
  }
) => {
  const query = new URLSearchParams();

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.stockStatus && params.stockStatus !== "all") {
    query.set("stockStatus", params.stockStatus);
  }

  if (params?.page) {
    query.set("page", String(params.page));
  }

  if (params?.limit) {
    query.set("limit", String(params.limit));
  }

  const queryString = query.toString();

  return apiRequest<StaffInventoryResponse>(
    `/staff/inventory${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      token,
    }
  );
};

/* ========================================================= */
/* GET SINGLE INVENTORY PRODUCT */
/* ========================================================= */

export const getStaffInventoryProductApi = (
  token: string,
  productId: string
) => {
  return apiRequest<StaffInventoryProductResponse>(
    `/staff/inventory/${productId}`,
    {
      method: "GET",
      token,
    }
  );
};

/* ========================================================= */
/* UPDATE INVENTORY STOCK */
/* ========================================================= */

export const updateStaffInventoryStockApi = (
  token: string,
  productId: string,
  stock: number
) => {
  return apiRequest<UpdateStaffInventoryResponse>(
    `/staff/inventory/${productId}/stock`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify({
        stock,
      }),
    }
  );
};

/* ========================================================= */
/* STAFF SHIPPING */
/* ========================================================= */

export type ShipmentStatus =
  | "shipment_created"
  | "courier_assigned"
  | "awb_generated"
  | "label_generated"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "ndr"
  | "rto"
  | "return_requested"
  | "returned"
  | "cancelled";

export interface StaffShipmentOrder {
  _id: string;
  orderStatus?: string;
  totalAmount?: number;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffShipmentUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface StaffShipment {
  _id: string;

  order: StaffShipmentOrder | string;

  user?: StaffShipmentUser | string;

  courierName?: string;
  courierProvider?: string;
  courierService?: string;

  awbNumber?: string;
  trackingNumber?: string;
  labelUrl?: string;

  shipmentStatus: ShipmentStatus;

  pickupScheduledAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  estimatedDeliveryDate?: string;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface StaffShipmentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StaffShipmentsResponse {
  success: boolean;
  shipments: StaffShipment[];
  pagination: StaffShipmentPagination;
}

export interface StaffShipmentResponse {
  success: boolean;
  shipment: StaffShipment;
}

export interface CreateStaffShipmentData {
  orderId: string;
  courierName?: string;
  courierProvider?: string;
  courierService?: string;
  estimatedDeliveryDate?: string;
  notes?: string;
}

export interface CreateStaffShipmentResponse {
  success: boolean;
  message: string;
  shipment: StaffShipment;
}

export interface UpdateStaffShipmentStatusResponse {
  success: boolean;
  message: string;
  shipment: StaffShipment;
}

/* ========================================================= */
/* GET ALL STAFF SHIPMENTS */
/* ========================================================= */

export const getStaffShipmentsApi = (
  token: string,
  params?: {
    status?: ShipmentStatus;
    search?: string;
    page?: number;
    limit?: number;
  }
) => {
  const searchParams = new URLSearchParams();

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return apiRequest<StaffShipmentsResponse>(
    `/staff/shipments${query ? `?${query}` : ""}`,
    {
      method: "GET",
      token,
    }
  );
};

/* ========================================================= */
/* GET SINGLE STAFF SHIPMENT */
/* ========================================================= */

export const getStaffShipmentByIdApi = (
  token: string,
  id: string
) => {
  return apiRequest<StaffShipmentResponse>(
    `/staff/shipments/${id}`,
    {
      method: "GET",
      token,
    }
  );
};

/* ========================================================= */
/* CREATE STAFF SHIPMENT */
/* ========================================================= */

export const createStaffShipmentApi = (
  token: string,
  data: CreateStaffShipmentData
) => {
  return apiRequest<CreateStaffShipmentResponse>(
    "/staff/shipments",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
};

/* ========================================================= */
/* UPDATE STAFF SHIPMENT STATUS */
/* ========================================================= */

export const updateStaffShipmentStatusApi = (
  token: string,
  id: string,
  shipmentStatus: ShipmentStatus
) => {
  return apiRequest<UpdateStaffShipmentStatusResponse>(
    `/staff/shipments/${id}/status`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify({
        shipmentStatus,
      }),
    }
  );
};