# FM-API-Calls

## Order of Calls

We will need to know the client ID from FotoMerchant in order to make the next call

##### [Get List Orders](https://apidocs.fotomerchanthv.com/#50f62df8-f1b7-b697-f8d7-e55862e6e390)
> `https://api.fotomerchanthv.com/orders?page=1&limit=100&type=all&orderDir=DESC&supplierStatuses=READY_FOR_SUPPLIER`
> This will return all of the objects for orders

We will need to loop through every object to grab `order.id` for the next call

##### [Get Order (Lab)](https://apidocs.fotomerchanthv.com/#98583907-3094-57d8-0fbe-ae1c5c566b12)
> `https://api.fotomerchanthv.com/orders/EYVADV8OF0-RH7-1Z5VR2/lab`
> This is will give us all order information 
