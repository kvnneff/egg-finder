SELECT * FROM locations
WHERE to_tsvector(name || ' ' || description) @@ to_tsquery($1);
