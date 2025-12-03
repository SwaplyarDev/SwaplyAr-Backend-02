-- Script para poblar las nuevas columnas de rol en la tabla users
UPDATE users 
SET 
  role_code = r.code,
  role_name = r.name,
  role_description = r.description
FROM roles r 
WHERE users.role_id = r.role_id;