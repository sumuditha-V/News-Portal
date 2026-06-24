-- Creates the NewsPortal database if it doesn't exist.
-- Run against the master database.

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'NewsPortal')
BEGIN
    CREATE DATABASE [NewsPortal];
END
GO
