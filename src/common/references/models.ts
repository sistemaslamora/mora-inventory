export interface OriginalResponse{

  service: string; 
  startDate: string | moment.Moment | null; 
  endDate: string; statusCode: number; 
  statusDescription: string; 
  headers: null; 
  body: null; 
  backend: {
     Code: string; 
     Message: string; 
     Mark: string; 
  }; 
  error: Record<string, any>; 


}