UPDATE rules
SET
  conditions = '{"field":"message","operator":"regex","value":"(Windows event 4625|failed logon|failed to log on|account failed to log on|logon failure|failed login)","threshold":8,"timeWindowSeconds":300}'::jsonb,
  updated_at = NOW()
WHERE name = 'Windows Failed Logon Burst';
