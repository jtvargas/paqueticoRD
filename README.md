# paqueticoRD

### API Test results
```
🚀 Server running on port 3001.
✅ Successfully connected to database
  Authentication
    POST /register
      ✓ should register user (102ms)
      ✓ should fail with missing fields (no name)
      ✓ should fail with missing fields (no company id)
      ✓ should fail with missing fields (no email)
      ✓ should fail with missing fields (no password)
    POST /login
      ✓ should log in successfully (77ms)
      ✓ should fail with missing fields (email)
      ✓ should fail with missing fields (password)
      ✓ should fail with missing fields (companyId)
      ✓ should fail with wrong password (77ms)
      ✓ should fail with user not found

  Payments
    POST /payments
      ✓ should create payment method
      ✓ should fail with authentication error
      ✓ should fail with missing fields (name)
      ✓ should fail with missing fields (cvv)
      ✓ should fail with missing fields (number)
      ✓ should fail with missing fields (expiration)
      ✓ should fail with missing fields (type)
      ✓ should fail with invalid type
      ✓ should fail with invalid card number (too short)
      ✓ should fail with invalid card number (too long)
      ✓ should fail with invalid card number (not a number)
      ✓ should fail with invalid cvv (not a number)
      ✓ should fail with invalid expiration date (format)
      ✓ should fail with invalid expiration date (format 2)
      ✓ should fail since card is already registered
    GET /payments
      ✓ should fail with authentication error
      ✓ should return empty list
      ✓ should return payment method list
    DELETE /payments
      ✓ should delete payment method
      ✓ should fail with authentication error
      ✓ should fail with payment method not found

  Recarga
    GET /contracts
      ✓ should list contracts (empty)
      ✓ should list contracts (list)
      ✓ should fail with authentication error
    POST /recarga
      ✓ should create data order successfully
      ✓ should create voice order successfully
      ✓ should add balance successfully
      ✓ should fail with missing fields (contractId)
      ✓ should fail with missing fields (paymentMethodId)
      ✓ should fail with missing fields (amount)
      ✓ should fail with missing fields (type)
      ✓ should fail with invalid balance type
      ✓ should fail with invalid order amount
      ✓ should fail with payment method not found
      ✓ should fail with payment method not owned
      ✓ should fail with contract not found
      ✓ should fail with contract not owned
      ✓ should update last recharge details (data)
      ✓ should update last recharge details (voice)


  50 passing (7s)
  ```
