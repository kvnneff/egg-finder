SELECT * FROM locations
WHERE to_tsvector(name || ' ' || description) @@ plainto_tsquery($1);
