-- Seed default users for the News Portal.
-- Passwords are BCrypt-hashed (cost 11).
--   admin / Admin@123
--   demo  / Demo@123
-- The application also seeds these users on first startup if the table is empty.

USE [NewsPortal];
GO

IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Username] = N'admin')
BEGIN
    INSERT INTO [Users] ([Username], [PasswordHash])
    VALUES (N'admin', N'$2a$11$zDiJsfI33U2nyybgh4O2pee.k5iMpmb2Wcim7A72lkZBBbzDLUxWC');
END
GO

IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Username] = N'demo')
BEGIN
    INSERT INTO [Users] ([Username], [PasswordHash])
    VALUES (N'demo', N'$2a$11$esVTDCM7dhv2WgQLYhTmrum2SgBfwlpoc2DHc27ISVcIKfkHN5oM2');
END
GO
