export  interface OriginalResponse{

  service: string; 
  startDate: string | moment.Moment | null; 
  endDate: string; statusCode: number; 
  statusDescription: string; 
  headers: null; 
  body: null | any | object; 
  backend: {
     Code: string; 
     Message: string; 
     Mark: string; 
  }; 
  error: Record<string, any>; 


}

export default interface RestaurantModel{
 data:[ {
          // almacen_id: string,
          // almacen_descripcion: string,
          // cantidad: number,
          // costo: number,
          // item_descripcion: string,
          // categoria_descripcion: string,
          // unidadmedidainsumo_descripcion: string,
          // item_id: string,
          // item_tipo: number,
          // item_subtipo: number,
          // item_prefijo: string
        }
      ]
}

