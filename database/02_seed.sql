-- ============================================================
-- NewsPortal Seed Data
-- Default users for testing / demo purposes
-- Passwords are BCrypt-hashed (cost 11)
--   admin / Admin@123
--   demo  / Demo@123
-- Note: The application also auto-seeds these on first startup.
-- ============================================================

USE [NewsPortal];
GO

IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Username] = N'admin')
BEGIN
    INSERT INTO [Users] ([FullName], [Email], [Username], [PasswordHash])
    VALUES (
        N'Administrator',
        N'admin@newshub.com',
        N'admin',
        N'$2a$11$zDiJsfI33U2nyybgh4O2pee.k5iMpmb2Wcim7A72lkZBBbzDLUxWC'
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Username] = N'demo')
BEGIN
    INSERT INTO [Users] ([FullName], [Email], [Username], [PasswordHash])
    VALUES (
        N'Demo User',
        N'demo@newshub.com',
        N'demo',
        N'$2a$11$esVTDCM7dhv2WgQLYhTmrum2SgBfwlpoc2DHc27ISVcIKfkHN5oM2'
    );
END
GO
