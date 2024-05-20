// ERROR TYPES
export type ErrorResponse = {
  errorMessage: string;
};

// LOGIN TYPES
export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginApiResponse = {
  statusCode: number;
  data: {
    success: boolean;
    access_token: string;
  };
};

// REGISTER TYPES
export type RegisterCredentials = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterApiResponse = {
  statusCode: number;
  data: User;
};

// USER TYPES
export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

// EVENTS TYPES
export type Event = {
  name: string;
  description: string;
  type: string;
  capacity: number;
};

export type EventRetrieved = {
  id: number;
  name: string;
  description: string;
  type: string;
  capacity: number;
};

export type EventApiResponse = {
  statusCode: number;
  data: EventRetrieved;
};

export type EventsGetApiResponse = {
  statusCode: number;
  data: EventRetrieved[];
};

export type DeletedEventApiResponse = {
  statusCode: number;
  data: {
    message: string;
  };
};
