using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewsPortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRegistrationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Columns already added in partial migration run; use IF NOT EXISTS pattern via SQL
            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM sys.columns
                    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'Email'
                )
                BEGIN
                    ALTER TABLE [Users] ADD [Email] nvarchar(255) NOT NULL DEFAULT N'';
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM sys.columns
                    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'FullName'
                )
                BEGIN
                    ALTER TABLE [Users] ADD [FullName] nvarchar(100) NOT NULL DEFAULT N'';
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Email", table: "Users");
            migrationBuilder.DropColumn(name: "FullName", table: "Users");
        }
    }
}
