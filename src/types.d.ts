import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;          
      organizationId: string;  
      email: string;           
      role: 'STUDENT' | 'ADMIN' | 'MASTER_ADMIN'; 
      approved: boolean;      
      name?: string;          
    };
  }
}
