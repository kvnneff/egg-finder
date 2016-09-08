SELECT *
  FROM locations
  WHERE ST_DWithin(geography(geom), ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
  AND is_public=true
