TRUNCATE TABLE carts CASCADE;
-- CASCADE automatically truncates cart_items too, but it's fine to leave it

-- Explicitly set IDs to 1 and 2
INSERT INTO carts (id, user_id, status, created_at, updated_at, version)
VALUES
    (1, 'user-1', 'ACTIVE', NOW(), NOW(), 0),
    (2, 'user-2', 'ACTIVE', NOW(), NOW(), 0);

-- Explicitly set Item IDs to 101, 102, etc. so we know exactly what to target in our PUT/DELETE tests
INSERT INTO cart_items (id, cart_id, product_code, product_name, quantity, price, created_at, updated_at, version)
VALUES
    (101, 1, 'B001', 'The Great Gatsby', 2, 10.00, NOW(), NOW(), 0),
    (102, 1, 'B003', 'To Kill a Mockingbird', 1, 15.00, NOW(), NOW(), 0);