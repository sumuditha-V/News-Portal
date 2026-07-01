-- ============================================================
-- NewsPortal Database Schema
-- Run this script on a fresh MS SQL Server instance
-- ============================================================

-- Step 1: Create the database (skip if already created via 00_create_database.sql)
-- USE [NewsPortal];
-- GO

-- Step 2: EF Migrations history table
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

-- Step 3: Users table (with FullName and Email added for registration)
IF OBJECT_ID(N'[dbo].[Users]') IS NULL
BEGIN
    CREATE TABLE [Users] (
        [Id]           int           NOT NULL IDENTITY,
        [FullName]     nvarchar(100) NOT NULL DEFAULT N'',
        [Email]        nvarchar(255) NOT NULL DEFAULT N'',
        [Username]     nvarchar(64)  NOT NULL,
        [PasswordHash] nvarchar(255) NOT NULL,
        [CreatedAt]    datetime2     NOT NULL DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );

    CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);
END;
GO

IF OBJECT_ID(N'[dbo].[Articles]') IS NULL
BEGIN
    CREATE TABLE [Articles] (
        [Id]           uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Url]          nvarchar(max)    NOT NULL,
        [UrlHash]      nvarchar(64)     NOT NULL,
        [SourceId]     nvarchar(200)    NULL,
        [SourceName]   nvarchar(300)    NULL,
        [Author]       nvarchar(500)    NULL,
        [Title]        nvarchar(1000)   NOT NULL,
        [Description]  nvarchar(max)    NULL,
        [UrlToImage]   nvarchar(max)    NULL,
        [PublishedAt]  datetime2        NULL,
        [Content]      nvarchar(max)    NULL,
        [CreatedAt]    datetime2        NOT NULL DEFAULT (SYSUTCDATETIME()),
        [UpdatedAt]    datetime2        NOT NULL DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT [PK_Articles] PRIMARY KEY ([Id])
    );

    CREATE UNIQUE INDEX [IX_Articles_UrlHash] ON [Articles] ([UrlHash]);
END;
GO

-- Step 4: Record applied migrations
IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260624113142_InitialCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260624113142_InitialCreate', N'10.0.9');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260624133155_AddUserRegistrationFields')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260624133155_AddUserRegistrationFields', N'10.0.9');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260624133630_SyncModelSnapshot')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260624133630_SyncModelSnapshot', N'10.0.9');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260701133814_AddPersistentArticles')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260701133814_AddPersistentArticles', N'10.0.9');
END;
GO
