-- Script para asignar países a los proveedores de pago
-- Primero verifica qué países existen
SELECT id,
    code,
    name
FROM countries
LIMIT 10;
-- Si necesitas Argentina específicamente, puedes usar:
-- UPDATE payment_providers 
-- SET country_id = (SELECT id FROM countries WHERE code = 'ARG')
-- WHERE country_id IS NULL;
-- O para asignar a todos un país por defecto (Argentina):
UPDATE payment_providers
SET country_id = (
        SELECT id
        FROM countries
        WHERE code = 'ARG'
        LIMIT 1
    )
WHERE country_id IS NULL;
-- Verifica que se actualizaron correctamente
SELECT paymentProviderId,
    name,
    code,
    country_id
FROM payment_providers
LIMIT 10;
-- Si quieres ver el país asociado:
SELECT pp.paymentProviderId,
    pp.name,
    pp.code,
    c.code as country_code,
    c.name as country_name
FROM payment_providers pp
    LEFT JOIN countries c ON pp.country_id = c.id
LIMIT 10;